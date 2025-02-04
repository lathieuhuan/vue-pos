<script setup lang="ts" generic="TInternalItem extends TabBarItem = TabBarItem">
import { computed } from "vue";
import TabItem, { type TabItemProps } from "./TabItem.vue";

export type TabBarItem = {
  key: string;
  label: string;
};

export type TabsBarProps<TItem extends TabBarItem = TabBarItem> = {
  activeKey: string;
  items: TItem[];
  allowAdd?: boolean;
};

type RenderedItem = {
  tabItem: TInternalItem;
  tabProps: Pick<TabItemProps, "isActive" | "isLeftOfActive" | "isRightOfActive">;
};

const props = withDefaults(defineProps<TabsBarProps<TInternalItem>>(), {
  allowAdd: false,
});

defineEmits<{
  (e: "addTab"): void;
  (e: "changeActiveTab", item: TInternalItem): void;
  (e: "removeTab", item: TInternalItem): void;
}>();

const activeIndex = computed(() => props.items.findIndex((item) => item.key === props.activeKey));

const renderedItems = computed(() => {
  const [activeLeftIndex, activeRightIndex] = [activeIndex.value - 1, activeIndex.value + 1];

  return props.items.map<RenderedItem>((item, index) => ({
    tabItem: item,
    tabProps: {
      isActive: index === activeIndex.value,
      isLeftOfActive: index === activeLeftIndex,
      isRightOfActive: index === activeRightIndex,
    },
  }));
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
            v-for="{ tabItem, tabProps } in renderedItems"
            :key="tabItem.key"
            v-bind="tabProps"
            contentCls="px-3 py-1 rounded-lg flex gap-2 items-center leading-none cursor-default"
            @click="$emit('changeActiveTab', tabItem)"
          >
            <template v-slot:item>
              <span class="font-medium">{{ tabItem.label }}</span>
              <button
                :class="[
                  'p-1 rounded-full flex',
                  tabProps.isActive ? 'hover:bg-surface-200' : 'hover:bg-surface-400',
                ]"
                @click="
                  (e) => {
                    e.stopPropagation();
                    $emit('removeTab', tabItem);
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
            :isRightOfActive="activeIndex === items.length - 1"
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
