import { useQuery, type DefaultError, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed } from "vue";

import type { MemberQueryParams } from "@/models/request/MemberQueryParams";
import type { MemberModel } from "@/models/member.model";
import { MemberService } from "@/services/member-service";

export const MIN_KEYWORD_LENGTH = 1;

type Option<TTransformed> = {
  transform?: (member: MemberModel) => TTransformed;
};

export function useMemberQuery(params: MemberQueryParams): UseQueryReturnType<MemberModel[], DefaultError>;
export function useMemberQuery<TTransformed>(
  params: MemberQueryParams,
  options: Option<TTransformed>,
): UseQueryReturnType<TTransformed[], DefaultError>;
export function useMemberQuery<TTransformed>(
  params: MemberQueryParams,
  options: Option<TTransformed> = {},
): UseQueryReturnType<MemberModel[] | TTransformed[], DefaultError> {
  //
  const { transform } = options;
  const apiService = new MemberService();
  const enabled = computed(() => Boolean(params.keyword && params.keyword.length >= MIN_KEYWORD_LENGTH));
  const keyword = computed(() => params.keyword);

  const query = useQuery({
    queryKey: ["members", keyword],
    queryFn: () => {
      return apiService.searchMembers(params, { page: 0, pageSize: 100 });
    },
    select: (data) => {
      return transform ? data.data.content.map(transform) : data.data.content;
      // return data.data.content;
    },
    retry: 1,
    enabled,
  });

  return query;
}
