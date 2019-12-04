import { FrameUpdater, ChannelPayload } from '../../src/utils/FrameUpdater';

import { expect } from 'chai';

describe('frame updater', function() {
    
  it('starts with an empty frame of the correct size', async function() {
    expect(Object.keys(new FrameUpdater(512).getFrame(false)).length).equal(512);
    expect(Object.keys(new FrameUpdater(30).getFrame(true)).length).equal(30);
    expect(Object.keys(new FrameUpdater(1025).getFrame(false)).length).equal(1025);
  });
  
  it('No updates returns an empty object', async function() {
    const frameUpdater = new FrameUpdater(512);
    const diff = frameUpdater.commitUpdates();
    expect(diff).to.be.an('object').that.is.empty;
  });

  it("Update returns object with only the updated channel", () => {
    const frameUpdater = new FrameUpdater(512);
    frameUpdater.setChannel(5, 100);

    let diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({5: 100});

    frameUpdater.setChannel(7, 200);
    diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({7: 200});
  })

  it("combines multiple updates", () => {
    const frameUpdater = new FrameUpdater(200);
    frameUpdater.setChannel(5, 100);
    frameUpdater.setChannel(100, 300);
    frameUpdater.setChannel(200, 5);

    let diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({
      5: 100,
      100: 255, 
      200: 5
    });
  })

  it("doesn't allow channels out of range", () => {
    const frameUpdater = new FrameUpdater(200);

    // Negative channel
    frameUpdater.setChannel(-20, 100);

    // Channel sets to 0, which is not an update
    frameUpdater.setChannel(100, -50);

    // Channel too high
    frameUpdater.setChannel(201, 5);

    let diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({});
  })

  it("only retains the most recent, unique updates ", () => {
    const frameUpdater = new FrameUpdater(200);

    // Negative channel
    frameUpdater.setChannel(140, 100);

    // Channel sets to 0, which is not an update
    frameUpdater.setChannel(140, 200);

    frameUpdater.setChannel(70, 200);
    frameUpdater.setChannel(70, 0);

    // Channel too high
    let diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({
      140: 200
    });
  })

  it("creates keyframes that clear the queue", () => {
    const frameUpdater = new FrameUpdater(200);

    // Negative channel
    frameUpdater.setChannel(140, 100);

    let frame = frameUpdater.getFrame(true);
    expect(frame).to.include({140: 100});

    // Channel too high
    let diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({});
  })

  it("can set every channel and every value", () => {
    const universe = 255;
    const frameUpdater = new FrameUpdater(universe);

    for (let channel = 0; channel < universe; channel++) {
      frameUpdater.setChannel(channel + 1, channel);
    }

    const frame = frameUpdater.getFrame(true);

    for (let channel = 0; channel < universe; channel++) {
      expect(frame[channel+1]).equal(channel)
    }
  })

  it("can reset and fill with arbitrary value", () => {
    const value = 148;
    const size = 190;
    const frameUpdater = new FrameUpdater(size);

    frameUpdater.setChannel(10, 200);
    
    // Channel too high
    const diff = frameUpdater.commitUpdates();
    expect(diff).to.eql({
      10: 200
    });

    frameUpdater.setChannel(10, 200);
    frameUpdater.resetAndFill(value)

    let frame = frameUpdater.getFrame(false);
    for (let channel = 0; channel < size; channel++) {
      expect(frame[channel+1]).equal(value)
    }

    frame = frameUpdater.getFrame(true);
    for (let channel = 0; channel < size; channel++) {
      expect(frame[channel+1]).equal(value)
    }
  })
});