import test from 'node:test';
import assert from 'node:assert/strict';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { smoothGummyGeometry } from '../lib/gummy-geometry.ts';

test('welds shared triangle corners and excludes inactive marching-cubes capacity', () => {
  const input = new BufferGeometry();
  input.setAttribute('position', new Float32BufferAttribute([
    0,0,0, 1,0,0, 0,1,0,
    1,0,0, 1,1,1, 0,1,0,
    100,100,100, 100,100,100, 100,100,100,
  ], 3));
  input.setDrawRange(0,6);
  const mesh = smoothGummyGeometry(input);
  assert.equal(mesh.index.count,6);
  assert.equal(mesh.getAttribute('position').count,4);
  assert.equal(mesh.index.getX(1),mesh.index.getX(3));
  assert.equal(mesh.index.getX(2),mesh.index.getX(5));
  // A shared corner averages its two faces, rather than acquiring a separate
  // flat normal for each face on the first stretch.
  const normals = mesh.getAttribute('normal');
  const shared = mesh.index.getX(1);
  assert.ok(normals.getX(shared)<0 && normals.getY(shared)<0 && normals.getZ(shared)>0);
  mesh.getAttribute('position').setZ(3,2);
  mesh.computeVertexNormals();
  for(let i=0;i<normals.count;i++) {
    assert.ok(Math.abs(Math.hypot(normals.getX(i),normals.getY(i),normals.getZ(i))-1)<1e-6);
  }
  mesh.computeBoundingSphere();
  assert.ok(mesh.boundingSphere.radius<3);
  mesh.dispose();input.dispose();
});
