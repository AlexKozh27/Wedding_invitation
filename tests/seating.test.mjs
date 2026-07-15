import assert from 'node:assert/strict';
import { normalizeSearch } from '../seating/seating-ui.js';
import { validateLayout } from '../seating/seating-map.js';
import { seatingLayout } from '../seating/layout-config.js';

assert.equal(normalizeSearch('  Ёлкина,  Анна! '), 'елкина анна');
assert.equal(normalizeSearch('Иванов---Пётр'), 'иванов---петр');
assert.equal(normalizeSearch('  ALEXEY   Иванов  '), 'alexey иванов');
assert.deepEqual(validateLayout(seatingLayout), []);
assert.equal(seatingLayout.tables.reduce((total, table) => total + table.seats.length, 0), 39);
assert.deepEqual(seatingLayout.tables.map((table) => table.seats.length), [11, 10, 7, 11]);
assert.match(validateLayout({ viewBox: { width: 100, height: 100 }, tables: [{ id: 'T1', x: 90, y: 0, width: 20, height: 20 }] }).join(' '), /outside viewBox/);
assert.match(validateLayout({ viewBox: { width: 100, height: 100 }, tables: [{ id: 'T1', x: 0, y: 0, width: 20, height: 20 }, { id: 'T1', x: 30, y: 0, width: 20, height: 20 }] }).join(' '), /Duplicate/);
console.log('Seating tests passed.');
