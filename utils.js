// Utilitários gerais do app
export class ABFitUtils {
  static formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  static formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  static calculateAge(birthDate) {
    return new Date().getFullYear() - new Date(birthDate).getFullYear();
  }

  static calculateIMC(weight, height) {
    return (weight / ((height / 100) ** 2)).toFixed(1);
  }

  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}

// Gerenciador de notificações
export class NotificationManager {
  static async requestPermission() {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  static showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: 'https://i.ibb.co/L06f36R/logo-ab-fit-192.png',
        badge: 'https://i.ibb.co/L06f36R/logo-ab-fit-192.png',
        ...options
      });
    }
  }

  static showDailyReminder() {
    this.showNotification('AB Fit - Hora do Treino!', {
      body: 'Não se esqueça do seu treino de hoje! 💪',
      tag: 'daily-reminder'
    });
  }
}
