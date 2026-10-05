// One-off script: replaces all employees in a single transaction.
// Run with: npx tsx scripts/replace-employees.ts
import "./env";
import { db } from "../src/db";
import { employees } from "../src/db/schema";

const newEmployees = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Lead Pharmacologist",
    bio: "Expert in pharmacokinetic modeling and drug formulation.",
    photoUrl: "https://i.pravatar.cc/150?img=47",
    sortOrder: 0,
    active: true,
  },
  {
    name: "Marcus Chen",
    role: "Supply Chain Director",
    bio: "Optimizing cold-chain distribution for sensitive biotech products.",
    photoUrl: "https://i.pravatar.cc/150?img=11",
    sortOrder: 1,
    active: true,
  },
  {
    name: "Elena Rodriguez",
    role: "Quality Assurance Lead",
    bio: "Ensuring every batch meets our stringent quality standards.",
    photoUrl: "https://i.pravatar.cc/150?img=5",
    sortOrder: 2,
    active: true,
  },
  {
    name: "David Kim",
    role: "Digital Strategist",
    bio: "Driving our digital-first approach to modern pharmacy access.",
    photoUrl: "https://i.pravatar.cc/150?img=12",
    sortOrder: 3,
    active: true,
  },
  {
    name: "Dr. Michael Chen",
    role: "Clinical Research Director",
    bio: "Pioneering breakthrough trials in targeted biological therapies.",
    photoUrl: "https://i.pravatar.cc/150?img=33",
    sortOrder: 4,
    active: true,
  },
  {
    name: "Sophia Patel",
    role: "Regulatory Affairs Manager",
    bio: "Navigating complex global health compliance for innovative formulations.",
    photoUrl: "https://i.pravatar.cc/150?img=43",
    sortOrder: 5,
    active: true,
  },
];

async function main() {
  await db.transaction(async (tx) => {
    await tx.delete(employees);
    await tx.insert(employees).values(newEmployees);
  });
  console.log(`Replaced employees table with ${newEmployees.length} records.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
