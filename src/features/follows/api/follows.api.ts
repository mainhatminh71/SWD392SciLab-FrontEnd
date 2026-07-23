import { apiRequest } from "@/core/api";
import type {
  FollowListParams,
  FollowListResponse,
  FollowObjectType,
  NotifyMode,
  ToggleFollowRequest,
  ToggleFollowResponse,
  UpdateFollowNotifyModeRequest,
  UpdateFollowNotifyModeResponse,
} from "@/features/follows/types/follow.types";

const defaultLimit = 20;

export function buildFollowsQuery(params: FollowListParams = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? defaultLimit),
  });

  const type = params.type ?? params.objectType;
  if (type) {
    query.set("type", type);
  }

  return query.toString();
}

async function listServerFollows(
  params: FollowListParams = {},
): Promise<FollowListResponse> {
  return apiRequest<FollowListResponse>({
    authenticated: true,
    method: "GET",
    path: `/follows?${buildFollowsQuery(params)}`,
  });
}

/** GET /follows. The backend is the sole source of truth. */
export async function listFollows(
  params: FollowListParams = {},
): Promise<FollowListResponse> {
  return listServerFollows(params);
}

export type ToggleFollowInput = ToggleFollowRequest & {
  displayName?: string | null;
};

/** POST /follows/toggle. */
export async function toggleFollow(
  body: ToggleFollowInput,
): Promise<ToggleFollowResponse> {
  return apiRequest<ToggleFollowResponse>({
    authenticated: true,
    method: "POST",
    path: "/follows/toggle",
    body: {
      objectType: body.objectType,
      objectId: body.objectId.trim(),
      notifyMode: body.notifyMode,
    },
  });
}

export async function updateFollowNotifyMode(
  objectType: FollowObjectType,
  objectId: string,
  body: UpdateFollowNotifyModeRequest,
): Promise<UpdateFollowNotifyModeResponse> {
  return apiRequest<UpdateFollowNotifyModeResponse>({
    authenticated: true,
    method: "PATCH",
    path: `/follows/${encodeURIComponent(objectType)}/${encodeURIComponent(objectId)}`,
    body,
  });
}

export function setFollowNotifyMode(
  objectType: FollowObjectType,
  objectId: string,
  notifyMode: NotifyMode,
) {
  return updateFollowNotifyMode(objectType, objectId, { notifyMode });
}
