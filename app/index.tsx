import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LoadingScreen from '../components/loadingScreen';



export default function Index() {
  const [target, setTarget] = useState<string | null>(null);


  useEffect(() => {
        const check = async () => {
      
      const minTime = new Promise((r) => setTimeout(r, 5000));

      let path = '/login_signup';
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const { data: p } = await supabase
          .from('profiles')
          .select('onboarded')
          .eq('id', data.session.user.id)
          .single();
        path = p?.onboarded ? '/(tabs)/dashboard' : '/onboarding';
      }

      await minTime;
      setTarget(path);
    };
    check().catch(() => setTarget('/login_signup'));
  }, []);

  if (!target) return <LoadingScreen />;
  return <Redirect href={target as any} />;
}