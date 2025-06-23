import { Job } from '../types/job';

export function getTotalPax(job: Job): number {
  return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}

export function findDuplicateNames(jobs: Job[]): string[] {
  const nameCount = jobs.reduce((acc, job) => {
    const name = job.pax_name?.toString();
    if (name) acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(nameCount)
    .filter(([_, count]) => count > 1)
    .map(([name]) => name);
}
