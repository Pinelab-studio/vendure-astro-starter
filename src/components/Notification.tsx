import { useStore } from "@nanostores/react";
import { $notification } from "../client/store";

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
    <section className="fixed left-0 right-0 top-16 z-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 my-4">
        <div
          role="alert"
          className={`alert ${alertTypeClass[notification.type]} flex flex-col sm:flex-row items-start sm:items-center gap-2`}
        >
          <div dangerouslySetInnerHTML={{ __html: notification.message }} />
          <div className="flex gap-2 ml-auto">
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
