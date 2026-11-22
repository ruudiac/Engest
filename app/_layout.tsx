import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { NiceAlertHost } from "../components/niceAlert";
import { useEffect } from "react";
import { setAudioModeAsync } from "expo-audio";

import {
  Inter_400Regular,
  Inter_700Bold
} from "@expo-google-fonts/inter";

import {
  PixelifySans_400Regular
} from "@expo-google-fonts/pixelify-sans";

import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
    PixelifySans: PixelifySans_400Regular,
  });
    // A language app should always be heard: play audio even when the phone is on silent
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch((e) =>
      console.log('audio mode failed', e),
    );
  }, []);

  if (!fontsLoaded) return null;

    return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <NiceAlertHost />
    </>
  );
}