import { createClient } from '@supabase/supabase-js';

// Simple job seed script for two companies
// Usage (PowerShell):
//   $env:SUPABASE_URL="https://..."; $env:SUPABASE_SERVICE_ROLE_KEY="..."; npm run seed:jobs
// Configure target companies by slug via environment variables:
//   SEED_COMPANY1_SLUG, SEED_COMPANY2_SLUG

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
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

function makeBaseJobs() {
  return [
    {
      title: 'Software Engineer',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
    {
      title: 'Senior Backend Engineer',
      location: 'Bangalore, India',
      job_type: 'full-time',
      experience_level: 'senior',
    },
    {
      title: 'Frontend Engineer',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
    {
      title: 'Product Designer',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
    {
      title: 'Talent Acquisition Specialist',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
    {
      title: 'Data Analyst',
      location: 'Mumbai, India',
      job_type: 'full-time',
      experience_level: 'entry',
    },
    {
      title: 'Customer Success Manager',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
    {
      title: 'Marketing Manager',
      location: 'Remote',
      job_type: 'full-time',
      experience_level: 'mid',
    },
  ];
}

function makeJobsForCompany(company, count) {
  const baseJobs = makeBaseJobs();
  const jobs = [];

  for (let i = 0; i < count; i++) {
    const template = baseJobs[i % baseJobs.length];

    // Simple salary mapping by title
    let salaryMin = null;
    let salaryMax = null;
    let salaryCurrency = 'INR';
    let salaryPeriod = 'yearly';
    let salaryString = null;

    switch (template.title) {
      case 'Software Engineer':
        salaryMin = 1200000;
        salaryMax = 1800000;
        salaryString = '₹12L – ₹18L per year';
        break;
      case 'Senior Backend Engineer':
        salaryMin = 2200000;
        salaryMax = 3200000;
        salaryString = '₹22L – ₹32L per year';
        break;
      case 'Frontend Engineer':
        salaryMin = 1100000;
        salaryMax = 1700000;
        salaryString = '₹11L – ₹17L per year';
        break;
      case 'Product Designer':
        salaryMin = 1000000;
        salaryMax = 1600000;
        salaryString = '₹10L – ₹16L per year';
        break;
      case 'Talent Acquisition Specialist':
        salaryMin = 800000;
        salaryMax = 1400000;
        salaryString = '₹8L – ₹14L per year';
        break;
      case 'Data Analyst':
        salaryMin = 900000;
        salaryMax = 1500000;
        salaryString = '₹9L – ₹15L per year';
        break;
      case 'Customer Success Manager':
        salaryMin = 800000;
        salaryMax = 1400000;
        salaryString = '₹8L – ₹14L per year';
        break;
      case 'Marketing Manager':
        salaryMin = 900000;
        salaryMax = 1600000;
        salaryString = '₹9L – ₹16L per year';
        break;
      default:
        salaryCurrency = null;
        salaryPeriod = null;
        break;
    }

    jobs.push({
      company_id: company.id,
      title: template.title,
      description:
        `Join ${company.name} as a ${template.title}. ` +
        'This is sample seeded data to help you test filters, cards, and job detail modals.',
      location: template.location,
      job_type: template.job_type,
      experience_level: template.experience_level,
      status: 'open',
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_currency: salaryCurrency,
      salary_period: salaryPeriod,
      salary_range_string: salaryString,
      is_featured: false,
    });
  }

  return jobs;
}

async function main() {
  const SUPABASE_URL = getEnv('SUPABASE_URL');
  const SUPABASE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  const company1Slug = getEnv('SEED_COMPANY1_SLUG');
  const company2Slug = getEnv('SEED_COMPANY2_SLUG');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const company1 = await getCompanyBySlug(supabase, company1Slug);
  const company2 = await getCompanyBySlug(supabase, company2Slug);

  const company1Jobs = makeJobsForCompany(company1, 40);
  const company2Jobs = makeJobsForCompany(company2, 30);

  const allJobs = [...company1Jobs, ...company2Jobs];

  const { error } = await supabase.from('jobs').insert(allJobs);

  if (error) {
    console.error('Error inserting jobs:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${allJobs.length} jobs across companies:`);
  console.log(`- ${company1.slug}: ${company1Jobs.length} jobs`);
  console.log(`- ${company2.slug}: ${company2Jobs.length} jobs`);
}

main().catch((err) => {
  console.error('Unexpected error in seed script:', err);
  process.exit(1);
});
