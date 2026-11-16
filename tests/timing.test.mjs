import {test} from 'node:test';
import assert from 'node:assert/strict';
import {elapsedSeconds,practiceDurationSeconds,timeExpired} from '../src/engine/timing.ts';

test('elapsed time is measured by timestamps rather than tick counts',()=>{
  assert.equal(elapsedSeconds(10_000,12_900),2);
  assert.equal(elapsedSeconds(10_000,130_000),120);
  assert.equal(elapsedSeconds(10_000,9_000),0);
});
test('a resumed tab cannot submit after a paused 6-question deadline',()=>{
  const start=500_000;
  assert.equal(timeExpired(start,start+479_999,480),false);
  assert.equal(timeExpired(start,start+480_000,480),true);
  assert.equal(timeExpired(start,start+900_000,480),true);
});

test('timed practice sums selected pilot estimates rather than applying a fixed 80-second clock',()=>{
  assert.equal(practiceDurationSeconds([]),0);
  assert.equal(practiceDurationSeconds([{estimatedSeconds:90},{estimatedSeconds:130},{estimatedSeconds:155}]),375);
  assert.notEqual(practiceDurationSeconds([{estimatedSeconds:90},{estimatedSeconds:130}]),160);
});
