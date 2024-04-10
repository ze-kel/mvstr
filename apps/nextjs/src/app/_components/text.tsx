import type { CSSProperties, ReactNode } from "react";
import {
  NeueMachinaRegular,
  NeueMachinaUB,
  Nunito400,
  Nunito600,
  Nunito700,
} from "src/app/fonts/fonts";

import { cn } from "@acme/ui";

const TypographyTokens = {
  headingLAccent: NeueMachinaUB.className,
  headingL: NeueMachinaRegular.className,
  headingM: NeueMachinaRegular.className,
  subHeadingL: NeueMachinaRegular.className,
  subHeadingM: NeueMachinaRegular.className,
  textXXL: Nunito400.className,
  textXL: Nunito400.className,
  textLAccent: Nunito700.className,
  textL: Nunito400.className,
  textM: Nunito400.className,
  textSAccent: Nunito700.className,
  textS: Nunito600.className,
  captionXXL: Nunito700.className,
  captionXL: Nunito700.className,
  captionL: Nunito700.className,
  captionM: Nunito700.className,
  linkLAccent: Nunito600.className,
  linkL: Nunito400.className,
};

type TT = keyof typeof TypographyTokens;

export const StyledText = ({
  token,
  className,
  children,
  style,
}: {
  token: TT;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(token, TypographyTokens[token], className)}
      style={style}
    >
      {children}
    </div>
  );
};
