import { useToast } from "primevue/usetoast";

export type Notification = {
  title?: string;
  message: string;
  /** Default to 'info' */
  type?: "success" | "error" | "info";
};

export function useNotifier() {
  const toast = useToast();

  function notify(noti: string | Notification) {
    const { title, type = "info", message } = typeof noti === "string" ? { message: noti } : noti;
    const summary = title || type[0].toUpperCase() + type.slice(1);

    toast.add({
      summary,
      detail: message,
      severity: type,
      life: 3000,
    });
  }

  return {
    notify,
  };
}
