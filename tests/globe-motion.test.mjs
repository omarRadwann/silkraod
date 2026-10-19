import test from 'node:test';
import assert from 'node:assert/strict';
import { globePointer, followGlobe } from '../lib/globe-motion.ts';
test('globe pointer uses sphere centre and follows both mouse axes', () => {
 const bounds = {left:100,top:50,width:600,height:600};
 assert.deepEqual(globePointer(400,380,bounds),{x:0,y:0,inside:true});
 const right = globePointer(600,380,bounds), down = globePointer(400,580,bounds);
 assert.ok(right.x>0 && right.y===0 && right.inside);
 assert.ok(down.y>0 && down.x===0 && down.inside);
 assert.equal(globePointer(100,50,bounds).inside,false);
 assert.equal(globePointer(0,0,{left:0,top:0,width:0,height:0}).inside,false);
});
test('globe damping is refresh-rate independent and does not overshoot on reversal', () => {
 const simulate = hz => {let x=0;for(let i=0;i<hz;i++)x=followGlobe(x,.28,1000/hz);return x};
 assert.ok(Math.abs(simulate(60)-simulate(144))<1e-10);
 let x=.28;
 for(let i=0;i<100;i++){const next=followGlobe(x,-.28,16.67);assert.ok(next<=x && next>=-.28);x=next}
 assert.ok(Math.abs(x+.28)<.00001);
});
