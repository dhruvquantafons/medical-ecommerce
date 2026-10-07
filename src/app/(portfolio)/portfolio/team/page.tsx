import { getEmployees } from '@/lib/employees';
import { TeamPage } from '@/components/portfolio/pages/TeamPage';

export default async function PortfolioTeamPage() {
  const members = await getEmployees();
  return <TeamPage members={members} />;
}
