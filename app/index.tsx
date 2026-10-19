import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('session check', !!data?.session, error?.message);
      setLoggedIn(!!data?.session);
    })
    .catch((e) => {
      console.log('session check fail', e)
      setLoggedIn(false)
    })
    .finally(() => setChecked(true)) 
  },[])

  if (!checked)
  return <View style={{ flex: 1, backgroundColor: '#EAD4F6' }} />;
  return <Redirect href={(loggedIn ? '/(tabs)/dashboard': '/login_signup') as any} />;
}