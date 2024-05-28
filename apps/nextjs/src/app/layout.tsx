import type { Metadata, Viewport } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";
import "~/app/typography.css";

import { cn } from "@acme/ui";

import {
  NeueMachinaLight,
  NeueMachinaRegular,
  NeueMachinaUB,
  Nunito400,
  Nunito600,
  Nunito700,
} from "../../../../packages/ui/src/fonts/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Место встречи",
  description: "",
  openGraph: {
    title: "Место встречи",
    description: "",
    url: "",
    siteName: "",
  },
  icons: {
    shortcut: "/favicon.ico",
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          NeueMachinaUB.variable,
          NeueMachinaLight.variable,
          NeueMachinaRegular.variable,
          Nunito400.variable,
          Nunito600.variable,
          Nunito700.variable,
          Nunito400.className,
          "bg-surface-secondary text-text-primary antialiased",
        )}
      >
        <TRPCReactProvider>{props.children}</TRPCReactProvider>
      </body>
    </html>
  );
}
