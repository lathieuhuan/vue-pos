import type { Notifier } from "@/types/notifier";
import { useToast } from "primevue/usetoast";

export function useNotifier(): Notifier {
  const toast = useToast();

  const notify: Notifier["notify"] = (noti) => {
    const { title, type = "info", message } = typeof noti === "string" ? { message: noti } : noti;
    const summary = title || type[0].toUpperCase() + type.slice(1);

    toast.add({
      summary,
      detail: message,
      severity: type,
      life: 3000,
    });
  };

  return {
    notify,
  };
}
