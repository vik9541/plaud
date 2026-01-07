document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('translationToggle');
  const status = document.getElementById('status');
  
  // Загружаем сохраненное состояние
  chrome.storage. sync.get(['translationEnabled'], function(result) {
    const isEnabled = result.translationEnabled !== false;
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
  });
  
  // Сохраняем состояние при изменении
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
  
  function updateStatus(enabled) {
    if (enabled) {
      status.textContent = '✓ Перевод активен';
      status.classList.remove('disabled');
    } else {
      status.textContent = '✗ Перевод выключен';
      status.classList.add('disabled');
    }
  }
});