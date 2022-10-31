import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useGlobalModalContext} from "./GlobalModal.js";
import React from "react";

const ConfirmationWaitingModal = () => {
    const { hideModal, store } = useGlobalModalContext();
    const { modalProps } = store || {};
    const { msg } = modalProps || {};

    const toggleIsOpenModal = () => {
        hideModal();
    };

    return (
        <>
            <Modal isOpen={true} backdrop={true} keyboard={false} centered={true}>
                <ModalHeader toggle={toggleIsOpenModal}/>
                <ModalBody>
                    <Row>
                        <Col sm="12" className="text-center">
                            <div className="modal-confirmation-wrapper"/>
                            <div className="h5">Waiting for Confirmation</div>
                            <hr className="mt-4 "/>
                            <p className="mt-3 text-secondary">
                                <b>{msg}</b>
                                <br/>
                                Confirm this transaction in your wallet
                            </p>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    );
}

export default ConfirmationWaitingModal;