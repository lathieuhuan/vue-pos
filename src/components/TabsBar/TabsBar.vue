<script setup lang="ts">
import { computed } from 'vue';
import TabItem, { type TabItemProps } from './TabItem.vue';

type TabBarItem = {
  key: string;
  label: string;
};

export type TabsBarProps = {
  activeKey: string;
  items: TabBarItem[];
  allowAdd?: boolean;
};

type ProcessedItem = TabItemProps & TabBarItem;

const props = withDefaults(defineProps<TabsBarProps>(), {
  allowAdd: false,
});

defineEmits<{
  (e: 'changeActiveKey', key: string): void;
  (e: 'removeItem', key: string): void;
  (e: 'addItem'): void;
}>();

const data = computed(() => {
  const activeIndex = props.items.findIndex((item) => item.key === props.activeKey);
  const [activeLeftIndex, activeRightIndex] = [activeIndex - 1, activeIndex + 1];

  const items = props.items.map<ProcessedItem>((item, index) => ({
    key: item.key,
    label: item.label,
    isActive: index === activeIndex,
    isLeftOfActive: index === activeLeftIndex,
    isRightOfActive: index === activeRightIndex,
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
            v-for="item in data.items"
            v-bind="{ ...item }"
            contentCls="px-3 py-1 rounded-lg flex gap-2 items-center leading-none cursor-default"
            :key="item.key"
            @click="$emit('changeActiveKey', item.key)"
          >
            <template v-slot:item>
              <span>{{ item.label }}</span>
              <button
                :class="[
                  'p-1 rounded-full flex',
                  item.isActive ? 'hover:bg-surface-200' : 'hover:bg-surface-400',
                ]"
                @click="
                  (e) => {
                    e.stopPropagation();
                    $emit('removeItem', item.key);
                  }
                "
              >
                <span class="pi pi-times" style="font-size: 12px"></span>
              </button>
            </template>
          </TabItem>

          <TabItem
            contentCls="p-[0.4375rem] rounded-full flex"
            contentIs="button"
            :isRightOfActive="data.activeIndex === data.items.length - 1"
            @click="$emit('addItem')"
          >
            <template #item>
              <span v-if="allowAdd" class="pi pi-plus" style="font-size: 14px"></span>
              <div v-else class="h-3.5"></div>
            </template>
          </TabItem>
        </div>
      </div>
    </div>
  </div>
</template>
