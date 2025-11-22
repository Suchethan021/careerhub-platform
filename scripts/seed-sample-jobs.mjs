import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function parseCsvFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    return row;
  });
}

function mapExperienceLevel(level) {
  const value = (level || '').toLowerCase();
  if (value.startsWith('junior')) return 'entry';
  if (value.startsWith('mid')) return 'mid';
  if (value.startsWith('senior')) return 'senior';
  return 'mid';
}

function mapJobType(employmentType, jobTypeCsv) {
  const emp = (employmentType || '').toLowerCase();
  const jobType = (jobTypeCsv || '').toLowerCase();

  if (jobType.includes('intern')) return 'internship';
  if (emp.includes('full')) return 'full-time';
  if (emp.includes('part')) return 'part-time';
  return 'contract';
}

function parseMagnitude(str) {
  if (!str) return null;
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)([kKlL]?)$/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const suffix = match[2].toLowerCase();
  if (suffix === 'k') return Math.round(value * 1000);
  if (suffix === 'l') return Math.round(value * 100000);
  return value;
}

function parseSalaryRange(range) {
  if (!range) return null;
  const match = range.match(/^(?<currency>[A-Z]{3})\s+(?<min>[\d.]+[kKlL]?)\s*[\u2013-]\s*(?<max>[\d.]+[kKlL]?)\s*\/\s*(?<period>month|year)$/i);
  if (!match || !match.groups) return null;

  const currency = match.groups.currency.toUpperCase();
  const salaryMin = parseMagnitude(match.groups.min);
  const salaryMax = parseMagnitude(match.groups.max);
  const periodRaw = match.groups.period.toLowerCase();
  const salary_period = periodRaw === 'month' ? 'monthly' : 'yearly';

  return {
    salary_currency: currency,
    salary_min: salaryMin,
    salary_max: salaryMax,
    salary_period,
    salary_range_string: range,
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (const arg of args) {
    const [key, value] = arg.split('=');
    if (key === '--companyId') result.companyId = value;
    if (key === '--companySlug') result.companySlug = value;
    if (key === '--limit') result.limit = Number(value);
  }
  return result;
}

async function main() {
  const { companyId, companySlug, limit } = parseArgs();

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON key) as environment variables.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let targetCompanyId = companyId;

  if (!targetCompanyId && companySlug) {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', companySlug)
      .single();

    if (error || !data) {
      console.error('Unable to find company by slug:', error || 'No data');
      process.exit(1);
    }

    targetCompanyId = data.id;
  }

  if (!targetCompanyId) {
    console.error('You must provide either --companyId=<uuid> or --companySlug=<slug>.');
    process.exit(1);
  }

  const csvPath = path.resolve(__dirname, '../sample-data/sample_data.csv');
  const rows = parseCsvFile(csvPath);

  const limitedRows = typeof limit === 'number' && Number.isFinite(limit) ? rows.slice(0, limit) : rows;

  const jobs = limitedRows.map((row) => {
    const salary = parseSalaryRange(row.salary_range);

    return {
      company_id: targetCompanyId,
      title: row.title,
      description:
        `Sample seeded job for ${row.title} in the ${row.department} team. ` +
        'This is placeholder text describing responsibilities, qualifications, and what success looks like in this role.',
      location: row.location,
      job_type: mapJobType(row.employment_type, row.job_type),
      experience_level: mapExperienceLevel(row.experience_level),
      status: 'open',
      salary_min: salary?.salary_min ?? null,
      salary_max: salary?.salary_max ?? null,
      salary_currency: salary?.salary_currency ?? null,
      salary_period: salary?.salary_period ?? null,
      salary_range_string: salary?.salary_range_string ?? null,
      is_featured: false,
    };
  });

  const { data, error } = await supabase
    .from('jobs')
    .insert(jobs);

  if (error) {
    console.error('Error inserting jobs:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data?.length ?? jobs.length} jobs for company ${targetCompanyId}.`);
}

main().catch((err) => {
  console.error('Unexpected error in seed script:', err);
  process.exit(1);
});
