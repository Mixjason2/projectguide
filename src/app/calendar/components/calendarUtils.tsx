import { Job } from './types';

export function getStatusDots(input: Job | Job[] | 'all'): { color: string; label: string }[] {
  if (input === 'all') return [{ color: '#404040', label: 'All Jobs' }];
  const jobs = Array.isArray(input) ? input : [input];
  const hasNew = jobs.some(j => j.isNew);
  const hasChange = jobs.some(j => j.isChange);
  if (hasNew || hasChange) {
    return [
      ...(hasNew ? [{ color: '#0891b2', label: 'New' }] : []),
      ...(hasChange ? [{ color: '#fb923c', label: 'Changed' }] : []),
    ];
  }
  return [{ color: '#404040', label: 'Normal' }];
}
