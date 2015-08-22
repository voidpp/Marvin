
import React from 'react';

import {ComponentAsFactory, bind} from '../tools';
import Clock from './Clock';
import Calendar from './Calendar';

class InactiveDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return div({className: 'display inactive'},
            Clock({className: 'clock'}),
            Calendar({className: 'calendar'})
        );
    }
}

export default ComponentAsFactory(InactiveDisplay);
