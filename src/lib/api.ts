import type {
  AdminGiftSelectionUpdateInput,
  AdminGiftSelectionsResponse,
  AdminRsvpsResponse,
  AdminUpdateInput,
  GiftItem,
  GiftSelectionInput,
  RSVPSubmission,
} from "@shared/schemas";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    if (response.status === 404 && import.meta.env.DEV) {
      console.warn("⚠️ API backend not found. Simulating success in dev.");
      return {} as T;
    }

    let message = "Algo deu errado. Tente novamente.";

    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      "API indisponível neste ambiente. Use um deploy Vercel ou `vercel dev` para validar as funções.",
      503,
    );
  }

  return (await response.json()) as T;
}

export function withBasePath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function submitRsvp(payload: RSVPSubmission) {
  return request<{ id: string; submitted_at: string }>(withBasePath("/api/rsvp"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function adminLogin(password: string) {
  return request<{ ok: true }>(withBasePath("/api/admin/login"), {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function adminLogout() {
  return request<{ ok: true }>(withBasePath("/api/admin/logout"), {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function fetchAdminRsvps() {
  return request<AdminRsvpsResponse>(withBasePath("/api/admin/rsvps"));
}

export function updateAdminRsvp(id: string, payload: AdminUpdateInput) {
  return request<{ ok: true }>(withBasePath("/api/admin/rsvps"), {
    method: "PATCH",
    body: JSON.stringify({ id, ...payload }),
  });
}

export function deleteAdminRsvp(id: string) {
  return request<{ ok: true }>(withBasePath("/api/admin/rsvps"), {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export function fetchGifts() {
  return request<{ items: GiftItem[] }>(withBasePath("/api/gifts"));
}

export function submitGiftSelection(payload: GiftSelectionInput) {
  return request<{ id: string; total_cents: number }>(withBasePath("/api/gifts/selections"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminGiftSelections() {
  return request<AdminGiftSelectionsResponse>(withBasePath("/api/admin/gifts"));
}

export function updateAdminGiftSelection(id: string, payload: AdminGiftSelectionUpdateInput) {
  return request<{ ok: true }>(withBasePath("/api/admin/gifts/selections"), {
    method: "PATCH",
    body: JSON.stringify({ id, ...payload }),
  });
}
