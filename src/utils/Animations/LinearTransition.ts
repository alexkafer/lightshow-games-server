import { IAnimation } from '../Animator';

export default class LinearTransition implements IAnimation {

    private current: number;
    
    constructor(from: number, private to: number, private step: number) {
        this.current = from;
    }

    isFinished(): boolean {
        return this.current === this.to;
    }

    getNextValue(): number {
        let newValue;
        if (this.current > this.to) {
            newValue = Math.max(this.to, this.current - this.step);
        }

        if (this.current < this.to) {
            newValue = Math.min(this.to, this.current + this.step);
        }

        this.current = newValue;
        return newValue;
    }
}
    