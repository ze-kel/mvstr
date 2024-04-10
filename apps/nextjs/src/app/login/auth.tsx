import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";

import { LogoutUser } from "~/app/login/logout";

export const LoginWithVk = ({ className }: { className?: string }) => {
  return (
    <a href="/login/vk" className={cn("w-full", className)}>
      <Button className="flex w-full justify-between" variant="stroke">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_280_6866)">
            <mask
              id="mask0_280_6866"
              style={{ maskType: "luminance" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="20"
              height="20"
            >
              <path d="M19.901 0H0.0990143V20H19.901V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_280_6866)">
              <path
                d="M0 9.6C0 5.07452 0 2.81178 1.40589 1.40589C2.81178 0 5.07452 0 9.6 0H10.4C14.9255 0 17.1882 0 18.5941 1.40589C20 2.81178 20 5.07452 20 9.6V10.4C20 14.9255 20 17.1882 18.5941 18.5941C17.1882 20 14.9255 20 10.4 20H9.6C5.07452 20 2.81178 20 1.40589 18.5941C0 17.1882 0 14.9255 0 10.4V9.6Z"
                fill="#0077FF"
              />
              <path
                d="M10.6417 14.4084C6.08337 14.4084 3.48339 11.2834 3.37505 6.0834H5.65839C5.73339 9.90006 7.41669 11.5167 8.75001 11.8501V6.0834H10.9001V9.37504C12.2167 9.23338 13.5999 7.7334 14.0666 6.0834H16.2166C15.8583 8.11674 14.3583 9.61672 13.2916 10.2334C14.3583 10.7334 16.0667 12.0417 16.7167 14.4084H14.35C13.8416 12.8251 12.5751 11.6001 10.9001 11.4334V14.4084H10.6417Z"
                fill="white"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_280_6866">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        Войти через VK
        <div></div>
      </Button>
    </a>
  );
};

export const LogOut = () => {
  return (
    <form className="w-fit" action={LogoutUser}>
      <Button variant="inverse">Выйти</Button>
    </form>
  );
};
