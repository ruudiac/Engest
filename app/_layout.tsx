import { Stack } from "expo-router";
import { useFonts } from "expo-font";

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

  if (!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}