
const PARTS = [{
    name: 'milliseconds',
    div: 1000,
}, {
    name: 'seconds',
    div: 60,
}, {
    name: 'minutes',
    div: 60,
}, {
    name: 'hours',
    div: 24,
}, {
    name: 'days',
    div: 365,
}]

export default class TimeDelta {
    constructor(data) {
        if (isNaN(data)) {
            this.setByObject(data);
        } else {
            this.setByNumber(data);
        }
    }

    addDelta(num) {
        this.setByNumber(this.getNumber() + num);
    }

    setByObject(data) {
        if (typeof data != 'object')
            throw new Error('Unknown data!');

        PARTS.forEach((part) => {
            this[part.name] = part.name in data ? data[part.name] : 0;
        })
    }

    setByNumber(num) {
        let prevDiv = 1;
        PARTS.forEach((part) => {
            num /= prevDiv;
            this[part.name] = parseInt(num) % part.div;
            prevDiv = part.div;
        });
    }

    getNumber(data) {
        let res = 0;
        let prevDiv = 1;
        PARTS.forEach((part) => {
            res += this[part.name] * prevDiv;
            prevDiv *= part.div;
        })
        return res;
    }
}
