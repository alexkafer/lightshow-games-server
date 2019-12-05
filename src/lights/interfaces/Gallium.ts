import logger from "../../utils/Logger";

import ChannelPayload from "../../utils/ChannelPayload";

import SocketIO from "socket.io";
import GameServer from "../../GameServer";

export default class LightManager  {

    private gallium: SocketIO.Server;

    constructor(gs: GameServer) {
        this.gallium = SocketIO(gs.getServer(), {
            path: '/gallium',
        });

        this.gallium.use((socket, next) => {
            const token = socket.handshake.query.token;
            if (token === "lightshow2") {
                return next();
            }
            return next(new Error('authentication error'));
        });

        this.gallium.on('connection', this.galliumConnection.bind(this));
    }

    private galliumConnection(socket: any) {
        logger.debug('gallium connected')
        socket.join('gallium');

        socket.on('disconnect', () => {
            logger.debug('gallium disconnected');
        });
    }

    public sendFrame(frame: ChannelPayload) {
        // Commit the updates to the frame and send the frame
        this.gallium.emit('frame',frame);
    }

    public sendAllOn() {
        this.gallium.emit('allOn');
    }

    public sendAllOff() {
        this.gallium.emit('allOff');
    }
}