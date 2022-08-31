import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import metamaskImg from "../../assets/images/metamask.png";
import walletConnectImg from "../../assets/images/walletConnectIcon.svg";
import coinBaseWalletImg from "../../assets/images/coinbaseWalletIcon.svg";
import fortmaticImg from "../../assets/images/formatic.png";

const WalletConnectModal = (props) => {
    const {onValueUpdate} = props;
    return (
        <>
            <Modal scrollable={true} isOpen={props.isOpen} backdrop={true} centered={true}>
                <ModalHeader toggle={() => onValueUpdate(null)}>Connect a wallet</ModalHeader>
                <ModalBody className="pt-0">
                    <Row>
                        <Col sm={12}>
                            <p>By connecting a wallet, you agree to ForteApp Terms
                                of Service and acknowledge that you have-read and understand the ForteApp Protocol Disclaimer</p>
                        </Col>
                        <hr/>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <button className="wallet-card">
                               <Row className="align-middle">
                                   <Col sm={2}>
                                       <img className="align-middle float-start" src={metamaskImg} alt="metamask" height="30px"/>
                                   </Col>
                                   <Col sm={10}>
                                        <h4> Install Metamask</h4>
                                   </Col>
                               </Row>
                           </button>
                            <button className="wallet-card">
                                <Row className="align-middle">
                                    <Col sm={2}>
                                        <img className="align-middle float-start" src={walletConnectImg} alt="metamask" height="30px"/>
                                    </Col>
                                    <Col sm={10}>
                                        <h4> WalletConnect</h4>
                                    </Col>
                                </Row>
                            </button>
                            <button className="wallet-card">
                                <Row className="align-middle">
                                    <Col sm={2}>
                                        <img className="align-middle float-start" src={coinBaseWalletImg} alt="metamask" height="30px"/>
                                    </Col>
                                    <Col sm={10}>
                                        <h4>Coinbase Wallet</h4>
                                    </Col>
                                </Row>
                            </button>
                            <button className="wallet-card">
                                <Row className="align-middle">
                                    <Col sm={2}>
                                        <img className="align-middle float-start" src={fortmaticImg} alt="metamask" height="30px"/>
                                    </Col>
                                    <Col sm={10}>
                                        <h4>Fortmatic</h4>
                                    </Col>
                                </Row>
                            </button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    );
}

export default WalletConnectModal;