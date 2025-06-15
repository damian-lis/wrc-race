import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TimeInputProps {
  value: string; // format: mm:ss:SSS
  onChange: Dispatch<SetStateAction<string>>;
  className?: string;
}

export const TimeInput = ({ value, onChange, className }: TimeInputProps) => {
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [millis, setMillis] = useState("");

  const secondsRef = useRef<HTMLInputElement>(null);
  const millisRef = useRef<HTMLInputElement>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const [m = "", s = "", ms = ""] = value.split(/[:.]/);
    setMinutes(m);
    setSeconds(s);
    setMillis(ms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!minutes && !seconds && !millis) return;
    const combined = `${minutes}:${seconds}.${millis}`;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      onChange(combined);
    }, 200);
  }, [minutes, seconds, millis, onChange]);

  const inputClass =
    "shadow-xs h-[2.3rem] border-gray-500 text-gray-900 text-sm block w-full p-2.5 rounded-md border focus-visible:border-ring focus-visible:ring-ring/50 placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-[100px]";

  return (
    <div className={twMerge("flex items-center gap-1 max-w-max]", className)}>
      <input
        type="number"
        inputMode="numeric"
        value={minutes}
        placeholder="03"
        onChange={(e) => {
          const raw = e.target.value;
          let val = raw;

          if (Number(val) > 59) val = "59";

          setMinutes(val);

          if (val === raw && val.length === 2) {
            secondsRef.current?.focus();
          }
        }}
        className={inputClass}
        autoComplete="off"
        max={59}
        min={0}
      />
      <span className="text-lg text-gray-500">:</span>
      <input
        ref={secondsRef}
        type="number"
        inputMode="numeric"
        value={seconds}
        placeholder="44"
        onChange={(e) => {
          const raw = e.target.value;
          let val = raw;

          if (Number(val) > 59) val = "59";

          setSeconds(val);

          if (val === raw && val.length === 2) {
            millisRef.current?.focus();
          }
        }}
        className={inputClass}
        autoComplete="off"
        max={59}
        min={0}
      />
      <span className="text-lg text-gray-500">.</span>
      <input
        ref={millisRef}
        type="number"
        inputMode="numeric"
        value={millis}
        placeholder="899"
        onChange={(e) => {
          const raw = e.target.value;
          let val = raw;

          if (Number(val) > 999) val = "999";

          setMillis(val);
        }}
        className={inputClass}
        autoComplete="off"
        max={999}
        min={0}
      />
    </div>
  );
};
