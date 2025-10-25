import { useEffect, useRef } from 'react';
import type { Medicine } from '../types';

// Fix: Add 'as const' to provide a narrow, specific type for the array elements.
// This ensures TypeScript infers `currentDay` as one of the literal day strings,
// matching the type required by `schedule.days`.
const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const useReminders = (
  medicines: Medicine[],
  onReminder: (medicine: Medicine) => void
) => {
  const lastCheckedMinute = useRef<number | null>(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDay = DAY_MAP[now.getDay()];
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes();

      // Only check once per minute
      if (currentMinute === lastCheckedMinute.current) {
        return;
      }
      lastCheckedMinute.current = currentMinute;
      
      const currentTime = `${currentHour}:${now.getMinutes().toString().padStart(2, '0')}`;

      medicines.forEach(med => {
        med.schedules.forEach(schedule => {
          if (schedule.days.includes(currentDay) && schedule.time === currentTime) {
            // Found a reminder
            console.log(`Reminder for ${med.name}`);
            if ('Notification' in window && Notification.permission === 'granted') {
              const notification = new Notification('Time for your medication!', {
                body: `${med.name} - ${med.dosage}mg`,
                icon: med.imageUrl || '/favicon.ico', // You might need a default icon
              });
              notification.onclick = () => {
                onReminder(med);
                window.focus(); // Bring the tab to the front
              };
            } else {
                // Fallback for when notifications are not granted
                onReminder(med);
            }
          }
        });
      });
    };

    const intervalId = setInterval(checkReminders, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [medicines, onReminder]);
};
