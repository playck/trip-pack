import * as Sentry from "@sentry/react";
import { supabase } from "@/shared/service/supabase/cilent";

export function initSentryAuthBridge() {
  void supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
      });
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
      });
    } else {
      Sentry.setUser(null);
    }
  });
}
