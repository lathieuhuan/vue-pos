import { defineStore } from "pinia";
import { reactive } from "vue";

type AppNoti = {
  message: string;
  type: "INFO" | "ERROR" | "SUCCESS";
};

export const useNotiStore = defineStore("noti", () => {
  const notis = reactive<AppNoti[]>([]);

  function notify(noti: string | AppNoti) {
    notis.push(typeof noti === "string" ? { message: noti, type: "INFO" } : noti);
  }

  return {
    notis,
    notify,
  };
});
