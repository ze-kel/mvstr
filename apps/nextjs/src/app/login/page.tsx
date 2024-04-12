import { redirect } from "next/navigation";
import { LoginWithVk } from "src/app/login/auth";

import { validateRequest } from "@acme/auth";

import { StyledText } from "~/app/_components/text";

const Page = async () => {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-16 box-border flex max-w-[480px] flex-col items-center rounded-[28px] border border-stroke-secondary bg-surface-inverse p-8">
        <StyledText token="headingL" className="text-center">
          Добро пожаловать в Место Встречи
        </StyledText>
        <StyledText token="textXXL" className="mt-2 text-text-secondary">
          Войдите в ваш аккаунт или создайте новый
        </StyledText>
        <LoginWithVk className="mt-6" />
      </div>
    </div>
  );
};

export default Page;
