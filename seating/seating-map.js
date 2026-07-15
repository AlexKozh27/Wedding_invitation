import { seatingLayout } from './layout-config.js';

const NS = 'http://www.w3.org/2000/svg';
const svgElement = (name, attributes = {}) => {
  const node = document.createElementNS(NS, name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
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

export function createSeatingMap(container, layout = seatingLayout) {
  const errors = validateLayout(layout);
  if (errors.length) throw new Error(`Invalid seating layout: ${errors.join(' ')}`);
  const fullViewBox = `0 0 ${layout.viewBox.width} ${layout.viewBox.height}`;
  const svg = svgElement('svg', { class: 'seating-svg', viewBox: fullViewBox, role: 'img', 'aria-label': 'Схема столов' });
  const title = svgElement('title');
  title.textContent = 'Схема рассадки';
  svg.append(title);

  for (const table of layout.tables) {
    const group = svgElement('g', { class: 'seating-table-group', 'data-table-id': table.id });
    group.append(svgElement('rect', { class: 'seating-table', x: table.x, y: table.y, width: table.width, height: table.height, rx: 18 }));
    const label = svgElement('text', { class: 'seating-table-label', x: table.x + table.width / 2, y: table.y + table.height / 2 + 7, 'text-anchor': 'middle' });
    label.textContent = table.id;
    group.append(label);
    for (const seat of table.seats || []) {
      const seatGroup = svgElement('g', { class: 'seating-seat-group', 'data-seat-id': seat.id, 'data-table-id': table.id });
      seatGroup.append(svgElement('circle', { class: 'seating-seat', cx: seat.x, cy: seat.y, r: 14 }));
      const seatTitle = svgElement('title');
      seatTitle.textContent = `Место ${seat.id}`;
      seatGroup.append(seatTitle);
      group.append(seatGroup);
    }
    svg.append(group);
  }
  container.replaceChildren(svg);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function resetMap() {
    svg.setAttribute('viewBox', fullViewBox);
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
    const next = `${Math.max(0, box.x - pad)} ${Math.max(0, box.y - pad)} ${Math.min(layout.viewBox.width, box.width + pad * 2)} ${Math.min(layout.viewBox.height, box.height + pad * 2)}`;
    if (!prefersReducedMotion.matches) svg.style.transition = 'viewBox 360ms ease';
    svg.setAttribute('viewBox', next);
    return true;
  }
  return { resetMap, highlightSelection, focusSelection };
}
