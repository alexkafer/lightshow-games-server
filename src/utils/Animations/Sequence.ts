import {IAnimation} from '../Animator';

export default class SequenceAnimation implements IAnimation {
    private frame = 0;

    constructor(private sequence: number[]) {}

    isFinished() {
        return this.frame === this.sequence.length;
    }

    getNextValue(): number {
        // Wait until it is time to move to the next frame
        return this.sequence[this.frame++];
    }
}