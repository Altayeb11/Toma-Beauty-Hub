import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        let admin = !!user && !error;
        if (!admin && import.meta.env.DEV) {
          admin = localStorage.getItem("toma_admin") === "true";
          if (admin) console.info("Dev: admin enabled via localStorage fallback");
        }
        if (mounted) setIsAdmin(admin);
      } catch (e) {
        if (import.meta.env.DEV) {
          const admin = localStorage.getItem("toma_admin") === "true";
          if (admin) console.info("Dev: admin enabled via localStorage fallback (error)");
          if (mounted) setIsAdmin(admin);
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  const setAdmin = (v: boolean) => {
    setIsAdmin(v);
    if (import.meta.env.DEV) {
      localStorage.setItem("toma_admin", v ? "true" : "false");
    }
  };

  return { isAdmin, setAdmin };
}
