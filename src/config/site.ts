/*
 * Store configuration (delivery, shipping defaults). Company facts that the site states to visitors
 * live in src/content/site.ts.
 */
export const site = {
  name: "Syncytium Health",
  /**
   * Fallback recipient for server emails (contact form and new-order alerts) when EMAIL_ADMIN is not set,
   * and the address printed in prescription emails (src/lib/email-templates.ts).
   * TODO(owner): replace with the real support inbox. This placeholder domain does not receive mail.
   * It is not shown anywhere on the website.
   */
  supportEmail: "care@syncytiumhealth.example",
  freeDeliveryAbove: 499,
  deliveryFee: 49,
  defaultPincode: "400001",
  /** Default parcel for Shiprocket (editable per order in the admin panel). Couriers bill on these. */
  parcel: { weightPerItemKg: 0.25, minWeightKg: 0.5, lengthCm: 15, breadthCm: 12, heightCm: 10 },
};
