// Форматування часу у формат 24 години
// Ця функція приймає час у форматі 'години:хвилини', і повертає його у форматі з двозначними годинами та хвилинами
export const formatTimeTo24Hour = (time) => {
  const [hours, minutes] = time.split(":").map(Number); // Розділяємо години і хвилини та перетворюємо в число
  const formattedHours = String(hours).padStart(2, "0"); // Додаємо нулі, якщо годин менше двох цифр
  const formattedMinutes = String(minutes).padStart(2, "0"); // Аналогічно для хвилин
  return `${formattedHours}:${formattedMinutes}`; // Повертаємо час у форматі "ГГ:ХХ"
};

// Обчислення робочого часу
// Функція приймає час початку і кінця та обчислює тривалість роботи
export const calculateWorkingTime = (startTime, endTime) => {
  let start = new Date(`1970-01-01T${startTime}:00`); // Створюємо об'єкт дати для часу початку
  let end = new Date(`1970-01-01T${endTime}:00`); // Створюємо об'єкт дати для часу кінця

  // Якщо кінець менший за початок (наприклад, кінець вночі), додаємо день до кінцевого часу
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  // Обчислюємо різницю у хвилинах
  const diff = (end - start) / 1000 / 60; // Різниця в мілісекундах -> хвилини
  const hours = Math.floor(diff / 60); // Виділяємо години з хвилин
  const minutes = diff % 60; // Залишок — це хвилини

  return `${hours}h ${minutes}m`; // Повертаємо результат у форматі "Х годин Y хвилин"
};

// Обчислення простою (downtime)
// Аналогічна функція для обчислення простою між часом початку і кінця
export const calculateDowntime = (startTime, endTime) => {
  let start = new Date(`1970-01-01T${startTime}:00`); // Створюємо дату для часу початку
  let end = new Date(`1970-01-01T${endTime}:00`); // Створюємо дату для часу кінця

  // Якщо кінець часу менший за початок, додаємо день
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  // Обчислюємо різницю в хвилинах
  const diff = (end - start) / 1000 / 60; // Різниця у хвилинах
  const hours = Math.floor(diff / 60); // Виділяємо години
  const minutes = diff % 60; // Виділяємо хвилини

  return `${hours}h ${minutes}m`; // Повертаємо строку формату "Х годин Y хвилин"
};

// Корекція дати для нічної зміни
// Якщо зміна перетинає межу дня (нічна зміна), функція коригує дату на наступний день
export const adjustDateForShift = (date, startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number); // Виділяємо години і хвилини з часу
  const [year, month, day] = date.split("-").map(Number); // Виділяємо рік, місяць і день з дати
  let dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes)); // Створюємо об'єкт дати на основі параметрів

  // Оновлюємо рік, місяць і день з урахуванням часу зміни
  const newYear = dateObj.getUTCFullYear();
  const newMonth = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Форматуємо місяць
  const newDay = String(dateObj.getUTCDate()).padStart(2, "0"); // Форматуємо день

  return `${newYear}-${newMonth}-${newDay}`; // Повертаємо відкориговану дату у форматі "РРРР-ММ-ДД"
};
