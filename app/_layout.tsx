import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../lib/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/add"
          options={{ presentation: "modal", title: "放弃一件事" }}
        />
      </Stack>
    </>
  );
}
