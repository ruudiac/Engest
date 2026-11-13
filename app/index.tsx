import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      // 1. Logged in?
      const { data } = await supabase.auth.getSession();
      if (!data?.session) return setTarget('/login_signup');

      // 2. Onboarding done?
      const { data: p } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', data.session.user.id)
        .single();

      setTarget(p?.onboarded ? '/(tabs)/dashboard' : '/onboarding');
    };
    check().catch(() => setTarget('/login_signup'));
  }, []);

  if (!target) return <View style={{ flex: 1, backgroundColor: '#EAD4F6' }} />;
  return <Redirect href={target as any} />;
}