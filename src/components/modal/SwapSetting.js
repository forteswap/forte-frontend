import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import infoImage from "../../assets/images/info.svg";

const SwapSetting = (props) => {
    const {onValueUpdate} = props;
    return (
        <>
            <Modal scrollable={true} isOpen={props.isOpen} backdrop={true} centered={true} className="setting-modal">
                <ModalHeader toggle={() => onValueUpdate(null)}>Transaction Settings</ModalHeader>
                <ModalBody className="pt-0">
                    <Row>
                        <Col sm={12} className="mt-3">
                            <div className="d-flex">
                                <div className="info-wrapper">
                                    <img className="align-middle" src={infoImage} alt="info" height="20" width="20"/>
                                </div>
                                <p className="flex-grow-1 text-secondary">
                                    Be careful setting your own parameters!
                                </p>
                            </div>
                            <hr/>
                        </Col>
                        <Col sm={12} className="mt-3">
                            <p>Slippage tolerance?</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={2}>
                            <button className="btn btn-forte-image py-2 px-3 ms-auto">Auto</button>
                        </Col>
                        <Col sm={10}>
                            <Input className="form-control"/>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col sm={12}>
                           <p> Transaction Deadline? <span className="text-secondary">Best time is between 1-5 min</span></p>
                        </Col>
                        <Col sm={4}>
                            <Input className="form-control" value={30}/>
                        </Col>
                        <Col sm={3} className="ps-0">
                            <p className="ps-0">Minutes</p>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col sm={12}>
                            <p> Interface Settings</p>
                            <hr/>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="8">
                            <p>Auto Router API </p>
                        </Col>
                        <Col sm="4">
                            <div className="form-check form-switch row">
                                <input className="form-check-input cursor-pointer" type="checkbox" role="switch" />
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col sm="8">
                            <p>Expert Mode </p>
                        </Col>
                        <Col sm="4">
                            <div className="form-check form-switch row">
                                <input className="form-check-input cursor-pointer" type="checkbox" role="switch" />
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button color="none" className="btn-starch btn btn-lg">
                        Save Settings
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default SwapSetting;