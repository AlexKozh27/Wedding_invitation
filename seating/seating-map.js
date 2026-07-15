import { seatingLayout } from './layout-config.js';

const NS = 'http://www.w3.org/2000/svg';
const svgElement = (name, attributes = {}) => {
  const node = document.createElementNS(NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
};

const appendMapDecor = (svg, layout) => {
  const defs = svgElement('defs');
  const tableGradient = svgElement('linearGradient', { id: 'seating-table-fill', x1: '0', y1: '0', x2: '1', y2: '1' });
  tableGradient.append(svgElement('stop', { offset: '0%', 'stop-color': '#f5dfd1' }));
  tableGradient.append(svgElement('stop', { offset: '100%', 'stop-color': '#ddb39f' }));
  const floorGradient = svgElement('linearGradient', { id: 'seating-floor-fill', x1: '0', y1: '0', x2: '1', y2: '1' });
  floorGradient.append(svgElement('stop', { offset: '0%', 'stop-color': '#fffdf9' }));
  floorGradient.append(svgElement('stop', { offset: '48%', 'stop-color': '#f8e9e3' }));
  floorGradient.append(svgElement('stop', { offset: '100%', 'stop-color': '#e8dce7' }));
  const glowGradient = svgElement('radialGradient', { id: 'seating-floor-glow', cx: '22%', cy: '14%', r: '76%' });
  glowGradient.append(svgElement('stop', { offset: '0%', 'stop-color': '#fff', 'stop-opacity': '.86' }));
  glowGradient.append(svgElement('stop', { offset: '100%', 'stop-color': '#fff', 'stop-opacity': '0' }));
  defs.append(tableGradient, floorGradient, glowGradient);
  svg.append(defs);
  svg.append(svgElement('rect', { class: 'seating-floor', x: 18, y: 18, width: layout.viewBox.width - 36, height: layout.viewBox.height - 36, rx: 42 }));
  svg.append(svgElement('rect', { class: 'seating-floor-glow', x: 18, y: 18, width: layout.viewBox.width - 36, height: layout.viewBox.height - 36, rx: 42 }));
};

const seatBackAttributes = (seat) => {
  const common = { class: 'seating-seat-back' };
  if (seat.side === 'top') return { ...common, x: seat.x - 16, y: seat.y - 18, width: 32, height: 5 };
  if (seat.side === 'bottom') return { ...common, x: seat.x - 16, y: seat.y + 13, width: 32, height: 5 };
  if (seat.side === 'left') return { ...common, x: seat.x - 18, y: seat.y - 16, width: 5, height: 32 };
  return { ...common, x: seat.x + 13, y: seat.y - 16, width: 5, height: 32 };
};

export function validateLayout(layout) {
  const errors = [];
  if (!layout?.viewBox || !Array.isArray(layout.tables)) return ['Layout requires viewBox and tables.'];
  const ids = new Set();
  const seats = new Set();
  const { width, height } = layout.viewBox;
  for (const table of layout.tables) {
    if (!table?.id || ids.has(table.id)) errors.push(`Duplicate or missing table ID: ${table?.id || '(missing)'}`);
    ids.add(table?.id);
    if (![table.x, table.y, table.width, table.height].every(Number.isFinite) || table.width <= 0 || table.height <= 0) {
      errors.push(`Invalid dimensions for ${table.id}.`);
      continue;
    }
    if (table.x < 0 || table.y < 0 || table.x + table.width > width || table.y + table.height > height) {
      errors.push(`Table ${table.id} lies outside viewBox.`);
    }
    for (const seat of table.seats || []) {
      if (!seat?.id || seats.has(seat.id)) errors.push(`Duplicate or missing seat ID: ${seat?.id || '(missing)'}`);
      seats.add(seat?.id);
      if (!Number.isFinite(seat.x) || !Number.isFinite(seat.y) || seat.x < 0 || seat.y < 0 || seat.x > width || seat.y > height) {
        errors.push(`Seat ${seat?.id || '(missing)'} lies outside viewBox.`);
      }
    }
  }
  return errors;
}

export function createSeatingMap(container, layout = seatingLayout, { onTableClick, onSeatClick } = {}) {
  const errors = validateLayout(layout);
  if (errors.length) throw new Error(`Invalid seating layout: ${errors.join(' ')}`);
  const fullViewBox = `0 0 ${layout.viewBox.width} ${layout.viewBox.height}`;
  const svg = svgElement('svg', { class: 'seating-svg', viewBox: fullViewBox, role: 'img', 'aria-label': 'Схема столов' });
  const title = svgElement('title');
  title.textContent = 'Схема рассадки';
  svg.append(title);
  appendMapDecor(svg, layout);

  for (const table of layout.tables) {
    const group = svgElement('g', { class: 'seating-table-group', 'data-table-id': table.id, role: 'button', tabindex: '0', 'aria-label': `Стол ${table.id}. Нажмите, чтобы приблизить.` });
    group.append(svgElement('rect', { class: 'seating-table', x: table.x, y: table.y, width: table.width, height: table.height }));
    group.append(svgElement('rect', { class: 'seating-table-inset', x: table.x + 10, y: table.y + 10, width: table.width - 20, height: table.height - 20 }));
    const label = svgElement('text', { class: 'seating-table-label', x: table.x + table.width / 2, y: table.y + table.height / 2 + 7, 'text-anchor': 'middle' });
    label.textContent = table.id;
    group.append(label);
    for (const seat of table.seats || []) {
      const seatGroup = svgElement('g', { class: `seating-seat-group${seat.kind === 'newlyweds' ? ' is-newlyweds' : ''}`, 'data-seat-id': seat.id, 'data-table-id': table.id, role: 'button', tabindex: '0', 'aria-label': seat.label || `Место ${seat.id}. Нажмите, чтобы узнать гостя.` });
      seatGroup.append(svgElement('rect', { class: 'seating-seat', x: seat.x - 13, y: seat.y - 13, width: 26, height: 26, rx: 4 }));
      seatGroup.append(svgElement('rect', seatBackAttributes(seat)));
      const seatTitle = svgElement('title');
      seatTitle.textContent = seat.label || `Место ${seat.id}`;
      seatGroup.append(seatTitle);
      if (seat.kind === 'newlyweds') {
        const marker = svgElement('text', { class: 'seating-newlyweds-marker', x: seat.x, y: seat.y + 7, 'text-anchor': 'middle', 'aria-hidden': 'true' });
        marker.textContent = '♥';
        seatGroup.append(marker);
      }
      const activateSeat = () => onSeatClick?.({ tableId: table.id, seatId: seat.id, kind: seat.kind, label: seat.label });
      seatGroup.addEventListener('click', (event) => { event.stopPropagation(); activateSeat(); });
      seatGroup.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateSeat(); } });
      group.append(seatGroup);
    }
    const activateTable = () => onTableClick?.({ tableId: table.id });
    group.addEventListener('click', activateTable);
    group.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateTable(); } });
    svg.append(group);
  }
  container.replaceChildren(svg);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let viewBoxAnimation;
  const readViewBox = () => svg.getAttribute('viewBox').split(/\s+/).map(Number);
  const setViewBox = (box) => svg.setAttribute('viewBox', box.join(' '));
  function animateViewBox(next) {
    if (viewBoxAnimation) cancelAnimationFrame(viewBoxAnimation);
    if (prefersReducedMotion.matches) return setViewBox(next);
    const start = readViewBox();
    const startedAt = performance.now();
    const duration = 520;
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setViewBox(start.map((value, index) => value + (next[index] - value) * eased));
      if (progress < 1) viewBoxAnimation = requestAnimationFrame(step);
    };
    viewBoxAnimation = requestAnimationFrame(step);
  }
  function showFullLayout() {
    animateViewBox(fullViewBox.split(' ').map(Number));
  }
  function resetMap() {
    showFullLayout();
    svg.classList.remove('has-selection');
    svg.querySelectorAll('.is-selected, .is-selected-seat').forEach((node) => node.classList.remove('is-selected', 'is-selected-seat'));
  }
  function highlightSelection(tableId, seatId) {
    resetMap();
    const table = svg.querySelector(`[data-table-id="${CSS.escape(tableId)}"]`);
    if (!table) return false;
    svg.classList.add('has-selection');
    table.classList.add('is-selected');
    if (seatId) {
      const seat = svg.querySelector(`[data-seat-id="${CSS.escape(seatId)}"]`);
      if (seat) seat.classList.add('is-selected-seat');
    }
    return true;
  }
  function focusSelection(tableId, seatId) {
    const target = seatId ? svg.querySelector(`[data-seat-id="${CSS.escape(seatId)}"]`) : svg.querySelector(`[data-table-id="${CSS.escape(tableId)}"]`);
    const box = target?.getBBox();
    if (!box) return false;
    const pad = seatId ? 120 : 90;
    const next = [Math.max(0, box.x - pad), Math.max(0, box.y - pad), Math.min(layout.viewBox.width, box.width + pad * 2), Math.min(layout.viewBox.height, box.height + pad * 2)];
    animateViewBox(next);
    return true;
  }
  return { resetMap, showFullLayout, highlightSelection, focusSelection };
}
