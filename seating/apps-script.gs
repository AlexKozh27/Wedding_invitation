// Paste this file into a separate Google Apps Script project. Keep the Sheet private.
const CONFIG = { sheetName: 'Seating', minQueryLength: 3, maxResults: 5, cacheSeconds: 300 };
function doGet(e) {
  const action = String(e && e.parameter && e.parameter.action || '');
  if (action === 'searchGuests') return json_(searchGuests_(e.parameter.q));
  if (action === 'getSeat') return json_(getSeat_(e.parameter.guestId));
  if (action === 'getGuestsByTable') return json_(getGuestsByTable_(e.parameter.tableId));
  if (action === 'getGuestBySeat') return json_(getGuestBySeat_(e.parameter.seatId));
  return json_({ ok: false, code: 'BAD_REQUEST' });
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
// Run this manually from the Apps Script editor immediately after changing seats.
// It is not exposed through the public Web App.
function clearSeatingCache() { CacheService.getScriptCache().remove('seating-guests'); }
function normalizeSearch_(value) { return String(value || '').toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z0-9\s-]/gi, ' ').replace(/\s+/g, ' ').trim(); }
function guests_() {
  const cache = CacheService.getScriptCache(), cached = cache.get('seating-guests');
  if (cached) return JSON.parse(cached);
  const id = PropertiesService.getScriptProperties().getProperty('SEATING_SPREADSHEET_ID');
  if (!id) throw new Error('SEATING_SPREADSHEET_ID is missing');
  const rows = SpreadsheetApp.openById(id).getSheetByName(CONFIG.sheetName).getDataRange().getDisplayValues();
  const headers = rows.shift().map(h => h.trim());
  const guests = rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i].trim()]))).filter(g => g.active.toUpperCase() === 'TRUE');
  cache.put('seating-guests', JSON.stringify(guests), CONFIG.cacheSeconds);
  return guests;
}
function searchGuests_(query) {
  const q = normalizeSearch_(query); if (q.length < CONFIG.minQueryLength) return { ok: true, items: [] };
  try {
    const items = guests_().filter(g => normalizeSearch_([g.surname, g.first_name, g.display_name, g.search_key].join(' ')).includes(q)).slice(0, CONFIG.maxResults)
      .map(g => ({ guestId: g.guest_id, displayName: g.display_name, hint: g.public_hint || '' }));
    return { ok: true, items };
  } catch (error) { console.error(error); return { ok: false, code: 'TEMPORARY_ERROR' }; }
}
function getSeat_(guestId) {
  try {
    const guest = guests_().find(g => g.guest_id === String(guestId || ''));
    return guest ? { ok: true, guest: { displayName: guest.display_name, tableId: guest.table_id, seatId: guest.seat_id || null } } : { ok: false, code: 'GUEST_NOT_FOUND' };
  } catch (error) { console.error(error); return { ok: false, code: 'TEMPORARY_ERROR' }; }
}
// These two actions intentionally make the seating visible on the public map.
// Return only name + public placement; never add contact details or internal fields.
function getGuestsByTable_(tableId) {
  const id = String(tableId || '').trim();
  if (!/^T[1-4]$/.test(id)) return { ok: false, code: 'BAD_REQUEST' };
  try {
    const items = guests_().filter(g => g.table_id === id)
      .sort((a, b) => String(a.seat_id).localeCompare(String(b.seat_id)))
      .map(g => ({ displayName: g.display_name, seatId: g.seat_id || null }));
    return { ok: true, items };
  } catch (error) { console.error(error); return { ok: false, code: 'TEMPORARY_ERROR' }; }
}
function getGuestBySeat_(seatId) {
  const id = String(seatId || '').trim();
  if (!/^S-(?:0[1-9]|[12]\d|3[0-9])$/.test(id)) return { ok: false, code: 'BAD_REQUEST' };
  try {
    const guest = guests_().find(g => g.seat_id === id);
    return guest ? { ok: true, guest: { displayName: guest.display_name, tableId: guest.table_id, seatId: guest.seat_id } } : { ok: false, code: 'GUEST_NOT_FOUND' };
  } catch (error) { console.error(error); return { ok: false, code: 'TEMPORARY_ERROR' }; }
}
