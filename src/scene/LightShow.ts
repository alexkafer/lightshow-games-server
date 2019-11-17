export default class LightShow {

    private gallium: SocketIO.Server;

    public connect(gallium: SocketIO.Server) {
        this.gallium = gallium;
    }

    private sendFrame(event: string, payload: number[]) {
        if (this.gallium !== null) {
            return this.gallium.emit('frame', payload);
        } else {
            console.log(`Gallium isn't connected. Unable to send ${event}`);
            return false;
        }
    }

    public allOn() {
        if (this.gallium !== null) {
            return this.gallium.emit('allOn');
        } else {
            console.log(`Gallium isn't connected. Unable to send ${event}`);
            return false;
        }
    }

    public allOff() {
        if (this.gallium !== null) {
            return this.gallium.emit('allOff');
        } else {
            console.log(`Gallium isn't connected. Unable to send ${event}`);
            return false;
        }
    }
}