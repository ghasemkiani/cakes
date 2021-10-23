import React from 'react';
import {cutil} from '@ghasemkiani/base';

class AddressDisplay extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		//
	}
	componentWillUnmount() {
		//
	}
	render() {
		const {address} = this.props;
		return (
			<div className='AddressDisplay' style={{overflow: "hidden"}}>{address}</div>
		);
	}
}
cutil.extend(AddressDisplay.prototype, {
	//
});

export default AddressDisplay;
