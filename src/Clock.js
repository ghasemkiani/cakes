import React from 'react';
import dateformat from 'dateformat';
import {cutil} from '@ghasemkiani/base';

const df = date => dateformat(date, 'yyyy-mm-dd HH:MM:ss');

class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
		};
	}
	componentDidMount() {
		this.timerId = setInterval(() => {
			this.tick();
		}, 1000);
	}
	componentWillUnmount() {
		clearInterval(this.timerId);
	}
	render() {
		return (
			<div className='Clock'>{df(this.state.date)}</div>
		);
	}
	tick() {
		this.setState({
			date: new Date(),
		});
	}
}
cutil.extend(Clock.prototype, {
	timerId: null,
});

export default Clock;
