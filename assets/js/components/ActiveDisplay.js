import React from 'react';
import {sprintf} from 'sprintf-js';

import {ComponentAsFactory, bind} from '../tools';
import Clock from './Clock';
import Calendar from './Calendar';
import TimeDelta from '../TimeDelta';

class ActiveDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.speedChars = {
            0: String.fromCharCode(0x275a) + String.fromCharCode(0x275a),
            1: String.fromCharCode(0x25b6),
            2: String.fromCharCode(0x25b6) + String.fromCharCode(0x25b6),
        }
    }

	formatTime(data) {
		let format = "%(minutes)02d:%(seconds)02d";
		if(data.hours > 0)
			format = "%(hours)d:" + format;

		return sprintf(format, data);
	}

    getSpeedIcon() {
        if (this.props.speed in this.speedChars)
            return this.speedChars[this.props.speed];
        else
            return '';
    }

    render() {
        return div({className: 'display active'},
            div({className: 'fanart', style: {
                backgroundImage: `url(${this.props.fanarts[0]}), url(/static/pic/kodi.jpg)`,
            }}),
            div({className: 'content'},
                div({className: 'progress'},
                    div({className: 'value', style: {width: `${this.props.percentage}%`}})
                ),
                div({className: 'details'},
                    table(
                        tr(td({className: 'title'}, this.props.title)),
                        tr(td({className: 'description'}, this.props.description)),
                        tr(td({className: 'times'},
                            div({className: 'status'}, this.getSpeedIcon()),
                            div({className: 'current'}, this.formatTime(this.props.time)),
                            div({className: 'total'}, `(${this.formatTime(this.props.totaltime)})`)
                        )),
                        tr(td({className: 'date'},
                            Calendar({className: 'calendar'}),
                            Clock({className: 'clock'})
                        ))
                    )
                )
            )
        );
    }
}

ActiveDisplay.propTypes = {
    time: React.PropTypes.instanceOf(TimeDelta).isRequired,
    totaltime: React.PropTypes.instanceOf(TimeDelta).isRequired,
    title: React.PropTypes.string.isRequired,
    fanarts: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    description: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    speed: React.PropTypes.number.isRequired,
    percentage: React.PropTypes.number.isRequired,
}

export default ComponentAsFactory(ActiveDisplay);
