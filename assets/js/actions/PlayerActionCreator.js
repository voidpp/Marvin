import ActionTypes from '../constants/PlayerConstants';

import Dispatcher from '../Dispatcher';

export class PlayerActionCreator {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }

    play() {
        this.dispatcher.dispatch({
            type: ActionTypes.PLAY,
        })
    }

    pause() {
        this.dispatcher.dispatch({
            type: ActionTypes.PAUSE,
        })
    }

    stop() {
        this.dispatcher.dispatch({
            type: ActionTypes.STOP,
        })
    }

    changeContent(content) {
        this.dispatcher.dispatch({
            type: ActionTypes.CONTENT_CHANGE,
            content: content,
        })
    }

    seek(time, offset) {
        this.dispatcher.dispatch({
            type: ActionTypes.SEEK,
            time: time,
            offset: offset,
        })
    }
}

export default new PlayerActionCreator(Dispatcher);
