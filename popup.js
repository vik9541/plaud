// Plaud.ai Russian Translation - Popup Script v1.1.0

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('translationToggle');
  const statusIcon = document.getElementById('statusIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusDesc = document.getElementById('statusDesc');
  const translatedCountEl = document.getElementById('translatedCount');
  const dictionarySizeEl = document.getElementById('dictionarySize');
  const sessionTimeEl = document.getElementById('sessionTime');
  const refreshBtn = document.getElementById('refreshBtn');
  const openPlaudBtn = document.getElementById('openPlaudBtn');
  
  // Время начала сессии
  let sessionStart = Date.now();
  
  // Загружаем сохраненное состояние
  chrome.storage.sync.get(['translationEnabled'], function(result) {
    const isEnabled = result.translationEnabled !== false;
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
  });
  
  // Загружаем статистику
  loadStats();
  
  // Обновляем время сессии каждую минуту
  updateSessionTime();
  setInterval(updateSessionTime, 60000);
  
  // Обработка переключения
  toggle.addEventListener('change', function() {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ translationEnabled: enabled }, function() {
      updateStatus(enabled);
      
      // Перезагружаем вкладку для применения изменений
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('web.plaud.ai')) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
  
  // Кнопка обновления
  refreshBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
        // Анимация кнопки
        refreshBtn.innerHTML = '<span class="btn-icon">✓</span> Обновлено';
        setTimeout(() => {
          refreshBtn.innerHTML = '<span class="btn-icon">🔄</span> Обновить';
        }, 1500);
      }
    });
  });
  
  // Кнопка открытия Plaud
  openPlaudBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://web.plaud.ai' });
  });
  
  // Обработка вкладок
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      // Убираем активный класс со всех вкладок
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Добавляем активный класс на выбранную вкладку
      this.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    });
  });
  
  function updateStatus(enabled) {
    if (enabled) {
      statusIcon.textContent = '✓';
      statusIcon.classList.remove('inactive');
      statusIcon.classList.add('active');
      statusTitle.textContent = 'Перевод активен';
      statusDesc.textContent = 'Интерфейс переводится автоматически';
    } else {
      statusIcon.textContent = '✗';
      statusIcon.classList.remove('active');
      statusIcon.classList.add('inactive');
      statusTitle.textContent = 'Перевод отключён';
      statusDesc.textContent = 'Нажмите переключатель для включения';
    }
  }
  
  function loadStats() {
    // Получаем статистику из content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('web.plaud.ai')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getStats' }, function(response) {
          if (response) {
            translatedCountEl.textContent = response.translatedCount || 0;
            dictionarySizeEl.textContent = (response.dictionarySize || 500) + '+';
          }
        });
      }
    });
    
    // Загружаем из storage
    chrome.storage.local.get(['translatedCount'], function(result) {
      if (result.translatedCount) {
        translatedCountEl.textContent = result.translatedCount;
      }
    });
  }
  
  function updateSessionTime() {
    const elapsed = Date.now() - sessionStart;
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      sessionTimeEl.textContent = hours + 'ч ' + (minutes % 60) + 'м';
    } else {
      sessionTimeEl.textContent = minutes + 'м';
    }
  }
  
  // Горячие клавиши
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 't') {
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event('change'));
    }
  });
});
