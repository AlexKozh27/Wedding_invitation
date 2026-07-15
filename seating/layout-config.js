/**
 * Public room geometry only. Never add the guest list here.
 *
 * `id` values are the stable IDs used in the private Seating sheet. Move a
 * table or chair by changing only x/y; do not rename its ID after assigning it.
 * The two `newlyweds` places are intentionally public markers, not guest data.
 */
const seat = (id, x, y, extra = {}) => ({ id, x, y, ...extra });

const horizontalSeats = (tableId, x, y, width, height, { top = 0, bottom = 0, left = 0, right = 0, ranges = {}, newlyweds = {} } = {}) => {
  const positions = (count, start, end) => count === 1 ? [(start + end) / 2] : Array.from({ length: count }, (_, index) => start + (end - start) * index / (count - 1));
  const line = (count, axis, offset) => {
    const base = seats.length;
    const side = axis === 'x' && offset < 0 ? 'top' : axis === 'x' ? 'bottom' : offset < 0 ? 'left' : 'right';
    const range = ranges[side] || {};
    const start = axis === 'x' ? x + (range.start ?? 20) : y + (range.start ?? 20);
    const end = axis === 'x' ? x + (range.end ?? width - 20) : y + (range.end ?? height - 20);
    return positions(count, start, end).map((coordinate, index) => {
    const position = axis === 'x' ? [coordinate, y + offset] : [x + offset, coordinate];
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

const verticalSeats = (tableId, x, y, width, height, { top = 0, bottom = 0, left = 0, right = 0, ranges = {} } = {}) =>
  horizontalSeats(tableId, x, y, width, height, { top, bottom, left, right, ranges });

const table = (id, x, y, width, height, seats) => ({ id, x, y, width, height, seats });

export const seatingLayout = {
  version: '2026-07-15-2',
  viewBox: { width: 1200, height: 1000 },
  tables: [
    // Two joined horizontal segments. The inside edge has no chairs.
    table('T1', 100, 680, 300, 110, horizontalSeats('T1', 100, 680, 300, 110, {
      top: 5, bottom: 5, left: 1,
      // The last lower chair is one of the two places for the newlyweds.
      newlyweds: { 10: 'Место молодожёнов' }
    })),
    table('T2', 400, 680, 340, 110, horizontalSeats('T2', 400, 680, 340, 110, {
      // Top chairs stop before the vertical T3 segment begins.
      top: 3, bottom: 5, right: 2,
      ranges: {
        // Three places stay together at the left, before the T3 segment.
        top: { start: 20, end: 105 },
        // The two outer places are centred rather than pinned to the ends.
        right: { start: 35, end: 75 }
      },
      // The first lower chair forms a pair with T1-S-10 at the joint.
      newlyweds: { 4: 'Место молодожёнов' }
    })),
    // T3 is the lower vertical segment. Its entire short edge touches the top
    // edge of T2; T4 continues it upward. Their shared seam has no chairs.
    table('T3', 630, 435, 110, 245, verticalSeats('T3', 630, 435, 110, 245, {
      // The three left-hand places are deliberately grouped near the upper join.
      left: 3, right: 4, ranges: { left: { start: 28, end: 105 } }
    })),
    table('T4', 630, 190, 110, 245, verticalSeats('T4', 630, 190, 110, 245, { top: 1, left: 5, right: 5 }))
  ]
};
