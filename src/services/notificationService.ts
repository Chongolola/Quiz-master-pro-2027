import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export class NotificationService {
  static async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    }
    return false;
  }

  static async scheduleDailyReminder() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Cancel existing reminders first
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Quiz Master Pro",
            body: "Sua pergunta diária está pronta! Venha ganhar moedas extras.",
            id: 1,
            schedule: {
              allowWhileIdle: true,
              every: 'day',
              on: {
                hour: 10,
                minute: 0
              }
            },
            sound: 'default',
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async sendImmediateNotification(title: string, body: string) {
    if (!Capacitor.isNativePlatform()) {
      console.log(`[Notification Mock] ${title}: ${body}`);
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Math.floor(Math.random() * 10000),
          sound: 'default'
        }
      ]
    });
  }
}
