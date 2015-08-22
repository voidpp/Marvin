
import React from 'react';
import {sprintf} from 'sprintf-js';

import {ComponentAsFactory, bind} from '../tools';
import Clock from './Clock';
import TimeDelta from '../TimeDelta';

class ActiveDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

	formatTime(data) {
		let format = "%(minutes)02d:%(seconds)02d";
		if(data.hours > 0)
			format = "%(hours)d:" + format;

		return sprintf(format, data);
	}

    getSpeedIcon() {
        return this.props.speed ? String.fromCharCode(0x25b6) : String.fromCharCode(0x275a) + String.fromCharCode(0x275a);
    }

    render() {
        return div({className: 'display active'},
            div({className: 'progress'},
                div({className: 'value', style: {width: `${this.props.percentage}%`}})
            ),
            table({className: 'details', cellPadding: 0, cellSpacing: 0},
                tbody(
                    tr(td({className: 'thumb', rowSpan: '100%'},
                        img({className: 'pic', src: this.props.thumbnails[0]})
                    )),
                    tr(td({className: 'description'}, this.props.description)),
                    tr(td({className: 'times'},
                        div({className: 'status'}, this.getSpeedIcon()),
                        div({className: 'current'}, this.formatTime(this.props.time)),
                        div({className: 'total'}, this.formatTime(this.props.totaltime))
                    )),
                    tr(td({className: 'clock'}, Clock()))
                )
            ),
            div({className: 'title'}, this.props.title)
        )
    }
}

ActiveDisplay.propTypes = {
    time: React.PropTypes.instanceOf(TimeDelta).isRequired,
    totaltime: React.PropTypes.instanceOf(TimeDelta).isRequired,
    title: React.PropTypes.string.isRequired,
    thumbnails: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    description: React.PropTypes.string.isRequired,
    speed: React.PropTypes.number.isRequired,
    percentage: React.PropTypes.number.isRequired,
}

export default ComponentAsFactory(ActiveDisplay);
