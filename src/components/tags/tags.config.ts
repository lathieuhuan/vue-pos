import type { EOrderStatus } from '@/constants/enums';
import { type TagProps } from 'primevue/tag';

type StatusTagConfig = {
  label: string;
  severity: TagProps['severity'];
};

export type StatusTagConfigMap<T extends string = string> = Record<T, StatusTagConfig>;

export const ORDER_STATUS_TAG_CONFIG_MAP: StatusTagConfigMap<EOrderStatus> = {
  PROCESSING: {
    label: 'Processing',
    severity: 'info',
  },
};
