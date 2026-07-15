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
  viewBox: { width: 1200, height: 1320 },
  tables: [
    // T1 + T2 form the horizontal lower bar of the L.
    table('T1', 100, 560, 320, 100),
    table('T2', 420, 560, 320, 100),
    // T3 + T4 continue down from the right end of T2, with a clear walkway gap.
    // Together the four segments form an inverted Russian "Г" shape.
    table('T3', 740, 700, 100, 260),
    table('T4', 740, 960, 100, 260)
  ]
};
