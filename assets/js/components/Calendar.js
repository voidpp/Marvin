
import React from 'react';
import {ComponentAsFactory} from '../tools'
import {sprintf} from 'sprintf-js';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.getDateString(),
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {
            this.setState({date: this.getDateString()});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    getDateString() {
        var today = new Date();
        return sprintf("%d-%02d-%02d", today.getFullYear(), today.getMonth()+1, today.getDate());
    }

    render() {
        return div(this.props, this.state.date);
    }
}

export default ComponentAsFactory(Calendar);
