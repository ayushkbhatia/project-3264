// The Contact form's rules, shared by the form (ContactForm.tsx) and the endpoint that receives
// it (src/app/api/contact/route.ts), so the browser and the server agree on what is valid.

export type Enquiry = { name: string; email: string; message: string };

/** The handoff's address check, applied to the trimmed value. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Longest accepted values (254 is the longest deliverable address). The form's fields carry
    them as maxLength, so only a request made outside the form can exceed them. */
export const LIMITS = { name: 200, email: 254, message: 10_000 } as const;

/** The handoff's two rules: a name after trimming, and an address that looks deliverable. The
    message is optional. */
export function checkEnquiry({ name, email }: Pick<Enquiry, "name" | "email">) {
  return { errName: !name.trim(), errEmail: !EMAIL.test(email.trim()) };
}

/** The success heading's name: the first word of Name. */
export function firstName(name: string) {
  return name.trim().split(/\s+/)[0];
}
