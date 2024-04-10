import localFont from 'next/font/local';
import { Nunito_Sans } from 'next/font/google';

export const NeueMachinaUB = localFont({
  src: './NeueMachina-Ultrabold.otf',
  display: 'swap',
});

export const NeueMachinaLight = localFont({
  src: './NeueMachina-Light.otf',
  display: 'swap',
});

export const NeueMachinaRegular = localFont({
  src: './NeueMachina-Regular.otf',
  display: 'swap',
});

export const Nunito400 = Nunito_Sans({
  weight: '400',
  subsets: ['cyrillic', 'latin'],
});

export const Nunito600 = Nunito_Sans({
  weight: '600',
  subsets: ['cyrillic', 'latin'],
});

export const Nunito700 = Nunito_Sans({
  weight: '700',
  subsets: ['cyrillic', 'latin'],
});
