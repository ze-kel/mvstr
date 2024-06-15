"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IEvent, IUser, IWish } from "@acme/api";
import { Button } from "@acme/ui/button";

import type { IEventBase } from "../../../../../../packages/api/dist/router/events";
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
import BlankItem from "/public/defImages/blankitem.png";

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

  return <img src={src} className={className} />;

  return (
    <Image width={400} height={400} className={className} src={src} alt="" />
  );
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
const formatter = Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
});

export const formatPrice = (v: number | string | undefined | null) => {
  if (!v) return "";

  const n = Number(v);

  if (Number.isNaN(n)) return "";

  return formatter.format(n);
};

const WishItem = ({ wish }: { wish: IWish }) => {
  const image = wish.image ? (
    <img src={wish.image} className="rounded-2xl" />
  ) : (
    <Image src={BlankItem} alt="" className="rounded-2xl" />
  );

  return (
    <div className="relative">
      {wish.link ? (
        <a href={wish.link} target="_blank">
          {image}
          <div className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-surface-inverse p-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.916 8.08425C3.801 7.96925 3.693 7.84325 3.5955 7.71025C3.433 7.48725 3.482 7.17425 3.7055 7.01175C3.9285 6.84925 4.241 6.89825 4.404 7.12125C4.4685 7.21025 4.541 7.29575 4.6225 7.37675C5.024 7.77825 5.5575 7.99925 6.125 7.99925C6.6925 7.99925 7.2265 7.77825 7.6275 7.37675L10.3775 4.62675C11.206 3.79825 11.206 2.44975 10.3775 1.62125C9.549 0.79275 8.2005 0.79275 7.372 1.62125L6.843 2.15025C6.6475 2.34575 6.3315 2.34575 6.136 2.15025C5.9405 1.95475 5.9405 1.63875 6.136 1.44325L6.665 0.91425C7.8835 -0.30475 9.866 -0.30475 11.0845 0.91425C12.303 2.13275 12.303 4.11525 11.0845 5.33375L8.3345 8.08375C7.7445 8.67425 6.9595 8.99925 6.125 8.99925C5.2905 8.99925 4.5055 8.67425 3.916 8.08425ZM3.125 11.9993C3.96 11.9993 4.7445 11.6743 5.3345 11.0838L5.8635 10.5548C6.059 10.3598 6.059 10.0433 5.8635 9.84775C5.6685 9.65225 5.352 9.65275 5.1565 9.84775L4.627 10.3767C4.2255 10.7782 3.692 10.9993 3.1245 10.9993C2.557 10.9993 2.0235 10.7782 1.622 10.3767C1.2205 9.97525 0.9995 9.44175 0.9995 8.87425C0.9995 8.30675 1.2205 7.77275 1.622 7.37175L4.372 4.62175C4.7735 4.22025 5.307 3.99925 5.8745 3.99925C6.442 3.99925 6.976 4.22025 7.377 4.62175C7.457 4.70225 7.53 4.78775 7.595 4.87675C7.757 5.10025 8.0695 5.15025 8.2935 4.98725C8.517 4.82475 8.5665 4.51225 8.404 4.28875C8.309 4.15775 8.2015 4.03225 8.0845 3.91525C7.494 3.32425 6.709 2.99925 5.8745 2.99925C5.04 2.99925 4.255 3.32425 3.665 3.91475L0.9155 6.66475C0.325 7.25475 0 8.03975 0 8.87425C0 9.70875 0.325 10.4938 0.9155 11.0838C1.5055 11.6743 2.29 11.9993 3.125 11.9993Z"
                fill="black"
              />
            </svg>
          </div>
        </a>
      ) : (
        <div>{image}</div>
      )}

      <div className="subHeadingM mt-2">{wish.title}</div>
      <div className="textL mt-1">{formatPrice(wish.price)}</div>
      <div className="textL mt-2 opacity-80">{wish.description}</div>
    </div>
  );
};

export const Wishlist = ({ id }: { id: string }) => {
  const { data, isLoading, refetch } = api.events.getWishesPublic.useQuery(id);

  const [changed, setChanged] = useState<string[]>([]);

  useEffect(() => {
    const res = localStorage.getItem("changed_wishes");

    if (res) {
      const parsed = JSON.parse(res);

      if (Array.isArray(parsed)) {
        setChanged(parsed);
      }
    }
  }, []);

  const m = api.events.setStatusPublic.useMutation();

  const setStatusHandler = async (id: string, status: string) => {
    await m.mutateAsync({ status, id });

    refetch();

    if (!changed.includes(id)) {
      const newChanged = [...changed, id];

      setChanged(newChanged);
      localStorage.setItem("changed_wishes", JSON.stringify(newChanged));
    }
  };

  if (isLoading || !data) return <div> </div>;

  const sorted = data.sort((a, b) =>
    (a.wish?.title || "").localeCompare(b.wish?.title || ""),
  );

  return (
    <>
      <div className="headingM mb-4">Выбери подарок</div>
      <div className="grid w-fit  grid-cols-2 gap-x-3 gap-y-4  ">
        {sorted.map((v) => {
          if (!v.wish) return null;

          const isBooked = v.status === "taken";
          const canChange = !isBooked || changed.includes(v.id);

          return (
            <div key={v.id} className="flex flex-col justify-between ">
              <WishItem wish={v.wish} />
              <Button
                disabled={!canChange}
                size={"s"}
                variant={isBooked ? "stroke" : "primary"}
                className="mt-2.5 w-full"
                onClick={() => {
                  if (canChange) {
                    setStatusHandler(v.id, isBooked ? "free" : "taken");
                  }
                }}
              >
                {isBooked
                  ? canChange
                    ? "Снять бронь"
                    : "Забронированно"
                  : "Забронировать"}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
};

const prefix = "+7";
const mask = "+7 (###) ###-##-##";

export const regexNonNumbers = /[^0-9.]/g;

export const transformNumber = (raw: string) => {
  const noPrefix = raw.replace(prefix, "");
  const numbers = noPrefix.replaceAll(regexNonNumbers, "").split("");

  if (numbers.length > 10) {
    numbers.splice(0, numbers.length - 10);
  }

  const masked: string[] = [];

  for (const letter of mask) {
    if (letter === "#") {
      const next = numbers.shift();
      masked.push(next!);

      if (!numbers.length) {
        return masked.join("");
      }
    } else {
      masked.push(letter);
    }
  }
  return masked.join("");
};

const CanUCum = ({ event }: { event: IEventBase & { user: IUser } }) => {
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState("");

  const mut = api.events.setGuestStatusPublic.useMutation();

  const record = async (status: string) => {
    if (raw.length === mask.length) {
      const res = await mut.mutateAsync({
        status,
        number: raw.replaceAll(regexNonNumbers, ""),
      });

      setStatus(res);
    }
  };

  const handler = (v: string) => {
    if (v.length > mask.length) return;
    const t = transformNumber(v);

    setRaw(t);

    if (v.length === mask.length) {
      record(t.replaceAll(regexNonNumbers, ""));
    }
  };

  return (
    <div className="mt-[54px]">
      <div className="headingM ">Сможешь прийти?</div>
      <div className="textXL mt-2">
        Напиши свой номер и отметь, сможешь ли ты прийти. Так{" "}
        {event.user.firstName} сможет лучше спланировать мероприятие.
      </div>

      <input
        value={raw}
        onChange={(e) => handler(e.target.value)}
        placeholder="Введи свой номер"
        className="placeholderM mt-5 flex w-full  rounded-xl border border-stroke-secondary bg-buttons-secondary  px-4 py-3 text-lg outline-transparent  placeholder:text-text-tertiary focus:outline-text-secondary"
      ></input>

      <div className="mt-5 flex justify-between gap-3">
        <Button
          onClick={() => {
            record("yes");
          }}
          disabled={raw.length !== mask.length}
          className="w-full"
          variant={status === "yes" ? "primary" : "stroke"}
        >
          Я приду 👍
        </Button>
        <Button
          onClick={() => {
            record("no");
          }}
          disabled={raw.length !== mask.length}
          className="w-full"
          variant={status === "no" ? "primary" : "stroke"}
        >
          Не смогу 😢
        </Button>
      </div>
    </div>
  );
};

export const EventUi = ({ id }: { id: string }) => {
  const { data } = api.events.getPublic.useQuery(id);

  if (!data) return <div></div>;

  return (
    <div className="h-fit w-full  bg-buttons-primary py-4">
      <div className="mx-auto max-w-[400px] px-4">
        <Logo />

        <div className="rouded-[32px] relative mt-4 max-w-[360px] overflow-hidden">
          <UserAvatar
            className="w-full rounded-3xl"
            user={data.user as IUser}
          />

          <div className="grad1 absolute bottom-0 left-0 h-32 w-full"></div>
          <div className="headingMShriknking absolute bottom-4 px-4 text-white">
            <span className="relative">
              <span className="relative z-10 inline-block text-buttons-primary">
                {data.user.firstName}
              </span>
              <span className=" absolute left-1/2 top-1/2 z-0 h-[130%] w-[110%] -translate-x-1/2 -translate-y-[55%] rotate-[-1deg]  rounded-md bg-white"></span>
            </span>{" "}
            приглашает тебя на {data.name}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="rounded-lg bg-[#5D41E7] px-3 py-2 text-white">
            ⏰ {format(data.date, "d MMMM, HH:mm")}
          </div>{" "}
          <div className="rounded-lg bg-[#5D41E7] px-3 py-2 text-white">
            😄 {data.guests.length}{" "}
            {declOfNum(data.guests.length, ["человек", "человека", "человек"])}
          </div>
        </div>
        <div className="textXXL mt-2.5 whitespace-pre-wrap text-white">
          {data.description}
        </div>

        <div className="mt-4 flex min-h-12 w-full flex-col justify-between gap-4 rounded-2xl bg-[#5D41E7] px-4 py-5">
          <div className="headingXS text-white">Место</div>
          <div className="textXXL text-white">{data.place || "—"}</div>
        </div>
      </div>

      <div className="mx-auto mt-[32px] max-w-[400px] rounded-[32px] bg-surface-inverse px-4 py-[54px]">
        <Wishlist id={id} />
        <CanUCum event={data} />
      </div>
    </div>
  );
};
