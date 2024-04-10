import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <TRPCProvider>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "rgba(243, 245, 247, 1)" },
          contentStyle: { backgroundColor: "rgba(243, 245, 247, 1)" },
        }}
      />
      <StatusBar />
    </TRPCProvider>
  );
}
