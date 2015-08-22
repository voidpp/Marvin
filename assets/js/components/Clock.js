
import React from 'react';
import {ComponentAsFactory} from '../tools'
import {sprintf} from 'sprintf-js';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: this.getTimeString(),
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {
            this.setState({time: this.getTimeString()});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    getTimeString() {
        var today = new Date();
        return sprintf("%02d:%02d", today.getHours(), today.getMinutes());
    }

    render() {
        return div(this.props, this.state.time);
    }
}

export default ComponentAsFactory(Clock);
