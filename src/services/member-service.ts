import type { MemberQueryParams } from "@/models/request/MemberQueryParams";
import type { PagingQueryParams } from "@/models/request/PagingQueryParams";
import type { PagingResponseData } from "@/models/response/PagingResponseData";
import type { MemberModel } from "@/models/member.model";
import { BaseApiService } from "./base/base-api-service";

export class MemberService extends BaseApiService {
  protected basePath = "/members";

  searchMembers(params: MemberQueryParams, pagingParams: PagingQueryParams) {
    return this.get<PagingResponseData<MemberModel>>("", { params: Object.assign(params, pagingParams) });
  }
}
