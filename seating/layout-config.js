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
    return seat(`${tableId}-S-${String(number).padStart(2, '0')}`, ...position, { side, ...(newlyweds[number] ? { kind: 'newlyweds', label: newlyweds[number] } : {}) });
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

// The physical clockwise order starts above T4 and follows the outer perimeter.
// Keeping seat IDs global makes the number written on a paper plan unambiguous.
const assignClockwiseSeatIds = (tables) => {
  const byTable = Object.fromEntries(tables.map((item) => [item.id, item]));
  const path = [
    ['T4', [0, 6, 7, 8, 9, 10]], // top, then right side down
    ['T3', [3, 4, 5, 6]],         // right side down
    ['T2', [8, 9, 7, 6, 5, 4, 3]], // right side, then bottom right-to-left
    ['T1', [9, 8, 7, 6, 5, 10, 0, 1, 2, 3, 4]], // bottom, left, then top left-to-right
    ['T2', [0, 1, 2]],            // top left-to-right
    ['T3', [2, 1, 0]],            // left side bottom-to-top
    ['T4', [5, 4, 3, 2, 1]]      // left side bottom-to-top
  ];
  let number = 1;
  path.forEach(([tableId, indexes]) => indexes.forEach((index) => {
    byTable[tableId].seats[index].id = `S-${String(number++).padStart(2, '0')}`;
  }));
  return tables;
};

export const seatingLayout = {
  version: '2026-07-15-3',
  viewBox: { width: 1200, height: 1000 },
  tables: assignClockwiseSeatIds([
    // Two joined horizontal segments. The inside edge has no chairs.
    table('T1', 100, 680, 300, 110, horizontalSeats('T1', 100, 680, 300, 110, {
      top: 5, bottom: 5, left: 1,
      // The last lower chair is one of the two places for the newlyweds.
      newlyweds: { 10: 'Место молодожёнов' }
    })),
    table('T2', 400, 680, 300, 110, horizontalSeats('T2', 400, 680, 300, 110, {
      // Top chairs stop before the vertical T3 segment begins.
      top: 3, bottom: 5, right: 2,
      ranges: {
        // Three places stay together at the left, before the T3 segment.
        top: { start: 20, end: 150 },
        // The two outer places are centred rather than pinned to the ends.
        right: { start: 35, end: 75 }
      },
      // The first lower chair forms a pair with T1's newlyweds place.
      newlyweds: { 4: 'Место молодожёнов' }
    })),
    // T3 is the lower vertical segment. Its entire short edge touches the top
    // edge of T2; T4 continues it upward. Their shared seam has no chairs.
    table('T3', 590, 435, 110, 245, verticalSeats('T3', 590, 435, 110, 245, {
      // The three left-hand places are deliberately grouped near the upper join.
      left: 3, right: 4, ranges: {
        left: { start: 28, end: 150 },
        right: { start: 36, end: 205 }
      }
    })),
    table('T4', 590, 190, 110, 245, verticalSeats('T4', 590, 190, 110, 245, { top: 1, left: 5, right: 5 }))
  ])
};
