import type { AccountModel } from '@/types/account.types';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useAccountStore = defineStore('account', () => {
  const account = reactive<AccountModel>({
    staff: {
      id: 'SSS',
      name: 'Superman',
    },
  });

  return {
    account,
  };
});
