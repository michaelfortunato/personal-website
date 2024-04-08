"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { MoonIcon } from "@radix-ui/react-icons";
import { SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className,
      )}
      {...props}
      onClick={() => (theme == "light" ? setTheme("dark") : setTheme("light"))}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "group pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
        asChild
      >
        <div className="relative">
          <MoonIcon className="absolute transition-opacity group-data-[state=unchecked]:opacity-0" />
          <SunIcon className="absolute transition-opacity group-data-[state=checked]:opacity-0" />
        </div>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
ThemeSwitch.displayName = SwitchPrimitives.Root.displayName;

export { ThemeSwitch };
