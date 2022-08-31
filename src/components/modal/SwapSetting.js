import {Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import infoImage from "../../assets/images/info.svg";
import {useEffect, useState} from "react";

const SwapSetting = (props) => {
    const {onValueUpdate} = props;
    const [formTempSlippage, setFormTempSlippage] = useState("2");
    useEffect(() => {
        if(localStorage.getItem('forteSlippage') !== null && localStorage.getItem('forteSlippage') !== "undefined"){
            setFormTempSlippage(localStorage.getItem('forteSlippage'))
        }else{
            localStorage.setItem("forteSlippage", "2");
        }
    }, [props.isOpen]);

    const saveSetting = () => {
        localStorage.setItem("forteSlippage", formTempSlippage);
        onValueUpdate(null)
    }
    const setAutoSlippage = () =>
    {
        setFormTempSlippage("2")
        localStorage.setItem("forteSlippage", "2");
    }

    return (
        <>
            <Modal scrollable={true} isOpen={props.isOpen} backdrop={true} centered={true} className="setting-modal" toggle={() => onValueUpdate(null)}>
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
                            <button className="btn btn-forte-image py-2 px-3 ms-auto" onClick={setAutoSlippage}>Auto</button>
                        </Col>
                        <Col sm={10}>
                            <div className="input-group mb-3">
                                <Input type="text" className="form-control with-bg text-end"  placeholder="2" defaultValue={formTempSlippage}
                                       onChange={(val) => setFormTempSlippage(val.target.value)}  value={formTempSlippage}/>
                                <div className="input-group-append">
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button color="none" className="btn-starch btn btn-lg" onClick={saveSetting}>
                        Save Settings
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default SwapSetting;