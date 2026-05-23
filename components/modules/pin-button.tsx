import { togglePinAction } from "@/lib/pinned-actions";

export function PinButton({
  contentId,
  isPinned,
  returnUrl,
}: {
  contentId: string;
  isPinned: boolean;
  returnUrl: string;
}) {
  const action = togglePinAction.bind(null, contentId, returnUrl);

  return (
    <form action={action}>
      <button
        type="submit"
        aria-pressed={isPinned}
        className={
          isPinned
            ? "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-900"
            : "inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700"
        }
      >
        <span aria-hidden>📌</span>
        <span>{isPinned ? "Épinglé" : "Épingler"}</span>
      </button>
    </form>
  );
}
