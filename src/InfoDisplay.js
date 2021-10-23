import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {cutil} from '@ghasemkiani/base';

class InfoDisplay extends React.Component {
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
		const {balanceCake} = this.props;
		const {stakeCake} = this.props;
		const {pendingCake} = this.props;
		return (
			<Container fluid>
				<Row>
					<Col xs={5}>
						<div className='InfoDisplay-Label'>Cake stake</div>
					</Col>
					<Col xs={7} style={{textAlign: "right"}}>
						<div className='InfoDisplay-StakeCake'>{cutil.asNumber(stakeCake).toFixed(3)}</div>
					</Col>
				</Row>
				<Row>
					<Col xs={5}>
						<div className='InfoDisplay-Label'>Cake pending</div>
					</Col>
					<Col xs={7} style={{textAlign: "right", fontWeight: "bold"}}>
						<div className='InfoDisplay-PendingCake'>{cutil.asNumber(pendingCake).toFixed(3)}</div>
					</Col>
				</Row>
				<Row>
					<Col xs={5}>
						<div className='InfoDisplay-Label'>Cake balance</div>
					</Col>
					<Col xs={7} style={{textAlign: "right"}}>
						<div className='InfoDisplay-BalanceCake'>{cutil.asNumber(balanceCake).toFixed(3)}</div>
					</Col>
				</Row>
				<Row>
					<Col xs={5}>
						<div className='InfoDisplay-Label'>Cake total</div>
					</Col>
					<Col xs={7} style={{textAlign: "right"}}>
						<div className='InfoDisplay-BalanceCake'>{(cutil.asNumber(stakeCake) + cutil.asNumber(pendingCake) + cutil.asNumber(balanceCake)).toFixed(3)}</div>
					</Col>
				</Row>
			</Container>
		);
	}
}
cutil.extend(InfoDisplay.prototype, {
	//
});

export default InfoDisplay;
