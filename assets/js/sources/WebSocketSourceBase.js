
import ReconnectingWebSocket from 'reconnectingwebsocket';
import SourceBase from './SourceBase';

export class WebSocketSourceBase extends SourceBase {
    constructor(host, port, path = '') {
        super();
        let uri = `ws://${host}:${port}${path}`;
        this.socket = new ReconnectingWebSocket(uri);
        this.socket.onmessage = this.onMessage.bind(this);

        this.socket.onopen = (event) => {
            console.debug(`Successfully connected to ${uri}`);
            if ('onOpen' in this)
                this.onOpen(event);
        }
    }

    sendMessage(message) {
        this.socket.send(JSON.stringify(message));
    }

    onMessage(event) {
        this.processMessage(JSON.parse(event.data));
    }

    close() {
        this.socket.close();
    }
};

export default WebSocketSourceBase;
