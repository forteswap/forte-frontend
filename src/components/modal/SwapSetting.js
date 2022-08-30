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