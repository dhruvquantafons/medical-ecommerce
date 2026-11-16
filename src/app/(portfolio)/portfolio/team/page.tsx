import type { Metadata } from 'next';
import { getEmployees } from '@/lib/employees';
import { TeamPage } from '@/components/portfolio/pages/TeamPage';

export const metadata: Metadata = {
  title: 'Our team',
  description: 'The people who develop, test and review Syncytium Health medicines and supplements.',
};

export default async function PortfolioTeamPage() {
  const members = await getEmployees();
  return <TeamPage members={members} />;
}
