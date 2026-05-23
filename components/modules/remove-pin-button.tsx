"use client";

import { useRef } from "react";
import { removePinAction } from "@/lib/pinned-actions";

export function RemovePinButton({
  pinId,
  confirmMessage,
  pendingContentId,
  returnUrl,
  label = "Retirer",
}: {
  pinId: string;
  confirmMessage?: string;
  pendingContentId?: string;
  returnUrl?: string;
  label?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = removePinAction.bind(
    null,
    pinId,
    pendingContentId,
    returnUrl,
  );

  function handleClick(e: React.MouseEvent) {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={action}>
      <button
        type="button"
        onClick={handleClick}
        className="text-xs text-red-700 underline"
      >
        {label}
      </button>
    </form>
  );
}
