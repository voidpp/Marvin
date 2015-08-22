import {EventEmitter} from 'events';

import Dispatcher from '../Dispatcher';
import ActionTypes from '../constants/PlayerConstants';

const NAME = '42'

export class PlayerStore extends EventEmitter {
    constructor(dispatcher) {
        super();
        this.dispatcher = dispatcher;

        this.dispatchCallback = this.dispatchCallback.bind(this);
        this.dispatchToken = this.dispatcher.register(this.dispatchCallback);

        setInterval(this.updateCurrentTime.bind(this), 1000)

        this.initContent();
    }

    addChangeListener(cb) {
        this.on(NAME, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(NAME, cb);
    }

    emitChange() {
        this.emit(NAME);
    }

    isActive() {
        return 'title' in this.content ? true : false;
    }

    initContent() {
        this.setContent({
            speed: -1,
        });
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.contentTime = content.speed ? new Date() : null;
        this.content = content;
    }

    modContent(partialContent) {
        this.setContent(Object.assign(this.content, partialContent));
    }

    updateCurrentTime() {
        if (this.content.speed < 1 || !this.isActive())
            return;

        let now = new Date();
        let diff = now.getTime() - this.contentTime.getTime();
        this.contentTime = now;
        this.content.time.addDelta(diff);
        this.__updatePercentage();
        this.emitChange();
    }

    __updatePercentage() {
        this.content.percentage = this.content.time.getNumber() / this.content.totaltime.getNumber() * 100;
    }

    dispatchCallback(action) {
        switch(action.type) {
            case ActionTypes.PLAY:
                this.modContent({speed: 1});
                this.emitChange();
                break;
            case ActionTypes.STOP:
                this.initContent();
                this.emitChange();
                break;
            case ActionTypes.PAUSE:
                this.modContent({speed: 0});
                this.emitChange();
                break;
            case ActionTypes.SEEK:
                this.modContent({time: action.time});
                this.__updatePercentage();
                this.emitChange();
                break;
            case ActionTypes.CONTENT_CHANGE:
                this.setContent(action.content);
                this.emitChange();
                break;
        }
    }
}

export default new PlayerStore(Dispatcher);
