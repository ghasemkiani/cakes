import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {ethers} from 'ethers';
import {BigNumber} from 'ethers';

import {cutil} from '@ghasemkiani/base';

import './App.css';
import logo from './logo.svg';
import Clock from './Clock.js';
import InfoDisplay from './InfoDisplay.js';
import PCS from './pancakeswap.js';
import {abi as abiErc20} from './abi/erc20.js';
import {abi as abiMasterchef} from './abi/masterchef.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			address: null,
		};
	}
	componentDidMount() {
		//
	}
	componentWillUnmount() {
		//
	}
	render() {
		const {address} = this.state;
		const {stakeCake} = this.state;
		const {pendingCake} = this.state;
		const {balanceCake} = this.state;
		const {stakeAmount} = this.state;
		const {unstakeAmount} = this.state;
		return (
			<>
				<header>
					<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
						<Container>
							<Navbar.Brand href=".">
								<img alt="logo" src={logo} width="30" height="30" className="d-inline-block align-top"/>
								{' '}
								Cakes
							</Navbar.Brand>
							<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
							<Navbar.Collapse id="responsive-navbar-nav">
								<Nav className="me-auto">
									<Nav.Link href="#pools">Pools</Nav.Link>
									<Nav.Link href="#farms">Farms</Nav.Link>
									<NavDropdown title="Language" id="collasible-nav-dropdown">
										<NavDropdown.Item href="#en">English</NavDropdown.Item>
										<NavDropdown.Item href="#fa">فارسی</NavDropdown.Item>
										<NavDropdown.Divider/>
										<NavDropdown.Item href="#lang">Select</NavDropdown.Item>
									</NavDropdown>
								</Nav>
								<Nav>
									<Nav.Link target="_blank" href={!!address ? `https://bscscan.com/address/${address}` : ""}>
										{!!address ? address : "Not connected"}
									</Nav.Link>
									<Nav.Link variant="primary" disabled={typeof window.ethereum === 'undefined'} onClick={this.handleClickConnect}>
										{!!address ? "Disconnect" : "Connect"}
									</Nav.Link>
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</header>
				<main>
					<Container>
						<Row>
							<Col md={4}>
								<Clock />
							</Col>
							<Col md={8}>
								<Row>
									<h2>Cake Pool</h2>
								</Row>
								<Row>
									<InfoDisplay
										stakeCake={stakeCake || 0}
										pendingCake={pendingCake || 0}
										balanceCake={balanceCake || 0}
									/>
								</Row>
								<Row>
									<ButtonGroup>
										<Button variant="primary" onClick={this.handleClickRefresh}>Refresh</Button>
										<Button variant="primary" onClick={this.handleClickHarvest}>Harvest</Button>
										<Button variant="primary" onClick={this.handleClickCompound}>Compound</Button>
									</ButtonGroup>
								</Row>
								<h3>Stake</h3>
								<Form>
									<Form.Group className="mb-3" controlId="formStakeAmount1">
										<Form.Label>Amount</Form.Label>
										<Form.Control placeholder="0" value={stakeAmount} onChange={this.handleChangeStakeAmount} />
									</Form.Group>
									<Form.Group className="mb-3">
										<Button variant="success" onClick={this.handleClickStakeBalance}>Balance</Button>
										{' '}
										<Button variant="success" onClick={this.handleClickStakeBalancePlusPending}>Balance + Pending</Button>
										{' '}
										<Button variant="primary" onClick={this.handleClickStake}>Stake</Button>
									</Form.Group>
								</Form>
								<h3>Unstake</h3>
								<Form>
									<Form.Group className="mb-3" controlId="formUnstakeAmount1">
										<Form.Label>Amount</Form.Label>
										<Form.Control placeholder="0" value={unstakeAmount} onChange={this.handleChangeUnstakeAmount} />
									</Form.Group>
									<Form.Group className="mb-3">
										<Button variant="success" onClick={this.handleClickUnstakeMax}>Max</Button>
										{' '}
										<Button variant="primary" onClick={this.handleClickUnstake}>Unstake</Button>
									</Form.Group>
								</Form>
							</Col>
						</Row>
					</Container>
				</main>
				<footer>
					<Container>
						<Row>
							<p>© 2021, Ghasem Kiani</p>
						</Row>
					</Container>
				</footer>
			</>
		);
	}
	handleClickConnect = async event => {
		if (window.ethereum) {
			const {address} = this.state;
			if (!address) { // connect
				let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
				let address = accounts[0];
				this.handleChangeAddress(address);
				window.ethereum.on('accountsChanged', this.handleAccountsChanged);
			} else { // disconnect
				this.setState({address: null});
				window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
			}
		}
		return true;
	};
	handleChangeAddress = async address => {
		this.setState({address});
		await this.toRefresh();
	};
	async toRefresh() {
		const {address} = this.state;
		if (address) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner();
			
			let addressCake = PCS.addresses.CAKE;
			let contractCake = new ethers.Contract(addressCake, abiErc20, provider).connect(signer);
			let decimalsCake = await contractCake.decimals();
			let balanceCake_ = await contractCake.balanceOf(address);
			let balanceCake = ethers.utils.formatUnits(balanceCake_, decimalsCake);
			// alert(balanceCake);
			
			let addressMasterchef = PCS.addresses.masterchef;
			let contractMasterchef = new ethers.Contract(addressMasterchef, abiMasterchef, provider).connect(signer);
			let pidCake = 0;
			
			let userInfo = await contractMasterchef.userInfo(pidCake, address);
			let {amount: stakeCake_} = userInfo;
			let stakeCake = ethers.utils.formatUnits(stakeCake_, decimalsCake);
			// alert(stakeCake);
			
			let pendingCake_ = await contractMasterchef.pendingCake(pidCake, address);
			let pendingCake = ethers.utils.formatUnits(pendingCake_, decimalsCake);
			// alert(pendingCake);
			
			this.setState({
				provider,
				signer,
				decimalsCake,
				stakeCake_,
				stakeCake,
				pendingCake_,
				pendingCake,
				balanceCake_,
				balanceCake,
			});
		} else {
			//
		}
	}
	async toHarvest() {
		const {address} = this.state;
		if (address) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			
			let addressMasterchef = PCS.addresses.masterchef;
			let contractMasterchef = new ethers.Contract(addressMasterchef, abiMasterchef, provider).connect(signer);
			
			let tx = await contractMasterchef.leaveStaking(0);
			console.log(tx);
			await this.toRefresh();
		} else {
			alert("Please connect to a wallet first!");
		}
	}
	async toCompound() {
		const {address} = this.state;
		if (address) {
			await this.toRefresh();
			let {pendingCake_} = this.state;
			// let {balanceCake_} = this.state;
			// let totalCake_ = (BigNumber.from(pendingCake_).add(BigNumber.from(balanceCake_))).toString();
			let totalCake_ = (BigNumber.from(pendingCake_)).toString();
			
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			
			let addressCake = PCS.addresses.CAKE;
			let contractCake = new ethers.Contract(addressCake, abiErc20, provider).connect(signer);
			let decimalsCake = await contractCake.decimals();
			
			let totalCake = ethers.utils.formatUnits(totalCake_, decimalsCake);
			if (cutil.asNumber(totalCake) > 1) {
				let addressMasterchef = PCS.addresses.masterchef;
				let contractMasterchef = new ethers.Contract(addressMasterchef, abiMasterchef, provider).connect(signer);
				
				console.log(`Cake total_: ${totalCake_}`);
				
				let tx = await contractMasterchef.enterStaking(totalCake_);
				console.log(tx);
				await this.toRefresh();
			}
		} else {
			alert("Please connect to a wallet first!");
		}
	}
	handleClickRefresh = async event => {
		await this.toRefresh();
	};
	handleClickHarvest = async event => {
		try {
			await this.toHarvest();
		} catch(e) {
			console.log(`Error in harvesting: ${e.message}`);
		}
	};
	handleClickCompound = async event => {
		try {
			await this.toCompound();
		} catch(e) {
			console.log(`Error in compounding: ${e.message}`);
		}
	};
	handleAccountsChanged = async accounts => {
		try {
			let [address] = accounts;
			this.handleChangeAddress(address);
		} catch(e) {
			this.handleChangeAddress(null);
		}
	};
	handleChangeStakeAmount = async event => {
		let stakeAmount = event.target.value;
		this.setState({stakeAmount});
	};
	handleClickStakeBalance = async event => {
		const {balanceCake} = this.state;
		let stakeAmount = balanceCake;
		this.setState({stakeAmount});
	};
	handleClickStakeBalancePlusPending = async event => {
		const {decimalsCake} = this.state;
		if (decimalsCake) {
			const {balanceCake_} = this.state;
			const {pendingCake_} = this.state;
			let stakeAmount_ = (BigNumber.from(balanceCake_).add(BigNumber.from(pendingCake_))).toString();
			let stakeAmount = ethers.utils.formatUnits(stakeAmount_, decimalsCake);
			this.setState({stakeAmount});
		}
	};
	handleClickStake = async event => {
		const {address} = this.state;
		if (address) {
			const {provider} = this.state;
			const {signer} = this.state;
			const {decimalsCake} = this.state;
			const {stakeAmount} = this.state;
			let parts = stakeAmount.split(".");
			if (parts.length === 3 && parts[2].length > decimalsCake) {
				parts[2] = parts[2].substring(0, decimalsCake);
			}
			let stakeAmount_ = ethers.utils.parseUnits(parts.join("."), decimalsCake);
			let addressMasterchef = PCS.addresses.masterchef;
			let contractMasterchef = new ethers.Contract(addressMasterchef, abiMasterchef, provider).connect(signer);
			let tx = await contractMasterchef.enterStaking(stakeAmount_);
			console.log(tx);
			await this.toRefresh();
		} else {
			alert("Please connect to a wallet first!");
		}
	};
	handleChangeUnstakeAmount = async event => {
		let unstakeAmount = event.target.value;
		this.setState({unstakeAmount});
	};
	handleClickUnstakeMax = async event => {
		const {address} = this.state;
		if (address) {
			const {decimalsCake} = this.state;
			const {stakeCake_} = this.state;
			let unstakeAmount_ = (BigNumber.from(stakeCake_)).toString();
			let unstakeAmount = ethers.utils.formatUnits(unstakeAmount_, decimalsCake);
			this.setState({unstakeAmount});
		}
	};
	handleClickUnstake = async event => {
		const {address} = this.state;
		if (address) {
			const {provider} = this.state;
			const {signer} = this.state;
			const {decimalsCake} = this.state;
			const {unstakeAmount} = this.state;
			let parts = unstakeAmount.split(".");
			if (parts.length === 3 && parts[2].length > decimalsCake) {
				parts[2] = parts[2].substring(0, decimalsCake);
			}
			let unstakeAmount_ = ethers.utils.parseUnits(parts.join("."), decimalsCake);
			let addressMasterchef = PCS.addresses.masterchef;
			let contractMasterchef = new ethers.Contract(addressMasterchef, abiMasterchef, provider).connect(signer);
			let tx = await contractMasterchef.leaveStaking(unstakeAmount_);
			console.log(tx);
			await this.toRefresh();
		} else {
			alert("Please connect to a wallet first!");
		}
	};
}
cutil.extend(App.prototype, {
	//
});

export default App;
