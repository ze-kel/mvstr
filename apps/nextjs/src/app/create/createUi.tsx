"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";

import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import { Input } from "@acme/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Textarea } from "@acme/ui/textarea";

import { StyledText } from "~/app/_components/text";

const types = [
  "День рождения",
  "Новый год",
  "Встреча с друзьями",
  "Встреча с родными",
  "Праздник ребенка",
  "Вечеринка",
];

const NumberInput = ({
  onValidatedChange,
}: {
  onValidatedChange: (h: number, m: number) => void;
}) => {
  const [hours, setHours] = useState("");
  const [minute, setMinute] = useState("");

  const trySubmit = (h, m) => {
    if (typeof h === "number" && typeof m === "number") {
      onValidatedChange(h, m);
    } else if (typeof h === "number") {
      onValidatedChange(h, 0);
    }
  };

  const hourHandler = (v: string) => {
    if (!v.length) {
      setHours("");
      return;
    }
    const n = Number(v);
    if (Number.isNaN(v)) return;
    const nLimit = Math.max(Math.min(23, n), 0);

    setHours(String(nLimit));
    trySubmit(nLimit, Number(minute));
  };
  const minuteHandler = (v: string) => {
    if (!v.length) {
      setMinute("");
      return;
    }
    const n = Number(v);
    if (Number.isNaN(v)) return;
    const nLimit = Math.max(Math.min(59, n), 0);

    setMinute(String(nLimit));
    trySubmit(Number(hours), nLimit);
  };

  return (
    <div className="flex">
      <Input
        value={hours}
        onChange={(e) => {
          hourHandler(e.target.value);
        }}
        type="number"
        className="w-16 rounded-e-none text-center tracking-widest"
        placeholder="__"
      />
      <Input
        value={minute}
        onChange={(e) => {
          minuteHandler(e.target.value);
        }}
        type="number"
        className="w-16 rounded-s-none text-center tracking-widest"
        placeholder="__"
      />
    </div>
  );
};

const DateTimeInput = ({
  onChange,
}: {
  onChange: (d: Date, time?: string) => void;
}) => {
  const [date, setDate] = useState(new Date());

  const [isCalendarOpened, setIsCalendarOpened] = useState(false);
  const [time, setTime] = useState("");

  return (
    <div className="mt-5 flex justify-between gap-4">
      <div className="flex w-full flex-col gap-3">
        <div>
          <StyledText className="" token="subHeadingM">
            Дата начала
          </StyledText>
        </div>

        <Popover onOpenChange={setIsCalendarOpened} open={isCalendarOpened}>
          <PopoverTrigger asChild className="w-full cursor-pointer">
            <div className="placeholderM  bg-buttons-secondary placeholder:text-text-tertiary focus:outline-text-secondary flex  w-full rounded-xl border border-neutral-200 px-4 py-3 text-lg outline-transparent transition-colors">
              {format(date, "dd.MM.yyyy")}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-fit p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(v) => {
                setDate(v);
                setIsCalendarOpened(false);
                onChange(v, time);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <StyledText className="" token="subHeadingM">
            Время
          </StyledText>
        </div>
        <NumberInput onValidatedChange={(h, m) => setTime(`${h}:${m}`)} />
      </div>
    </div>
  );
};

export const CreateForm = ({
  initialState,
}: {
  initialState: NewEvent | DbEventSelect;
}) => {
  const { mutateAsync } = UseCreateEventMutation();
  const ref = useRef<NewEvent | DbEventSelect>({
    name: "",
  });

  const saver = async () => {
    if (!ref.current.name) return;

    await mutateAsync({ event: ref.current, redirect: true });
  };

  return (
    <div className="bg-surface-inverse p-6">
      <StyledText token="headingL">Расскажите о вашем мероприятии</StyledText>
      <StyledText token="subHeadingL">
        Введите информацию о мероприятии
      </StyledText>
      <StyledText className="mt-5" token="subHeadingM">
        Название мероприятия<span className="text-text-error">*</span>
      </StyledText>
      <Input
        onChange={(e) => (ref.current.name = e.target.value)}
        className="mt-3"
        placeholder="Введите название мероприятия"
      />
      <StyledText className="mt-5" token="subHeadingM">
        Выберите тип мероприятия
      </StyledText>
      <Select onValueChange={(v) => (ref.current.type = v)}>
        <SelectTrigger className="mt-3">
          <SelectValue placeholder="Тип мероприятия" />
        </SelectTrigger>

        <SelectContent>
          {types.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <StyledText className="mt-5" token="subHeadingM">
        Место проведения
      </StyledText>
      <Input
        className="mt-3"
        placeholder="Введите адрес"
        onChange={(e) => (ref.current.place = e.target.value)}
      />

      <DateTimeInput
        onChange={(d, t) => {
          ref.current.date = d;
          ref.current.time = t;
        }}
      />

      <StyledText className="mt-5" token="subHeadingM">
        Опишите ваше мероприятие
      </StyledText>
      <Textarea
        onChange={(e) => (ref.current.description = e.target.value)}
        className="mt-3"
        placeholder="Расскажите подробнее о вашем мероприятии в пару предложений"
      />

      <div className="mt-12">
        <Button onClick={() => void saver()}>Создать</Button>
      </div>
    </div>
  );
};
