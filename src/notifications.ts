import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

export async function requestNotificationPermission() {
  await notifee.requestPermission();
}

export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'lessons',
    name: 'Напоминания о занятиях',
    importance: 4,
  });
}

export async function scheduleLessonReminder(
  subject: string,
  dayOfWeek: number,
  time: string
) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hours, minutes - 15, 0, 0);

  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  let daysAhead = dayOfWeek - currentDay;

  if (daysAhead < 0 || (daysAhead === 0 && triggerDate <= now)) {
    daysAhead += 7;
  }

  triggerDate.setDate(triggerDate.getDate() + daysAhead);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      title: 'Скоро занятие',
      body: `${subject} начнётся через 15 минут`,
      android: {
        channelId: 'lessons',
        pressAction: { id: 'default' },
      },
    },
    trigger
  );
}
