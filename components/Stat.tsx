"use client";

import CountUp from "react-countup";

interface StatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

// Contador animado al entrar en viewport (requisito #5 de animaciones avanzadas)
export function Stat({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2.2,
  className,
}: StatProps) {
  return (
    <CountUp
      end={end}
      suffix={suffix}
      prefix={prefix}
      decimals={decimals}
      decimal=","
      duration={duration}
      enableScrollSpy
      scrollSpyOnce
      className={className}
    />
  );
}
