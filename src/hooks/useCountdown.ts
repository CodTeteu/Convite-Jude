import { useEffect, useState } from "react";

function getCountdown(target: string) {
  const difference = new Date(target).getTime() - Date.now();
  const remaining = Math.max(difference, 0);

  return {
    isExpired: difference <= 0,
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
}

export function useCountdown(target: string) {
  const [timeLeft, setTimeLeft] = useState(() => getCountdown(target));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getCountdown(target));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [target]);

  return timeLeft;
}
