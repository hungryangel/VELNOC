type EventProps = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("velnoc:event", { detail: { event, props } }));
}
