import { requireUser } from "@/lib/session";
import { AccountTabs } from "@/components/account/AccountTabs";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const user = await requireUser("/account/orders");
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold md:text-2xl">Hi, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted">{user.email}</p>
      </div>
      <AccountTabs />
      <div className="mt-5">{children}</div>
    </div>
  );
}
