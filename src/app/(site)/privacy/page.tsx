import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { company } from "@/content/site";
import { ProsePage } from "@/components/site/ProsePage";

export const metadata: Metadata = pageMetadata({ title: "Privacy policy", description: `How ${company.name} collects, uses and protects your personal information.`, path: "/privacy" });

/*
 * Draft. The data categories and service providers below are taken from what the code actually does:
 * Better Auth accounts, saved addresses, orders, prescription uploads, Razorpay payments, Shiprocket
 * shipping, email notifications, the contact form, and the cart and pincode kept in browser storage.
 * TODO(owner): legal review against the Digital Personal Data Protection Act, 2023 and the IT Rules, 2011.
 */
export default function PrivacyPage() {
  const controller = company.legalName ?? company.name;
  return (
    <ProsePage draft title="Privacy policy" lead={`How ${company.name} collects, uses and protects your personal information when you use this website.`}>
      <h2>Who we are</h2>
      <p>This website is operated by {controller}.</p>
      {/* TODO(owner): registered legal name, registered office address and a contact email for privacy requests. */}

      <h2>What we collect</h2>
      <ul>
        <li>Account details: your name, email address and a password, which is stored only in hashed form.</li>
        <li>Delivery details: the names, phone numbers and addresses you save for delivery.</li>
        <li>Orders: the products you buy, amounts paid and the status of each order and shipment.</li>
        <li>
          Prescriptions: when a product needs one, the prescription file you upload. This is health information and is visible only to you
          and to the staff who review it.
        </li>
        <li>Messages: what you send through the contact form, including your name, email and organisation.</li>
      </ul>
      <p>We do not receive or store your card or bank details. Online payments are handled by our payment provider.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To create and secure your account.</li>
        <li>To process, deliver and support your orders, including checking prescriptions where required.</li>
        <li>To send emails about your account and orders, and to reply to your messages.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We share only what each service needs to do its job:</p>
      <ul>
        <li>Razorpay, to take online payments.</li>
        <li>Shiprocket and its courier partners, to deliver your order (name, phone number and delivery address).</li>
        <li>Our hosting, database and email providers, which store and send data on our behalf.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      {/* TODO(owner): name the hosting, database and email providers, and where data is stored. */}

      <h2>Cookies and browser storage</h2>
      <p>
        We use a cookie to keep you signed in. Your cart and the delivery pincode you enter are kept in your browser’s local storage so they
        are still there when you come back. We do not use advertising cookies.
      </p>

      <h2>How long we keep it</h2>
      {/* TODO(owner): retention periods for accounts, orders (including tax records) and prescriptions. */}
      <p>We keep personal information only for as long as we need it for the purposes above or as the law requires.</p>

      <h2>Your rights</h2>
      <p>
        You can see and update your saved addresses in your account at any time. To ask for a copy of your data, a correction or deletion of
        your account, <Link href="/contact">contact us</Link>.
      </p>
      {/* TODO(owner): name of the Grievance Officer and how to reach them, and the response time. */}

      <h2>Changes to this policy</h2>
      <p>If we change this policy we will update this page and the date at the top.</p>
    </ProsePage>
  );
}
