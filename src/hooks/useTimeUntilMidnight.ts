import { useEffect, useState } from 'react';

function getHoursUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const ms = midnight.getTime() - now.getTime();
  return Math.floor((ms / (1000 * 60 * 60))+1);
}

export function useTimeUntilMidnight() {
  const [hoursLeft, setHoursLeft] = useState(getHoursUntilMidnight);

  useEffect(() => {
    const id = setInterval(() => {
      setHoursLeft(getHoursUntilMidnight());
    }, 60_000);

    return () => clearInterval(id);
  }, []);

  return { hoursLeft };
}
