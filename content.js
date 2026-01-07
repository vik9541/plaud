// Plaud.ai Russian Translation Extension v2.0.0
// Полный онлайн-перевод всего текста

// Кэш переводов
const cache = new Map();

// Очередь на перевод
let translateQueue = [];
let isTranslating = false;

// Google Translate API
async function translate(text) {
  if (!text || text.length < 2) return text;
  
  const trimmed = text.trim();
  if (cache.has(trimmed)) return cache.get(trimmed);
  
  // Пропускаем если нет латиницы
  if (!/[a-zA-Z]/.test(trimmed)) return text;
  
  // Пропускаем числа, даты, время
  if (/^\d[\d\s:\-\.\/]+\d$/.test(trimmed)) return text;
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data?.[0]) {
      let result = '';
      for (const part of data[0]) {
        if (part?.[0]) result += part[0];
      }
      cache.set(trimmed, result);
      return result;
    }
  } catch (e) {
    console.error('Translate error:', e);
  }
  
  return text;
}

// Перевод элемента
async function translateElement(el) {
  if (!el || el.hasAttribute('data-ru')) return;
  if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return;
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
  if (el.isContentEditable) return;
  
  // Элемент без детей — переводим напрямую
  if (el.children.length === 0) {
    const text = el.textContent;
    if (text && text.trim().length > 1 && /[a-zA-Z]/.test(text)) {
      const translated = await translate(text.trim());
      if (translated !== text.trim()) {
        el.textContent = translated;
        el.setAttribute('data-ru', '1');
      }
    }
    return;
  }
  
  // Элемент с детьми — переводим текстовые узлы
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (text && text.trim().length > 1 && /[a-zA-Z]/.test(text)) {
        const translated = await translate(text.trim());
        if (translated !== text.trim()) {
          child.textContent = text.replace(text.trim(), translated);
        }
      }
    }
  }
  el.setAttribute('data-ru', '1');
}

// Обработка очереди переводов
async function processQueue() {
  if (isTranslating || translateQueue.length === 0) return;
  
  isTranslating = true;
  
  while (translateQueue.length > 0) {
    const batch = translateQueue.splice(0, 10); // Берём по 10 элементов
    await Promise.all(batch.map(el => translateElement(el)));
    await new Promise(r => setTimeout(r, 50)); // Небольшая пауза
  }
  
  isTranslating = false;
}

// Собираем элементы для перевода
function collectElements() {
  const elements = document.querySelectorAll('body *:not(script):not(style):not(noscript):not([data-ru])');
  
  for (const el of elements) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') continue;
    if (el.isContentEditable) continue;
    
    const text = el.textContent;
    if (text && /[a-zA-Z]/.test(text)) {
      translateQueue.push(el);
    }
  }
  
  processQueue();
}

// Перевод placeholder и title
async function translateAttributes() {
  // Placeholder
  const inputs = document.querySelectorAll('input[placeholder]:not([data-ru-ph]), textarea[placeholder]:not([data-ru-ph])');
  for (const input of inputs) {
    const ph = input.getAttribute('placeholder');
    if (ph && /[a-zA-Z]/.test(ph)) {
      const translated = await translate(ph);
      if (translated !== ph) {
        input.setAttribute('placeholder', translated);
      }
    }
    input.setAttribute('data-ru-ph', '1');
  }
  
  // Title
  const titles = document.querySelectorAll('[title]:not([data-ru-title])');
  for (const el of titles) {
    const title = el.getAttribute('title');
    if (title && /[a-zA-Z]/.test(title)) {
      const translated = await translate(title);
      if (translated !== title) {
        el.setAttribute('title', translated);
      }
    }
    el.setAttribute('data-ru-title', '1');
  }
  
  // Aria-label
  const ariaLabels = document.querySelectorAll('[aria-label]:not([data-ru-aria])');
  for (const el of ariaLabels) {
    const label = el.getAttribute('aria-label');
    if (label && /[a-zA-Z]/.test(label)) {
      const translated = await translate(label);
      if (translated !== label) {
        el.setAttribute('aria-label', translated);
      }
    }
    el.setAttribute('data-ru-aria', '1');
  }
}

// Главная функция перевода
function translatePage() {
  collectElements();
  translateAttributes();
}

// Запуск при загрузке
function init() {
  console.log('🇷🇺 Plaud.ai Russian Translation v2.0 запущен');
  
  // Первый перевод
  translatePage();
  
  // Наблюдаем за изменениями DOM
  const observer = new MutationObserver((mutations) => {
    let hasNewNodes = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        hasNewNodes = true;
        break;
      }
    }
    if (hasNewNodes) {
      setTimeout(translatePage, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Периодический перевод для динамического контента
  setInterval(translatePage, 2000);
}

// Проверяем настройки
chrome.storage.sync.get(['translationEnabled'], function(result) {
  if (result.translationEnabled !== false) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
});

// Сообщения от popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    sendResponse({ 
      translatedCount: cache.size,
      queueLength: translateQueue.length
    });
  }
  return true;
});
