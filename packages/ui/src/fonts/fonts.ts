import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

export const NeueMachinaUB = localFont({
  src: "./NeueMachina-Ultrabold.otf",
  display: "swap",
  variable: "--neue-machina-ultrabold",
});

export const NeueMachinaLight = localFont({
  src: "./NeueMachina-Light.otf",
  display: "swap",
  variable: "--neue-machina-light",
});

export const NeueMachinaRegular = localFont({
  src: "./NeueMachina-Regular.otf",
  display: "swap",
  variable: "--neue-machina-regular",
});

export const Nunito400 = Nunito_Sans({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--nunito-400",
});

export const Nunito600 = Nunito_Sans({
  weight: "600",
  subsets: ["cyrillic", "latin"],
  variable: "--nunito-600",
});

export const Nunito700 = Nunito_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
  variable: "--nunito-700",
});
