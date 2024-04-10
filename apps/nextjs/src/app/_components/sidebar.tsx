"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Budget, Main, People, Task, Wishes } from "@acme/ui/icons";

import { EventList } from "~/app/_components/eventlist";
import { useEventId } from "~/app/_components/eventProvider";
import { StyledText } from "~/app/_components/text";
import { api } from "~/trpc/react";

export const Logo = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="44"
      height="44"
      rx="12.878"
      fill="url(#paint0_radial_914_1536)"
    />
    <path
      d="M18.8835 14.3184C20.0884 13.1134 22.042 13.1134 23.2469 14.3184C24.4518 15.5233 24.4518 17.4768 23.2469 18.6817L12.2436 29.685C11.0387 30.8899 9.08516 30.8899 7.88025 29.685C6.67533 28.4801 6.67533 26.5265 7.88025 25.3216L18.8835 14.3184Z"
      fill="#F2EFF6"
    />
    <path
      d="M29.241 14.3184C30.4459 13.1134 32.3995 13.1134 33.6044 14.3184C34.8093 15.5233 34.8093 17.4768 33.6044 18.6817L22.6011 29.685C21.3962 30.8899 19.4427 30.8899 18.2377 29.685C17.0328 28.4801 17.0328 26.5265 18.2377 25.3216L29.241 14.3184Z"
      fill="#F2EFF6"
    />
    <path
      d="M28.3358 17.5228C28.3358 15.5528 29.9328 13.9559 31.9027 13.9559C33.3408 13.9559 34.5066 15.1217 34.5066 16.5597V27.5047C34.5066 29.2087 33.1252 30.59 31.4212 30.59C29.7172 30.59 28.3358 29.2087 28.3358 27.5047V17.5228Z"
      fill="#F2EFF6"
    />
    <defs>
      <radialGradient
        id="paint0_radial_914_1536"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(22 21.5976) rotate(49.0856) scale(39.9409 32.744)"
      >
        <stop stopColor="#563ADC" />
        <stop offset="1" stopColor="#884DE8" />
      </radialGradient>
    </defs>
  </svg>
);

interface MenuItem {
  icon: React.FC;
  text: string;
  link: string;
}

export const MenuDisplay = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();
  return (
    <>
      {items.map((v) => (
        <Link
          href={v.link}
          key={v.text}
          data-active={pathname.startsWith(v.link)}
          className="fill-icons-tertiary data-[active=true]:bg-surface-secondary data-[active=true]:fill-text-accent flex items-center gap-2 rounded-[10px] p-2.5"
        >
          <v.icon />
          <StyledText token="captionL">{v.text}</StyledText>
        </Link>
      ))}
    </>
  );
};

const MenuForEvent = () => {
  const id = useEventId();

  const menuItems: MenuItem[] = [
    {
      icon: Main,
      text: "Сводка",
      link: `/app/event/${id}`,
    },
    {
      icon: Task,
      text: "Задачи",
      link: `/app/event/${id}/tasks`,
    },
    {
      icon: Budget,
      text: "Бюджеты",
      link: `/app/event/${id}/budget`,
    },
    {
      icon: People,
      text: "Гости",
      link: `/app/event/${id}/people`,
    },
    {
      icon: Wishes,
      text: "Вишлист",
      link: `/app/event/${id}/wishlist`,
    },
  ];

  return <MenuDisplay items={menuItems} />;
};

const EventTitle = () => {
  const id = useEventId();
  const { data } = api.events.get.useQuery(id);

  return <>{data?.name}</>;
};

export const Sidebar = ({ specificEvent }: { specificEvent?: boolean }) => {
  return (
    <div className="rounded-panel-l bg-surface-inverse grid h-full w-full max-w-[308px] grid-cols-[76px_1fr]">
      <div className="border-stroke-secondary border-b border-r px-4 py-5">
        <Logo />
      </div>
      <div className="border-stroke-secondary  flex items-center justify-center border-b">
        <StyledText token="subHeadingM" className="w-[134px] truncate">
          {specificEvent && <EventTitle />}
        </StyledText>
      </div>
      <div className="border-stroke-secondary  flex flex-col items-center border-r py-3">
        <EventList />
      </div>
      <div className="p-3">{specificEvent && <MenuForEvent />}</div>
    </div>
  );
};
