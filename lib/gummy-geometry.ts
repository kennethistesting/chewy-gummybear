import { BufferGeometry, Float32BufferAttribute } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// MarchingCubes returns independent triangles in an oversized buffer. Trim the
// active triangles and weld positions so normal recomputation stays smooth.
export function smoothGummyGeometry(source: BufferGeometry) {
  const trimmed = new BufferGeometry();
  const positions = source.getAttribute('position');
  const count = Math.min(source.drawRange.count, positions.count);
  trimmed.setAttribute('position', new Float32BufferAttribute(
    Array.from(positions.array).slice(0, count * 3), 3,
  ));
  const welded = mergeVertices(trimmed, 1e-5);
  trimmed.dispose();
  welded.computeVertexNormals();
  return welded;
}
