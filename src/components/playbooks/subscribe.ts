// The one seam between the subscribe forms (Playbooks: new playbooks; Essays: new essays) and an
// email provider (open item in both handoffs: no backend is chosen yet, and the endpoint, lists
// and double opt-in are 3264's call).
//
// For now it resolves after 600ms, so the form's states can be seen and tested. Addresses at
// the reserved `.invalid` domain (RFC 2606; no real inbox can have one) reject, which exercises
// the error state. Replace the body with the provider call; the form needs only resolve/reject.
export type SubscribeList = "playbooks" | "essays";

export async function subscribe(email: string, list: SubscribeList): Promise<void> {
  void list; // the provider call subscribes the address to this list
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (/\.invalid$/i.test(email.trim())) throw new Error("subscribe failed");
}
