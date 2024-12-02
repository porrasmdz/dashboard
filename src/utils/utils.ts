export function formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0'); // Asegura 2 dígitos
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Asegura 2 dígitos
    return `${hours}:${minutes}`;
  }