import { checkEnquiry, LIMITS, type Enquiry } from "@/components/contact/enquiry";
import { route as contactRoute } from "@/content/contact";
import { deliverEnquiry } from "./deliver";
import { clientKey, overLimit } from "./rate-limit";

// The Contact form's endpoint (design_handoff_contact, "Data": submit { name, email, message }).
// A route handler rather than a Server Action: its URL stays the same from one deployment to the
// next, so a form left open across a deploy still sends.
//
// The form posts JSON and gets JSON back: { ok: true }, or { ok: false } with `errors` when a field
// fails the form's own rules. A browser that has not run the page's script posts the form itself;
// that gets a redirect back to /contact#enquiry-sent or #enquiry-failed, which the page shows
// without script. Checks, in order: same origin, size, the honeypot (a bot is told it worked and
// nothing is sent), a per-address rate limit, the form's rules, then delivery (deliver.ts).

/** Far more than the longest valid enquiry, encoded. */
const MAX_BODY_BYTES = 64 * 1024;

type Outcome = "sent" | "failed";

export async function POST(request: Request) {
  const scripted = (request.headers.get("content-type") ?? "").includes("application/json");
  const answer = (status: number, body: { ok: boolean; errors?: { name: boolean; email: boolean } }, outcome: Outcome) =>
    scripted
      ? Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
      : new Response(null, {
          status: 303,
          headers: { Location: new URL(`${contactRoute}#enquiry-${outcome}`, request.url).href, "Cache-Control": "no-store" },
        });

  if (!sameOrigin(request)) return answer(403, { ok: false }, "failed");
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return answer(413, { ok: false }, "failed");

  let fields: Enquiry & { website: string };
  try {
    fields = scripted ? fromJson(await readText(request)) : fromForm(await request.formData());
  } catch {
    return answer(400, { ok: false }, "failed");
  }

  if (fields.website) return answer(200, { ok: true }, "sent");
  if (overLimit(clientKey(request.headers))) return answer(429, { ok: false }, "failed");

  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();
  const check = checkEnquiry({ name, email });
  if (check.errName || check.errEmail) {
    return answer(400, { ok: false, errors: { name: check.errName, email: check.errEmail } }, "failed");
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return answer(400, { ok: false }, "failed");
  }

  const delivered = await deliverEnquiry({
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
    source: new URL(contactRoute, request.url).href,
  });
  return delivered ? answer(200, { ok: true }, "sent") : answer(502, { ok: false }, "failed");
}

/** Browsers send Origin with every POST; one from another site is refused. Clients that send
    none (scripts, curl) are not browsers acting for a visitor, so there is nothing to forge. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return false;
  }
}

/** The body as text, refusing one larger than the limit even when it came without a length. */
async function readText(request: Request): Promise<string> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("body too large");
  return text;
}

const asString = (value: unknown) => (typeof value === "string" ? value : "");

function fromJson(text: string): Enquiry & { website: string } {
  const data: unknown = JSON.parse(text);
  if (!data || typeof data !== "object") throw new Error("not an object");
  const record = data as Record<string, unknown>;
  return {
    name: asString(record.name),
    email: asString(record.email),
    message: asString(record.message),
    website: asString(record.website),
  };
}

function fromForm(form: FormData): Enquiry & { website: string } {
  return {
    name: asString(form.get("name")),
    email: asString(form.get("email")),
    message: asString(form.get("message")),
    website: asString(form.get("website")),
  };
}
