import React from 'react';
import Button from 'react-bootstrap/Button';

import {cutil} from '@ghasemkiani/base';

class ConnectToMetamask extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//
		};
	}
	componentDidMount() {
		//
	}
	componentWillUnmount() {
		//
	}
	render() {
		return (
			<Button variant="primary" disabled={typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask} onClick={this.handleClick}>Connect to Metamask</Button>
		);
	}
	handleClick = async event => {
		const {onChangeAddress} = this.props;
		const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
		const account = accounts[0];
		// alert(account);
		onChangeAddress(account);
	};
}
cutil.extend(ConnectToMetamask.prototype, {
	//
});

export default ConnectToMetamask;
