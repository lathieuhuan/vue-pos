import type { UserProfileModel } from '@/types/userProfile.types';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserProfileStore = defineStore('userProfile', () => {
  const profile = reactive<UserProfileModel>({
    staff: {
      id: 'SSS',
      name: 'Superman',
    },
  });

  return {
    profile,
  };
});
