import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Type-only import — no server/mongo code is bundled into the client.
import type { auth } from "@/lib/auth";

/**
 * Single shared Better Auth client.
 *
 * `baseURL` falls back to the current origin when unset, which is what you
 * want while the app and `/api/auth` are served from the same host. If the
 * API ever moves to another domain, set `NEXT_PUBLIC_BETTER_AUTH_URL`.
 *
 * `inferAdditionalFields<typeof auth>()` surfaces the server's
 * `user.additionalFields.role` (`admin | owner | customer`) on the client,
 * so the session role type can never drift from the server config.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
