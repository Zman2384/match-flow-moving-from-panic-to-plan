/**
 * Turns a GPS position into the nearest US ZIP code entirely on the device.
 *
 * The centroid table is loaded only when someone taps "Use current location", and the
 * coordinates are never stored or sent anywhere: only the resulting ZIP is used,
 * in links the user chooses to open.
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

let table: { zips: Int32Array; lats: Int16Array; lngs: Int16Array } | null = null;

async function loadTable() {
  if (table) return table;
  const { ZIP_CENTROIDS } = await import('@/lib/data/zipCentroids');
  const rows = ZIP_CENTROIDS.split(';');
  const zips = new Int32Array(rows.length);
  const lats = new Int16Array(rows.length);
  const lngs = new Int16Array(rows.length);
  let z = 0;
  let a = 0;
  let o = 0;
  rows.forEach((row, i) => {
    const [dz, da, dO] = row.split(',');
    z += parseInt(dz, 36);
    a += parseInt(da, 36);
    o += parseInt(dO, 36);
    zips[i] = z;
    lats[i] = a;
    lngs[i] = o;
  });
  table = { zips, lats, lngs };
  return table;
}

/** Farther than this from every ZIP centroid means "not in the US". */
const MAX_MILES = 60;

/** Nearest ZIP (5 digits) to a coordinate, or null outside the US. */
export async function nearestZip({ latitude, longitude }: Coordinate): Promise<string | null> {
  const { zips, lats, lngs } = await loadTable();
  const lat = latitude * 100;
  const lng = longitude * 100;
  const cosLat = Math.cos((latitude * Math.PI) / 180);
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < zips.length; i += 1) {
    const dy = lats[i] - lat;
    const dx = (lngs[i] - lng) * cosLat;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  // Hundredths of a degree → miles (1° latitude ≈ 69 miles).
  const miles = (Math.sqrt(bestD) / 100) * 69;
  if (best < 0 || miles > MAX_MILES) return null;
  return String(zips[best]).padStart(5, '0');
}
