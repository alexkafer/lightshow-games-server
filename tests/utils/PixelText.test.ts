import {makeTextArray} from '../../src/utils/PixelText';

import { expect } from 'chai';

describe('player queue', function() {
    
  it('returns an empty', async function() {
    const text = makeTextArray("");
    console.log(JSON.stringify(text));
    expect(text).to.eql([[], [], [], [], []]);
  });
  
  it('generates a letter', async function() {
    const text = makeTextArray("a");

    expect(text).to.eql([
        [false, false, true, false],
        [false, true, false, true],
        [false, true, false, true],
        [false, true, true, true],
        [false, true, false, true],
    ]);
  });

  it('concatenates two letters', async function() {
    const text = makeTextArray("az");

    expect(text).to.eql([
        [false, false, true, false, false, true,true,true,true,true],
        [false, true, false, true, false, false, false, false, true, false],
        [false, true, false, true, false, false, false, true, false, false],
        [false, true, true, true, false, false, true, false, false, false],
        [false, true, false, true, false, true,true,true,true,true],
    ]);
  });
  
  
});