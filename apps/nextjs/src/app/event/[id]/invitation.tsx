"use client";

import Image from "next/image";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IEvent, IUser } from "@acme/api";

import { api } from "~/trpc/react";
import A1 from "/public/avatars/1.jpg";
import A2 from "/public/avatars/2.jpg";
import A3 from "/public/avatars/3.jpg";
import A4 from "/public/avatars/4.jpg";
import A5 from "/public/avatars/5.jpg";
import A6 from "/public/avatars/6.jpg";
import A7 from "/public/avatars/7.jpg";
import A8 from "/public/avatars/8.jpg";
import A9 from "/public/avatars/9.jpg";
import A10 from "/public/avatars/10.jpg";
import DefaultBoy from "/public/defaultBoy.png";
import DefaultGirl from "/public/defaultGirl.png";

setDefaultOptions({ locale: ru });

export function declOfNum(number: number, titles: [string, string, string]) {
  const cases = [2, 0, 1, 1, 1, 2];

  const i =
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5];

  //@ts-ignore
  return titles[i];
}

export const defaultUserPics = {
  "default/a1": A1,
  "default/a2": A2,
  "default/a3": A3,
  "default/a4": A4,
  "default/a5": A5,
  "default/a6": A6,
  "default/a7": A7,
  "default/a8": A8,
  "default/a9": A9,
  "default/a10": A10,
};

export const UserAvatar = ({
  user,
  gender,
  className,
}: {
  user: IUser;
  gender?: string;
  className?: string;
}) => {
  const g = user.registered ? user.gender : gender;

  const src = user.profileImage
    ? defaultUserPics[user.profileImage] || user.profileImage
    : g === "female"
      ? DefaultGirl
      : DefaultBoy;

  return <Image className={className} src={src} alt="" />;
};
const Logo = () => {
  return (
    <svg
      width="44"
      height="28"
      viewBox="0 0 44 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0293 1.72158C20.955 -0.204069 24.0771 -0.204069 26.0027 1.72158C27.9284 3.64723 27.9284 6.76933 26.0027 8.69498L8.41764 26.2801C6.49198 28.2057 3.36989 28.2057 1.44424 26.2801C-0.481413 24.3544 -0.481413 21.2323 1.44424 19.3067L19.0293 1.72158Z"
        fill="#F2EFF6"
      />
      <path
        d="M35.5824 1.72158C37.508 -0.204068 40.6301 -0.204067 42.5558 1.72158C44.4814 3.64723 44.4814 6.76933 42.5558 8.69498L24.9707 26.2801C23.045 28.2057 19.9229 28.2057 17.9973 26.2801C16.0716 24.3544 16.0716 21.2323 17.9973 19.3067L35.5824 1.72158Z"
        fill="#F2EFF6"
      />
      <path
        d="M34.1357 6.8428C34.1357 3.6945 36.6879 1.14229 39.8362 1.14229C42.1345 1.14229 43.9976 3.0054 43.9976 5.30366V22.7955C43.9976 25.5188 41.7899 27.7265 39.0667 27.7265C36.3434 27.7265 34.1357 25.5188 34.1357 22.7955V6.8428Z"
        fill="#F2EFF6"
      />
    </svg>
  );
};

export const EventUi = ({ id }: { id: string }) => {
  const { data } = api.events.getPublic.useQuery(id);

  if (!data) return <div></div>;

  return (
    <div className="h-fit w-full  bg-buttons-primary py-4">
      <div className="px-4">
        <Logo />

        <div className="rouded-[32px] relative mt-4 max-w-[360px] overflow-hidden">
          <UserAvatar
            className="w-full rounded-3xl"
            user={data?.user as IUser}
          />

          <div className="grad1 absolute bottom-0 left-0 h-32 w-full"></div>
          <div className="headingM absolute bottom-4 px-4 text-white">
            <span className="relative">
              <span className="relative z-10 inline-block text-buttons-primary">
                {data?.user.firstName}
              </span>
              <span className=" absolute left-1/2 top-1/2 z-0 h-[130%] w-[110%] -translate-x-1/2 -translate-y-[55%] rotate-[-1deg]  rounded-md bg-white"></span>
            </span>{" "}
            приглашает тебя на {data?.name}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="rounded-lg bg-[#5D41E7] px-2 py-1 text-white">
            ⏰ {format(data.date, "d MMMM, hh:mm")}
          </div>{" "}
          <div className="rounded-lg bg-[#5D41E7] px-2 py-1 text-white">
            😄 {data.guests.length}{" "}
            {declOfNum(data.guests.length, ["человек", "человека", "человека"])}
          </div>
        </div>
      </div>

      <div className="bg-surface-inverse">
        {data.wishes.map((v) => {
          return <div>{v.wish?.title}</div>;
        })}
      </div>
    </div>
  );
};
