import { useQuery, type DefaultError, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";
import { plainToInstance } from "class-transformer";

import { MemberModel } from "@/models/member.model";
import { MemberService } from "@/services/member-service";

export const MIN_KEYWORD_LENGTH = 1;

type Option<TTransformed> = {
  staleTime?: number;
  transform?: (member: MemberModel) => TTransformed;
};

function useMemberFindByKeyword(keyword: Ref<string>): UseQueryReturnType<MemberModel[], DefaultError>;
function useMemberFindByKeyword<TTransformed>(
  keyword: Ref<string>,
  options: Option<TTransformed>,
): UseQueryReturnType<TTransformed[], DefaultError>;
function useMemberFindByKeyword<TTransformed>(
  keyword: Ref<string>,
  options: Option<TTransformed> = {},
): UseQueryReturnType<MemberModel[] | TTransformed[], DefaultError> {
  //
  const { staleTime = 15_000, transform } = options;
  const apiService = new MemberService();
  const enabled = computed(() => Boolean(keyword.value && keyword.value.length >= MIN_KEYWORD_LENGTH));

  const query = useQuery({
    queryKey: ["members", keyword],
    queryFn: () => {
      return apiService
        .searchMembers({ keyword: keyword.value }, { page: 0, pageSize: 100 })
        .then((res) => res.data.content);
    },
    select: (data) => {
      const members = plainToInstance(MemberModel, data);
      return transform ? members.map(transform) : members;
    },
    retry: 1,
    staleTime,
    enabled,
  });

  return query;
}

useMemberFindByKeyword.key = "members";

export { useMemberFindByKeyword };
