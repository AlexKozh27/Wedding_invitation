/**
 * Public geometry only. Do not put guest names or assignments in this file.
 *
 * To move a table, edit x/y/width/height. Keep table IDs stable: they are the
 * values stored in the private Seating sheet. Seat IDs are likewise stable;
 * move a seat's coordinates without renaming it when the physical chair moves.
 */
const createSideSeats = (tableId, x, y, width, height) => {
  const positions = [
    [x + width * 0.22, y - 28], [x + width * 0.5, y - 28], [x + width * 0.78, y - 28],
    [x + width * 0.22, y + height + 28], [x + width * 0.5, y + height + 28], [x + width * 0.78, y + height + 28]
  ];
  return positions.map(([seatX, seatY], index) => ({
    id: `${tableId}-S-${String(index + 1).padStart(2, '0')}`,
    x: seatX,
    y: seatY
  }));
};

const table = (id, x, y, width, height) => ({
  id, x, y, width, height,
  // Explicit, stable seat IDs are ready for the later exact-seat stage.
  seats: createSideSeats(id, x, y, width, height)
});

export const seatingLayout = {
  version: '2026-07-15-1',
  viewBox: { width: 1200, height: 900 },
  // Decorative public landmarks make the plan feel like a room, not a diagram.
  // They are independent from guest data and may be moved/renamed freely.
  landmarks: [
    { id: 'dance-floor', label: 'Танцпол', x: 120, y: 130, width: 420, height: 280, kind: 'dance-floor' },
    { id: 'bar', label: 'Бар', x: 910, y: 90, width: 190, height: 105, kind: 'bar' },
    { id: 'entrance', label: 'Вход', x: 105, y: 760, width: 230, height: 72, kind: 'entrance' }
  ],
  tables: [
    // T1 + T2 form the horizontal lower bar of the L.
    table('T1', 100, 560, 320, 100),
    table('T2', 420, 560, 320, 100),
    // T3 is to the right of T2 and continues the construction upward; T4 continues T3.
    table('T3', 740, 300, 100, 260),
    table('T4', 740, 40, 100, 260)
  ]
};
