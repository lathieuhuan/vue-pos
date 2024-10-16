<script setup lang="ts" generic="TInternalItem extends TabBarItem = TabBarItem">
import { computed } from 'vue';
import TabItem, { type TabItemProps } from './TabItem.vue';

export type TabBarItem = {
  key: string;
  label: string;
};

export type TabsBarProps<TItem extends TabBarItem = TabBarItem> = {
  activeKey: string;
  items: TItem[];
  allowAdd?: boolean;
};

type ProcessedItem = {
  value: TInternalItem;
  tabProps: Pick<TabItemProps, 'isActive' | 'isLeftOfActive' | 'isRightOfActive'>;
};

const props = withDefaults(defineProps<TabsBarProps<TInternalItem>>(), {
  allowAdd: false,
});

defineEmits<{
  (e: 'addTab'): void;
  (e: 'changeActiveTab', item: TInternalItem): void;
  (e: 'removeTab', item: TInternalItem): void;
}>();

const data = computed(() => {
  const activeIndex = props.items.findIndex((item) => item.key === props.activeKey);
  const [activeLeftIndex, activeRightIndex] = [activeIndex - 1, activeIndex + 1];

  const items = props.items.map<ProcessedItem>((item, index) => ({
    value: item,
    tabProps: {
      isActive: index === activeIndex,
      isLeftOfActive: index === activeLeftIndex,
      isRightOfActive: index === activeRightIndex,
    },
  }));

  return {
    activeIndex,
    items,
  };
});
</script>

<template>
  <div class="pb-2 bg-surface-0">
    <div class="flex bg-surface-200">
      <div class="relative">
        <div class="absolute top-0 left-0 w-full h-full grid grid-rows-2">
          <div></div>
          <div class="bg-surface-0"></div>
        </div>
        <div class="relative z-10 pt-1.5 bg-transparent flex gap-1.5">
          <TabItem
            v-for="{ value, tabProps } in data.items"
            v-bind="tabProps"
            contentCls="px-3 py-1 rounded-lg flex gap-2 items-center leading-none cursor-default"
            :key="value.key"
            @click="$emit('changeActiveTab', value)"
          >
            <template v-slot:item>
              <span class="font-medium">{{ value.label }}</span>
              <button
                :class="[
                  'p-1 rounded-full flex',
                  tabProps.isActive ? 'hover:bg-surface-200' : 'hover:bg-surface-400',
                ]"
                @click="
                  (e) => {
                    e.stopPropagation();
                    $emit('removeTab', value);
                  }
                "
              >
                <span class="pi pi-times text-xs"></span>
              </button>
            </template>
          </TabItem>

          <TabItem
            contentCls="p-[0.4375rem] rounded-full flex"
            contentIs="button"
            :isRightOfActive="data.activeIndex === data.items.length - 1"
            @click="$emit('addTab')"
          >
            <template #item>
              <span v-if="allowAdd" class="pi pi-plus text-sm"></span>
              <div v-else class="h-3.5"></div>
            </template>
          </TabItem>
        </div>
      </div>
    </div>
  </div>
</template>
