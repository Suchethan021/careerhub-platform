import { createClient } from '@supabase/supabase-js';

// Patch existing seeded jobs: remove # suffix in titles and add salary ranges
// Usage (PowerShell):
//   $env:SUPABASE_URL="https://...";
//   $env:SUPABASE_SERVICE_ROLE_KEY="...";
//   $env:SEED_COMPANY1_SLUG="first-company-slug";
//   $env:SEED_COMPANY2_SLUG="second-company-slug";
//   node ./scripts/fix-seeded-jobs.mjs

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function getSalaryForTitle(title) {
  switch (title) {
    case 'Software Engineer':
      return { min: 1200000, max: 1800000, str: '₹12L – ₹18L per year' };
    case 'Senior Backend Engineer':
      return { min: 2200000, max: 3200000, str: '₹22L – ₹32L per year' };
    case 'Frontend Engineer':
      return { min: 1100000, max: 1700000, str: '₹11L – ₹17L per year' };
    case 'Product Designer':
      return { min: 1000000, max: 1600000, str: '₹10L – ₹16L per year' };
    case 'Talent Acquisition Specialist':
      return { min: 800000, max: 1400000, str: '₹8L – ₹14L per year' };
    case 'Data Analyst':
      return { min: 900000, max: 1500000, str: '₹9L – ₹15L per year' };
    case 'Customer Success Manager':
      return { min: 800000, max: 1400000, str: '₹8L – ₹14L per year' };
    case 'Marketing Manager':
      return { min: 900000, max: 1600000, str: '₹9L – ₹16L per year' };
    default:
      return { min: null, max: null, str: null };
  }
}

async function getCompanyBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error(`Unable to find company with slug "${slug}"`, error || 'No data');
    process.exit(1);
  }

  return data;
}

async function patchCompanyJobs(supabase, company) {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('company_id', company.id);

  if (error) {
    console.error(`Error fetching jobs for company ${company.slug}:`, error);
    process.exit(1);
  }

  if (!jobs || jobs.length === 0) {
    console.log(`No jobs found for ${company.slug}, nothing to patch.`);
    return;
  }

  for (const job of jobs) {
    const baseTitle = job.title.split('#')[0].trim();
    const salary = getSalaryForTitle(baseTitle);

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        title: baseTitle,
        salary_min: salary.min,
        salary_max: salary.max,
        salary_currency: salary.min && salary.max ? 'INR' : null,
        salary_period: salary.min && salary.max ? 'yearly' : null,
        salary_range_string: salary.str,
      })
      .eq('id', job.id);

    if (updateError) {
      console.error(`Error updating job ${job.id} for company ${company.slug}:`, updateError);
      process.exit(1);
    }
  }

  console.log(`Patched ${jobs.length} jobs for ${company.slug}`);
}

async function main() {
  const SUPABASE_URL = getEnv('SUPABASE_URL');
  const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const company1Slug = getEnv('SEED_COMPANY1_SLUG');
  const company2Slug = getEnv('SEED_COMPANY2_SLUG');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const company1 = await getCompanyBySlug(supabase, company1Slug);
  const company2 = await getCompanyBySlug(supabase, company2Slug);

  await patchCompanyJobs(supabase, company1);
  await patchCompanyJobs(supabase, company2);

  console.log('Job titles and salaries updated successfully.');
}

main().catch((err) => {
  console.error('Unexpected error in fix-seeded-jobs script:', err);
  process.exit(1);
});
