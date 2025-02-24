import { useQuery } from "@tanstack/vue-query";
import { computed, type Reactive } from "vue";

import type { MemberQueryParams } from "@/models/request/MemberQueryParams";
import { MemberService } from "@/services/member-service";

export const MIN_KEYWORD_LENGTH = 1;

export function useMemberQuery(params: Reactive<MemberQueryParams>) {
  const apiService = new MemberService();
  const enabled = computed(() => Boolean(params.keyword && params.keyword.length >= MIN_KEYWORD_LENGTH));
  const keyword = computed(() => params.keyword);

  const query = useQuery({
    queryKey: ["members", keyword],
    queryFn: () => {
      return apiService.searchMembers(params, { page: 0, pageSize: 100 });
    },
    retry: 1,
    enabled,
  });

  const members = computed(() => query.data.value?.data.content);

  return { ...query, data: members };
}
