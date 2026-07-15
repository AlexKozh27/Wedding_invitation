import { createSeatingMap } from './seating-map.js';

export function normalizeSearch(value) {
  return String(value || '')
    .toLocaleLowerCase('ru-RU')
    .replaceAll('ё', 'е')
    .replace(/[^а-яa-z0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const API_URL = typeof document === 'undefined' ? '' : document.querySelector('meta[name="seating-api-url"]')?.content.trim();
const app = typeof document === 'undefined' ? null : document.querySelector('[data-seating-app]');

if (app) {
  const input = app.querySelector('.seating-input');
  const suggestions = app.querySelector('.seating-suggestions');
  const status = app.querySelector('.seating-status');
  const result = app.querySelector('.seating-result');
  const resultName = app.querySelector('.seating-result-name');
  const resultPlace = app.querySelector('.seating-result-place');
  const resetButton = app.querySelector('.seating-reset');
  const spinner = app.querySelector('.seating-spinner');
  const tableActions = app.querySelector('.seating-table-actions');
  const guestsButton = app.querySelector('.seating-guests-button');
  const tableGuests = app.querySelector('.seating-table-guests');
  let map;
  let items = [];
  let activeIndex = -1;
  let timer;
  let searchController;
  let seatController;
  let tableController;
  let selectedTableId;

  const setStatus = (message = '') => { status.textContent = message; };
  const closeSuggestions = () => {
    suggestions.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  };
  const clearResult = () => {
    result.hidden = true;
    tableActions.hidden = true;
    tableGuests.hidden = true;
    tableGuests.replaceChildren();
    selectedTableId = undefined;
    map?.resetMap();
    resetButton.hidden = true;
  };
  const renderSuggestions = () => {
    suggestions.replaceChildren();
    if (!items.length) return closeSuggestions();
    items.forEach((item, index) => {
      const option = document.createElement('li');
      option.id = `guest-option-${index}`;
      option.className = 'seating-option';
      option.role = 'option';
      option.setAttribute('aria-selected', String(index === activeIndex));
      option.textContent = item.hint ? `${item.displayName} — ${item.hint}` : item.displayName;
      option.addEventListener('pointerdown', (event) => { event.preventDefault(); selectGuest(index); });
      suggestions.append(option);
    });
    suggestions.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (activeIndex >= 0) input.setAttribute('aria-activedescendant', `guest-option-${activeIndex}`);
  };
  const apiRequest = async (action, params, controller) => {
    if (!API_URL) throw new Error('API_NOT_CONFIGURED');
    const url = new URL(API_URL);
    url.search = new URLSearchParams({ action, ...params });
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('NETWORK_ERROR');
    return response.json();
  };
  const showResult = (name, place) => {
    resultName.textContent = name;
    resultPlace.textContent = place;
    result.hidden = false;
  };
  const selectTableOnMap = (tableId, seatId) => {
    if (!map.highlightSelection(tableId, seatId)) throw new Error('LAYOUT_NOT_FOUND');
    map.focusSelection(tableId, seatId);
    resetButton.hidden = false;
  };
  const prepareTableActions = (tableId) => {
    selectedTableId = tableId;
    tableActions.hidden = false;
    tableGuests.hidden = true;
    tableGuests.replaceChildren();
    guestsButton.textContent = `Показать гостей за столом ${tableId}`;
  };
  const handleTableClick = ({ tableId }) => {
    selectTableOnMap(tableId);
    prepareTableActions(tableId);
    setStatus(`Стол ${tableId} выбран. Можно посмотреть гостей за этим столом.`);
  };
  const handleSeatClick = async ({ tableId, seatId, kind, label }) => {
    selectTableOnMap(tableId, seatId);
    prepareTableActions(tableId);
    if (kind === 'newlyweds') {
      showResult(label || 'Место молодожёнов', 'Здесь будем сидеть мы ♥');
      setStatus('Это место молодожёнов.');
      return;
    }
    if (seatController) seatController.abort();
    seatController = new AbortController();
    setStatus('Узнаём, кто сидит на этом месте…');
    try {
      const data = await apiRequest('getGuestBySeat', { seatId }, seatController);
      if (!data?.ok || !data.guest?.displayName) throw new Error(data?.code || 'GUEST_NOT_FOUND');
      showResult(data.guest.displayName, `Стол: ${data.guest.tableId}. Место: ${data.guest.seatId}.`);
      setStatus('Гость найден.');
    } catch (error) {
      if (error.name !== 'AbortError') {
        showResult('Место пока свободно или не назначено', `Стол: ${tableId}. Место: ${seatId}.`);
        setStatus('Для этого места пока нет назначения.');
      }
    }
  };
  map = createSeatingMap(app.querySelector('.seating-map'), undefined, { onTableClick: handleTableClick, onSeatClick: handleSeatClick });
  const searchGuests = async () => {
    const q = normalizeSearch(input.value);
    clearResult();
    if (searchController) searchController.abort();
    if (q.length < 3) {
      items = [];
      closeSuggestions();
      setStatus(q ? 'Введите минимум 3 символа.' : '');
      return;
    }
    searchController = new AbortController();
    spinner.classList.add('is-loading');
    setStatus('Ищем совпадения…');
    try {
      const data = await apiRequest('searchGuests', { q }, searchController);
      if (!data?.ok) throw new Error(data?.code || 'TEMPORARY_ERROR');
      items = Array.isArray(data.items) ? data.items.slice(0, 5).filter((item) => item?.guestId && item?.displayName) : [];
      renderSuggestions();
      setStatus(items.length ? `Найдено вариантов: ${items.length}.` : 'Совпадений не найдено. Проверьте имя или напишите организатору.');
    } catch (error) {
      if (error.name !== 'AbortError') {
        items = [];
        closeSuggestions();
        setStatus(error.message === 'API_NOT_CONFIGURED' ? 'Поиск скоро будет доступен.' : 'Не удалось выполнить поиск. Попробуйте позже или напишите организатору.');
      }
    } finally { spinner.classList.remove('is-loading'); }
  };
  const selectGuest = async (index) => {
    const selected = items[index];
    if (!selected) return;
    input.value = selected.displayName;
    closeSuggestions();
    if (seatController) seatController.abort();
    seatController = new AbortController();
    setStatus('Загружаем ваше место…');
    try {
      const data = await apiRequest('getSeat', { guestId: selected.guestId }, seatController);
      if (!data?.ok || !data.guest?.tableId) throw new Error(data?.code || 'GUEST_NOT_FOUND');
      const guest = data.guest;
      showResult(guest.displayName, guest.seatId ? `Стол: ${guest.tableId}. Место: ${guest.seatId}.` : `Ваш стол: ${guest.tableId}. Точное место будет указано позднее.`);
      selectTableOnMap(guest.tableId, guest.seatId);
      prepareTableActions(guest.tableId);
      setStatus('Место найдено.');
      app.querySelector('.seating-map-wrap').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('Не удалось найти место. Проверьте имя или напишите организатору.');
    }
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(searchGuests, 350); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!items.length) return;
      event.preventDefault();
      activeIndex = event.key === 'ArrowDown' ? (activeIndex + 1) % items.length : (activeIndex - 1 + items.length) % items.length;
      renderSuggestions();
    } else if (event.key === 'Enter' && activeIndex >= 0) { event.preventDefault(); selectGuest(activeIndex); }
    else if (event.key === 'Escape') closeSuggestions();
  });
  input.addEventListener('blur', () => setTimeout(closeSuggestions, 150));
  guestsButton.addEventListener('click', async () => {
    if (!selectedTableId) return;
    if (tableController) tableController.abort();
    tableController = new AbortController();
    guestsButton.disabled = true;
    guestsButton.textContent = 'Загружаем гостей…';
    try {
      const data = await apiRequest('getGuestsByTable', { tableId: selectedTableId }, tableController);
      if (!data?.ok || !Array.isArray(data.items)) throw new Error(data?.code || 'TEMPORARY_ERROR');
      const list = document.createElement('ul');
      list.className = 'seating-guests-list';
      data.items.forEach((guest) => {
        const item = document.createElement('li');
        item.textContent = guest.seatId ? `${guest.displayName} — ${guest.seatId}` : guest.displayName;
        list.append(item);
      });
      tableGuests.replaceChildren(list);
      tableGuests.hidden = false;
      setStatus(data.items.length ? `Гости за столом ${selectedTableId} показаны.` : `За столом ${selectedTableId} пока нет назначенных гостей.`);
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('Не удалось загрузить гостей за этим столом. Попробуйте позже.');
    } finally {
      guestsButton.disabled = false;
      guestsButton.textContent = `Показать гостей за столом ${selectedTableId}`;
    }
  });
  // "Показать весь зал" changes only the scale: the selected guest stays visible.
  resetButton.addEventListener('click', () => { map.showFullLayout(); setStatus('Показан весь зал; ваше место выделено.'); });
}
