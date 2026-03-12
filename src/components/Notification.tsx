import { useStore } from "@nanostores/react";
import { $notification } from "../lib/client/store";

export type Notification = {
  message: string;
  type: "error" | "info" | "success";
  cta?: {
    text: string;
    callback: () => void;
  };
};

const alertTypeClass: Record<Notification["type"], string> = {
  error: "alert-error",
  info: "alert-info",
  success: "alert-success",
};

export function Notification() {
  const notification = useStore($notification);

  if (!notification) {
    return null;
  }

  function handleCtaClick() {
    notification?.cta?.callback?.();
    $notification.set(null);
  }

  setTimeout(() => {
    $notification.set(null);
  }, 5000);

  return (
    <section className="fixed top-16 right-0 left-0 z-20">
      <div className="mx-auto my-4 max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div
          role="alert"
          className={`alert ${alertTypeClass[notification.type]} flex flex-col items-start gap-2 sm:flex-row sm:items-center`}
        >
          <div dangerouslySetInnerHTML={{ __html: notification.message }} />
          <div className="ml-auto flex gap-2">
            {notification.cta && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCtaClick}
              >
                {notification.cta.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
