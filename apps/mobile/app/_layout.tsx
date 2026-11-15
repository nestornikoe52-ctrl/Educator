import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { synchroniserFile } from "../src/horsLigne";
import { lireJeton } from "../src/session";
import { colors } from "../src/theme";

export default function RootLayout() {
  useEffect(() => {
    void lireJeton().then((jeton) => {
      if (jeton) {
        void synchroniserFile(jeton).catch(() => undefined);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.paper },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="a-propos" options={{ title: "À propos" }} />
        <Stack.Screen name="connexion" options={{ title: "Connexion" }} />
        <Stack.Screen name="inscription" options={{ title: "Inscription" }} />
        <Stack.Screen name="profil" options={{ title: "Profil" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
