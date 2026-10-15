import * as THREE from "three";

// 1. KING: SWAYAMBHU / BOUDHANATH MAHACHAITYA & PAGODA SPIRE
// Stepped plinth, hemispherical Anda dome, cubical Harmika, 13 enlightenment rings, Chhatra & Gajur
export function createStupaKingDomeGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Stepped octagonal plinth
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.42, 0));
  points.push(new THREE.Vector2(0.42, 0.06));
  points.push(new THREE.Vector2(0.38, 0.08));
  points.push(new THREE.Vector2(0.38, 0.14));
  points.push(new THREE.Vector2(0.34, 0.16));
  points.push(new THREE.Vector2(0.34, 0.22));

  // Hemispherical Anda (Stupa Dome)
  const domeRadius = 0.32;
  const domeCenterY = 0.22;
  for (let i = 0; i <= 12; i++) {
    const angle = (i / 12) * (Math.PI / 2);
    const x = Math.cos(angle) * domeRadius;
    const y = domeCenterY + Math.sin(angle) * (domeRadius * 0.85);
    points.push(new THREE.Vector2(x, y));
  }
  points.push(new THREE.Vector2(0, domeCenterY + domeRadius * 0.85));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

// 13 Spire Rings (Trayodasa Bhuvana) for King
export function createStupaSpireGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Stepped ascending rings
  const startY = 0;
  const numRings = 13;
  let currY = startY;
  let currR = 0.22;

  points.push(new THREE.Vector2(0, currY));
  for (let i = 0; i < numRings; i++) {
    const ringR = currR * (1 - (i / numRings) * 0.65);
    const stepH = 0.038;
    points.push(new THREE.Vector2(ringR, currY));
    points.push(new THREE.Vector2(ringR, currY + stepH * 0.7));
    points.push(new THREE.Vector2(ringR * 0.92, currY + stepH));
    currY += stepH;
  }

  // Chhatra (Umbrella canopy)
  points.push(new THREE.Vector2(0.18, currY));
  points.push(new THREE.Vector2(0.18, currY + 0.04));
  points.push(new THREE.Vector2(0.06, currY + 0.08));

  // Gajur Pinnacle
  points.push(new THREE.Vector2(0.04, currY + 0.16));
  points.push(new THREE.Vector2(0.07, currY + 0.20));
  points.push(new THREE.Vector2(0.01, currY + 0.26));
  points.push(new THREE.Vector2(0, currY + 0.27));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

// 2. QUEEN: TALEJU BHAWANI / NYATAPOLA PAGODA TEMPLE
// Multi-tiered flared Newa pagoda roofs (Chhana) with upturned eaves and Gajur
export function createPagodaBaseGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Stepped temple plinth
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.40, 0));
  points.push(new THREE.Vector2(0.40, 0.06));
  points.push(new THREE.Vector2(0.36, 0.09));
  points.push(new THREE.Vector2(0.36, 0.15));
  points.push(new THREE.Vector2(0.30, 0.18));
  points.push(new THREE.Vector2(0.28, 0.35)); // Lower sanctum wall
  points.push(new THREE.Vector2(0, 0.35));

  const geo = new THREE.LatheGeometry(points, 28);
  geo.computeVertexNormals();
  return geo;
}

// Flared Pagoda Roof Tier
export function createPagodaRoofGeometry(radius: number, height: number): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(radius, 0));
  // Flared upturned eave
  points.push(new THREE.Vector2(radius * 1.05, height * 0.2));
  points.push(new THREE.Vector2(radius * 0.95, height * 0.3));
  // Slanted roof slope
  points.push(new THREE.Vector2(radius * 0.45, height * 0.85));
  points.push(new THREE.Vector2(radius * 0.35, height));
  points.push(new THREE.Vector2(0, height));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

// 3. BISHOP: PATAN KRISHNA MANDIR & CHAITYA (SHIKHAR STYLE)
// Fluted Shikhar stone tower with niche toranas and Amalaka ring
export function createShikharBishopGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Lotus pedestal base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.36, 0));
  points.push(new THREE.Vector2(0.36, 0.05));
  points.push(new THREE.Vector2(0.32, 0.08));
  points.push(new THREE.Vector2(0.34, 0.12)); // Lotus petal swell
  points.push(new THREE.Vector2(0.27, 0.16));
  points.push(new THREE.Vector2(0.25, 0.25));

  // Shikhar Curvilinear Stone Tower (Rekha Deula)
  const towerSteps = 16;
  for (let i = 0; i <= towerSteps; i++) {
    const t = i / towerSteps;
    const y = 0.25 + t * 0.75;
    // Parabolic curving taper
    const r = 0.25 * (1 - Math.pow(t, 1.8) * 0.65);
    points.push(new THREE.Vector2(r, y));
  }

  // Amalaka stone ring (flattened fluted disc)
  const amY = 1.0;
  points.push(new THREE.Vector2(0.16, amY));
  points.push(new THREE.Vector2(0.18, amY + 0.04));
  points.push(new THREE.Vector2(0.14, amY + 0.08));

  // Kalasha & Gajur Finial
  points.push(new THREE.Vector2(0.09, amY + 0.12));
  points.push(new THREE.Vector2(0.11, amY + 0.17));
  points.push(new THREE.Vector2(0.03, amY + 0.24));
  points.push(new THREE.Vector2(0, amY + 0.25));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

// 4. ROOK: KASTHAMANDAP TEMPLE PAVILION & MONASTERY WATCHTOWER
export function createPavilionBaseGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Heavy timber plinth
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.38, 0));
  points.push(new THREE.Vector2(0.38, 0.06));
  points.push(new THREE.Vector2(0.34, 0.09));
  points.push(new THREE.Vector2(0.34, 0.16));
  points.push(new THREE.Vector2(0.28, 0.20));
  points.push(new THREE.Vector2(0.26, 0.55)); // Lower fortress wall
  points.push(new THREE.Vector2(0.30, 0.60)); // Cornice
  points.push(new THREE.Vector2(0, 0.60));

  const geo = new THREE.LatheGeometry(points, 24);
  geo.computeVertexNormals();
  return geo;
}

// 5. PAWN: MINIATURE MANI CHAITYA & LOTUS STUPA
export function createMiniChaityaPawnGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Stepped lotus base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.33, 0));
  points.push(new THREE.Vector2(0.33, 0.04));
  points.push(new THREE.Vector2(0.28, 0.07));
  points.push(new THREE.Vector2(0.30, 0.10)); // Petal swell
  points.push(new THREE.Vector2(0.23, 0.14));

  // Hemispherical Stupa Dome
  const domeR = 0.20;
  const domeY = 0.14;
  for (let i = 0; i <= 8; i++) {
    const angle = (i / 8) * (Math.PI / 2);
    const x = Math.cos(angle) * domeR;
    const y = domeY + Math.sin(angle) * (domeR * 0.9);
    points.push(new THREE.Vector2(x, y));
  }

  // Mini Harmika block & Spire rings
  const spireY = domeY + domeR * 0.9;
  points.push(new THREE.Vector2(0.12, spireY));
  points.push(new THREE.Vector2(0.12, spireY + 0.05));

  // 5 Spire parasol rings
  let curY = spireY + 0.05;
  for (let i = 0; i < 5; i++) {
    const ringR = 0.12 * (1 - i * 0.15);
    points.push(new THREE.Vector2(ringR, curY));
    points.push(new THREE.Vector2(ringR, curY + 0.025));
    curY += 0.025;
  }

  // Sacred Jewel Pinnacle (Ratna/Mani)
  points.push(new THREE.Vector2(0.04, curY + 0.04));
  points.push(new THREE.Vector2(0.06, curY + 0.08));
  points.push(new THREE.Vector2(0, curY + 0.12));

  const geo = new THREE.LatheGeometry(points, 28);
  geo.computeVertexNormals();
  return geo;
}
