import {SlottedQueue, IQueueable} from '../../src/utils/SlottedQueue';

class Queued implements IQueueable {
  public position = 0;
  constructor(public name: string) {};
 
  notifyPosition(position: number): void {
    this.position = position;
  }
}

import { expect } from 'chai';

describe('player queue', function() {
    it('is a FIFO queue', async function() {
      const playerQueue = new SlottedQueue();
      expect(playerQueue.length()).equal(0);
      
      const player1 = new Queued('player1');
      playerQueue.push(player1);
      expect(playerQueue.length()).equal(1);
      expect(player1.position).equal(1);

      const player2 = new Queued('player2');
      playerQueue.push(player2);
      expect(playerQueue.length()).equal(2);
      expect(player2.position).equal(2);

      expect(await playerQueue.getNextPlayer()).equal(player1);
      expect(playerQueue.length()).equal(1);

      expect(await playerQueue.getNextPlayer()).equal(player2);
      expect(playerQueue.length()).equal(0);
    }); 

    it('accepts and fills slots', async function() {
      const playerQueue = new SlottedQueue();
      expect(playerQueue.length()).equal(0);

      const slot1 = playerQueue.getNextPlayer();
      expect(playerQueue.length()).equal(-1);

      const slot2 = playerQueue.getNextPlayer();
      expect(playerQueue.length()).equal(-2);

      const slot3 = playerQueue.getNextPlayer();
      expect(playerQueue.length()).equal(-3);

      const player1 = new Queued('player1');
      playerQueue.push(player1);
      expect(playerQueue.length()).equal(-2);
      expect(await slot1).equal(player1);

      const player2 = new Queued('player2');
      playerQueue.push(player2);
      expect(playerQueue.length()).equal(-1);
      expect(await slot2).equal(player2);

      const player3 = new Queued('player3');
      playerQueue.push(player3);
      expect(playerQueue.length()).equal(0);
      expect(await slot3).equal(player3);
    }); 

    it('handles players leaving before game', async function() {
      const playerQueue = new SlottedQueue();
      expect(playerQueue.length()).equal(0);

      const slot1 = playerQueue.getNextPlayer();
      expect(playerQueue.length()).equal(-1);

      const player1 = new Queued('player1');
      playerQueue.push(player1);
      expect(playerQueue.length()).equal(0);

      expect(await slot1).equal(player1);

      const player2 = new Queued('player2');
      playerQueue.push(player2);
      expect(playerQueue.length()).equal(1);

      const player3 = new Queued('player3');
      playerQueue.push(player3);
      expect(playerQueue.length()).equal(2);

      expect(playerQueue.remove(player2)).equal(true);
      expect(playerQueue.length()).equal(1);

      const slot2 = playerQueue.getNextPlayer();
      expect(playerQueue.length()).equal(0);

      expect(await slot2).equal(player3);
    }); 

    it('handles players leaving during game', async function() {
      const playerQueue = new SlottedQueue();
      expect(playerQueue.length()).equal(0);
    });
});