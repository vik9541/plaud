// Словарь переводов для основных элементов интерфейса
const translations = {
  // Навигация и меню
  "Home": "Главная",
  "Dashboard": "Панель управления",
  "Recordings": "Записи",
  "Settings": "Настройки",
  "Profile": "Профиль",
  "Sign In": "Войти",
  "Sign Out":  "Выйти",
  "Sign Up": "Регистрация",
  "Log In": "Войти",
  "Log Out":  "Выйти",
  "Login": "Вход",
  "Logout": "Выход",
  
  // Кнопки и действия
  "Record": "Записать",
  "Play": "Воспроизвести",
  "Pause": "Пауза",
  "Stop": "Стоп",
  "Delete":  "Удалить",
  "Edit": "Редактировать",
  "Save": "Сохранить",
  "Cancel": "Отмена",
  "Download": "Скачать",
  "Upload": "Загрузить",
  "Share": "Поделиться",
  "Export": "Экспорт",
  "Import": "Импорт",
  "Search": "Поиск",
  "Filter": "Фильтр",
  "Sort": "Сортировка",
  "New": "Новый",
  "Create": "Создать",
  "Submit": "Отправить",
  "Confirm": "Подтвердить",
  "Back": "Назад",
  "Next": "Далее",
  "Previous": "Предыдущий",
  "Continue": "Продолжить",
  "Close": "Закрыть",
  "Open": "Открыть",
  "View": "Просмотр",
  "More": "Ещё",
  "Less":  "Меньше",
  
  // Заголовки и секции
  "My Recordings": "Мои записи",
  "Recent":  "Недавние",
  "All Recordings": "Все записи",
  "Favorites": "Избранное",
  "Transcription": "Транскрипция",
  "Summary": "Резюме",
  "Notes": "Заметки",
  "Tags": "Теги",
  "Duration": "Длительность",
  "Date": "Дата",
  "Title": "Название",
  "Description": "Описание",
  "Language": "Язык",
  "Quality": "Качество",
  "Name": "Имя",
  "Email": "Электронная почта",
  "Password": "Пароль",
  "Username": "Имя пользователя",
  
  // Настройки
  "General": "Общие",
  "Account": "Аккаунт",
  "Privacy": "Конфиденциальность",
  "Notifications": "Уведомления",
  "Appearance": "Внешний вид",
  "Audio": "Аудио",
  "Advanced": "Расширенные",
  "Help": "Помощь",
  "Support": "Поддержка",
  "About": "О программе",
  "Terms":  "Условия",
  "Privacy Policy": "Политика конфиденциальности",
  
  // Сообщения
  "Loading... ": "Загрузка.. .",
  "Processing...": "Обработка...",
  "Please wait":  "Пожалуйста, подождите",
  "No recordings found": "Записи не найдены",
  "Are you sure? ": "Вы уверены?",
  "Success": "Успешно",
  "Error": "Ошибка",
  "Warning": "Предупреждение",
  "Info": "Информация",
  "No results": "Нет результатов",
  "Try again": "Попробовать снова",
  
  // Дополнительные фразы
  "Start Recording": "Начать запись",
  "Stop Recording": "Остановить запись",
  "New Recording": "Новая запись",
  "Upload File": "Загрузить файл",
  "Record Audio": "Записать аудио",
  "Transcribe":  "Транскрибировать",
  "Auto-transcribe": "Авто-транскрипция",
  "AI Summary": "AI Резюме",
  "Download Audio": "Скачать аудио",
  "Download Transcript": "Скачать транскрипцию",
  "Copy":  "Копировать",
  "Copied": "Скопировано",
  "Copy to Clipboard": "Копировать в буфер",
  "Select All": "Выбрать все",
  "Deselect All": "Снять выделение",
  "Select Language": "Выбрать язык",
  "Rename": "Переименовать",
  "Move to":  "Переместить в",
  "Add to Favorites": "Добавить в избранное",
  "Remove from Favorites": "Удалить из избранного",
  "Show more": "Показать больше",
  "Show less":  "Показать меньше",
  "Expand": "Развернуть",
  "Collapse": "Свернуть",
  "Refresh": "Обновить",
  "Reload": "Перезагрузить",
  
  // Временные метки
  "Today": "Сегодня",
  "Yesterday":  "Вчера",
  "This week": "На этой неделе",
  "Last week": "На прошлой неделе",
  "This month": "В этом месяце",
  "Last month": "В прошлом месяце",
  
  // Единицы измерения
  "seconds": "секунд",
  "minutes": "минут",
  "hours": "часов",
  "days":  "дней",
  "ago": "назад",
  
  // Статусы
  "Active": "Активно",
  "Inactive": "Неактивно",
  "Completed": "Завершено",
  "Pending": "В ожидании",
  "Failed": "Не удалось",
  "In Progress": "В процессе"
};

// Функция для перевода текстового содержимого
function translateText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Точное совпадение
  if (translations[text]) {
    return translations[text];
  }
  
  // Поиск по частичному совпадению (для текста с дополнительными пробелами)
  const trimmedText = text.trim();
  if (translations[trimmedText]) {
    return translations[trimmedText];
  }
  
  return text;
}

// Функция для перевода элементов страницы
function translatePage() {
  // Переводим текстовые узлы
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter. SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Пропускаем скрипты, стили и уже переведенные узлы
        if (node.parentElement. tagName === 'SCRIPT' || 
            node.parentElement.tagName === 'STYLE' ||
            node.parentElement.tagName === 'NOSCRIPT' ||
            node.parentElement. hasAttribute('data-translated')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodesToTranslate = [];
  let node;

  while (node = walker.nextNode()) {
    const text = node.textContent. trim();
    if (text.length > 0 && text. length < 200) { // Ограничиваем длину для производительности
      nodesToTranslate.push(node);
    }
  }

  nodesToTranslate.forEach(node => {
    const originalText = node.textContent. trim();
    const translatedText = translateText(originalText);
    if (translatedText !== originalText) {
      node.textContent = node.textContent.replace(originalText, translatedText);
      node.parentElement.setAttribute('data-translated', 'true');
    }
  });

  // Переводим placeholder'ы в input полях
  const inputs = document.querySelectorAll('input[placeholder]: not([data-translated]), textarea[placeholder]:not([data-translated])');
  inputs.forEach(input => {
    const originalPlaceholder = input.getAttribute('placeholder');
    const translatedPlaceholder = translateText(originalPlaceholder);
    if (translatedPlaceholder !== originalPlaceholder) {
      input.setAttribute('placeholder', translatedPlaceholder);
      input.setAttribute('data-translated', 'true');
    }
  });

  // Переводим атрибуты title
  const elementsWithTitle = document.querySelectorAll('[title]: not([data-translated-title])');
  elementsWithTitle. forEach(element => {
    const originalTitle = element.getAttribute('title');
    const translatedTitle = translateText(originalTitle);
    if (translatedTitle !== originalTitle) {
      element.setAttribute('title', translatedTitle);
      element.setAttribute('data-translated-title', 'true');
    }
  });

  // Переводим атрибуты aria-label
  const elementsWithAriaLabel = document.querySelectorAll('[aria-label]:not([data-translated-aria])');
  elementsWithAriaLabel.forEach(element => {
    const originalLabel = element.getAttribute('aria-label');
    const translatedLabel = translateText(originalLabel);
    if (translatedLabel !== originalLabel) {
      element.setAttribute('aria-label', translatedLabel);
      element.setAttribute('data-translated-aria', 'true');
    }
  });
}

// Проверяем, включен ли перевод
chrome.storage.sync.get(['translationEnabled'], function(result) {
  if (result.translationEnabled !== false) {
    // Запускаем перевод при загрузке страницы
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', translatePage);
    } else {
      translatePage();
    }

    // Наблюдаем за изменениями DOM для динамического контента
    const observer = new MutationObserver((mutations) => {
      // Используем debounce для оптимизации производительности
      clearTimeout(window.translationTimeout);
      window.translationTimeout = setTimeout(() => {
        translatePage();
      }, 300);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('✅ Plaud.ai Russian Translation активировано');
  }
});