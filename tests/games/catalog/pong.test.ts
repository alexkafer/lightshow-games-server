import Pong from '../../../src/games/catalog/Pong';
import {IScene} from '../../../src/LightManager';
import {ChannelPayload} from '../../../src/utils/FrameUpdater';

import { expect } from 'chai';

class FakeShow implements IScene {
    public channels: Array<number>;
    public lastMessage: string;

    constructor(size: number) {
        this.channels = new Array<number>(size);
        this.channels.fill(0);
    }

    setChannel(internalChannel: number, value: number): void {
        this.channels[internalChannel] = value;
    }
    
    set(updates: ChannelPayload): void {
        for (const channel of Object.keys(updates)) {
            // For makes channel a string, so the + converts it back to a number
            this.setChannel(+channel, updates[+channel]);
        }
    }
    
    allOn(): void {
        this.channels.fill(255);
    }
    
    allOff(): void {
        this.channels.fill(0);
    }
    
    displayPixelMessage(text: string, duration: number): void {
        this.lastMessage = text;
    }
}

describe('pong game', function() {
    it('starts with message', () => {
        const show = new FakeShow(512);
        const pong = new Pong(show);
    })
}