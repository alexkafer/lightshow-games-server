import Animator from '../../src/utils/Animator';

import { expect } from 'chai';

describe('frame animator', function() {
    
  it('will not provide updates with blank animator' , async function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})
  });

  it('will linearly increase a channel' , async function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([3], 0, 100, 50);
    expect(animator.animate()).eql({3: 50});
    expect(animator.animate()).eql({3: 100});
    expect(animator.animate()).eql({});
  });

  it('will linearly decrease a channel' , function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([3], 250, 175, 25);
    expect(animator.animate()).eql({3: 225});
    expect(animator.animate()).eql({3: 200});
    expect(animator.animate()).eql({3: 175});
    expect(animator.animate()).eql({});
  });

  it('will not over shoot an increase' , function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([3], 100, 150, 20);
    expect(animator.animate()).eql({3: 120});
    expect(animator.animate()).eql({3: 140});
    expect(animator.animate()).eql({3: 150});
    expect(animator.animate()).eql({});
  });

  it('handles multiple transitions on different channels', function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([3], 100, 150, 25);
    animator.startLinearTransition([5], 200, 140, 20);

    expect(animator.animate()).eql({
      3: 125,
      5: 180
    });

    expect(animator.animate()).eql({
      3: 150,
      5: 160
    });

    expect(animator.animate()).eql({
      5: 140
    });

    expect(animator.animate()).eql({});
  });

  it('handles multiple transitions on the same channel', function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([3, 6, 8], 100, 150, 25);

    expect(animator.animate()).eql({
      3: 125,
      6: 125,
      8: 125,
    });

    expect(animator.animate()).eql({
      3: 150,
      6: 150,
      8: 150,
    });

    expect(animator.animate()).eql({});
  });

  it('uses the most recent animation when multiple on a channel', function() {
    const animator = new Animator();
    expect(animator.animate()).eql({})

    animator.startLinearTransition([150], 100, 200, 25);

    expect(animator.animate()).eql({
      150: 125
    });

    expect(animator.animate()).eql({
      150: 150
    });

    animator.startLinearTransition([150], 75, 25, 25);

    expect(animator.animate()).eql({
      150: 50
    });

    expect(animator.animate()).eql({
      150: 25
    });

    expect(animator.animate()).eql({});
  });
});