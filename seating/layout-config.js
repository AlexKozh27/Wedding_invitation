/**
 * Public room geometry only. Never add the guest list here.
 *
 * `id` values are the stable IDs used in the private Seating sheet. Move a
 * table or chair by changing only x/y; do not rename its ID after assigning it.
 * The two `newlyweds` places are intentionally public markers, not guest data.
 */
const seat = (id, x, y, extra = {}) => ({ id, x, y, ...extra });

const horizontalSeats = (tableId, x, y, width, height, { top = 0, bottom = 0, left = 0, right = 0, newlyweds = {} } = {}) => {
  const line = (count, axis, offset) => {
    const base = seats.length;
    return Array.from({ length: count }, (_, index) => {
    const progress = (index + 1) / (count + 1);
    const position = axis === 'x' ? [x + width * progress, y + offset] : [x + offset, y + height * progress];
    const number = base + index + 1;
    return seat(`${tableId}-S-${String(number).padStart(2, '0')}`, ...position, newlyweds[number] ? { kind: 'newlyweds', label: newlyweds[number] } : {});
    });
  };
  const seats = [];
  seats.push(...line(top, 'x', -32));
  seats.push(...line(bottom, 'x', height + 32));
  seats.push(...line(left, 'y', -32));
  seats.push(...line(right, 'y', width + 32));
  return seats;
};

const verticalSeats = (tableId, x, y, width, height, { top = 0, bottom = 0, left = 0, right = 0 } = {}) =>
  horizontalSeats(tableId, x, y, width, height, { top, bottom, left, right });

const table = (id, x, y, width, height, seats) => ({ id, x, y, width, height, seats });

export const seatingLayout = {
  version: '2026-07-15-2',
  viewBox: { width: 1200, height: 1000 },
  tables: [
    // Two joined horizontal segments. The inside edge has no chairs.
    table('T1', 100, 680, 300, 110, horizontalSeats('T1', 100, 680, 300, 110, {
      top: 8, bottom: 8, left: 2,
      // The last lower chair is one of the two places for the newlyweds.
      newlyweds: { 16: 'Место молодожёнов' }
    })),
    table('T2', 400, 680, 340, 110, horizontalSeats('T2', 400, 680, 340, 110, {
      top: 9, bottom: 9, right: 2,
      // The first lower chair forms a pair with T1-S-16 at the joint.
      newlyweds: { 10: 'Место молодожёнов' }
    })),
    // T3 is the lower vertical segment. Its entire short edge touches the top
    // edge of T2; T4 continues it upward. Their shared seam has no chairs.
    table('T3', 630, 435, 110, 245, verticalSeats('T3', 630, 435, 110, 245, { left: 7, right: 7 })),
    table('T4', 630, 190, 110, 245, verticalSeats('T4', 630, 190, 110, 245, { top: 1, left: 7, right: 7 }))
  ]
};
