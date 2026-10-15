import * as THREE from "three";

// Generate smooth Lathe points for Staunton piece silhouettes
export function createPawnGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.35, 0));
  points.push(new THREE.Vector2(0.35, 0.04));
  points.push(new THREE.Vector2(0.31, 0.07));
  points.push(new THREE.Vector2(0.28, 0.11));
  points.push(new THREE.Vector2(0.22, 0.15));
  points.push(new THREE.Vector2(0.24, 0.17));
  // Stem
  points.push(new THREE.Vector2(0.18, 0.21));
  points.push(new THREE.Vector2(0.13, 0.36));
  points.push(new THREE.Vector2(0.12, 0.46));
  // Collar
  points.push(new THREE.Vector2(0.20, 0.50));
  points.push(new THREE.Vector2(0.19, 0.53));
  points.push(new THREE.Vector2(0.11, 0.55));
  // Neck
  points.push(new THREE.Vector2(0.10, 0.60));
  // Spherical head
  const headCenterY = 0.72;
  const headRadius = 0.15;
  for (let i = 0; i <= 10; i++) {
    const angle = -Math.PI / 2 + (i / 10) * Math.PI;
    const x = Math.cos(angle) * headRadius;
    const y = headCenterY + Math.sin(angle) * headRadius;
    if (x >= 0) points.push(new THREE.Vector2(x, y));
  }
  points.push(new THREE.Vector2(0, headCenterY + headRadius));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

export function createRookGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.36, 0));
  points.push(new THREE.Vector2(0.36, 0.05));
  points.push(new THREE.Vector2(0.32, 0.08));
  points.push(new THREE.Vector2(0.29, 0.13));
  points.push(new THREE.Vector2(0.24, 0.17));
  // Tower waist & shaft
  points.push(new THREE.Vector2(0.20, 0.22));
  points.push(new THREE.Vector2(0.19, 0.45));
  points.push(new THREE.Vector2(0.18, 0.62));
  // Tower collar
  points.push(new THREE.Vector2(0.26, 0.68));
  points.push(new THREE.Vector2(0.26, 0.72));
  // Turret outer wall
  points.push(new THREE.Vector2(0.27, 0.76));
  points.push(new THREE.Vector2(0.27, 0.95));
  // Turret rim & inner recess
  points.push(new THREE.Vector2(0.21, 0.95));
  points.push(new THREE.Vector2(0.20, 0.82));
  points.push(new THREE.Vector2(0, 0.82));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

export function createBishopGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.36, 0));
  points.push(new THREE.Vector2(0.36, 0.05));
  points.push(new THREE.Vector2(0.32, 0.08));
  points.push(new THREE.Vector2(0.28, 0.13));
  points.push(new THREE.Vector2(0.23, 0.18));
  // Shaft
  points.push(new THREE.Vector2(0.18, 0.24));
  points.push(new THREE.Vector2(0.13, 0.50));
  points.push(new THREE.Vector2(0.12, 0.68));
  // Mitre collar
  points.push(new THREE.Vector2(0.21, 0.72));
  points.push(new THREE.Vector2(0.21, 0.76));
  points.push(new THREE.Vector2(0.13, 0.78));
  // Mitre dome
  points.push(new THREE.Vector2(0.19, 0.84));
  points.push(new THREE.Vector2(0.21, 0.94));
  points.push(new THREE.Vector2(0.18, 1.08));
  points.push(new THREE.Vector2(0.10, 1.18));
  // Finial ball
  points.push(new THREE.Vector2(0.04, 1.20));
  points.push(new THREE.Vector2(0.07, 1.23));
  points.push(new THREE.Vector2(0.06, 1.27));
  points.push(new THREE.Vector2(0, 1.29));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}

export function createQueenGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.38, 0));
  points.push(new THREE.Vector2(0.38, 0.06));
  points.push(new THREE.Vector2(0.33, 0.09));
  points.push(new THREE.Vector2(0.30, 0.15));
  points.push(new THREE.Vector2(0.24, 0.20));
  // Stem
  points.push(new THREE.Vector2(0.19, 0.28));
  points.push(new THREE.Vector2(0.14, 0.60));
  points.push(new THREE.Vector2(0.13, 0.82));
  // Lower collar
  points.push(new THREE.Vector2(0.22, 0.86));
  points.push(new THREE.Vector2(0.21, 0.90));
  points.push(new THREE.Vector2(0.14, 0.92));
  // Flared Coronet crown
  points.push(new THREE.Vector2(0.19, 1.02));
  points.push(new THREE.Vector2(0.25, 1.20));
  points.push(new THREE.Vector2(0.29, 1.34));
  points.push(new THREE.Vector2(0.25, 1.36));
  points.push(new THREE.Vector2(0.15, 1.32));
  // Central pearl
  points.push(new THREE.Vector2(0.07, 1.36));
  points.push(new THREE.Vector2(0.08, 1.42));
  points.push(new THREE.Vector2(0, 1.45));

  const geo = new THREE.LatheGeometry(points, 36);
  geo.computeVertexNormals();
  return geo;
}

export function createKingGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.40, 0));
  points.push(new THREE.Vector2(0.40, 0.06));
  points.push(new THREE.Vector2(0.35, 0.10));
  points.push(new THREE.Vector2(0.32, 0.16));
  points.push(new THREE.Vector2(0.26, 0.22));
  // Stem
  points.push(new THREE.Vector2(0.21, 0.30));
  points.push(new THREE.Vector2(0.15, 0.70));
  points.push(new THREE.Vector2(0.14, 0.95));
  // Dual imperial collars
  points.push(new THREE.Vector2(0.24, 0.98));
  points.push(new THREE.Vector2(0.22, 1.03));
  points.push(new THREE.Vector2(0.15, 1.05));
  // Stepped dome
  points.push(new THREE.Vector2(0.22, 1.15));
  points.push(new THREE.Vector2(0.24, 1.28));
  points.push(new THREE.Vector2(0.23, 1.38));
  points.push(new THREE.Vector2(0.16, 1.45));
  points.push(new THREE.Vector2(0.10, 1.47));
  points.push(new THREE.Vector2(0.08, 1.50));
  points.push(new THREE.Vector2(0, 1.50));

  const geo = new THREE.LatheGeometry(points, 36);
  geo.computeVertexNormals();
  return geo;
}

// Knight Base lathe
export function createKnightBaseGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.36, 0));
  points.push(new THREE.Vector2(0.36, 0.05));
  points.push(new THREE.Vector2(0.32, 0.08));
  points.push(new THREE.Vector2(0.29, 0.13));
  points.push(new THREE.Vector2(0.25, 0.18));
  points.push(new THREE.Vector2(0.20, 0.24));
  points.push(new THREE.Vector2(0.22, 0.28));
  points.push(new THREE.Vector2(0, 0.28));

  const geo = new THREE.LatheGeometry(points, 32);
  geo.computeVertexNormals();
  return geo;
}
