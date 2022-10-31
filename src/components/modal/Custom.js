import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {useNavigate} from "react-router";
import ellipseImg from "../../assets/images/ellipse.svg";
import {useGlobalModalContext} from "./GlobalModal.js";

const CustomModal = () => {
    const {hideModal, store} = useGlobalModalContext();
    const {modalProps} = store || {};
    const {icon, title1, title2, description, link} = modalProps || {};
    const navigate = useNavigate();

    const toggleIsOpenModal = () => {
        hideModal();
    };

    const poolIndex = () => {
        navigate('/');
        hideModal();
    }

    return (
        <>
            <Modal isOpen={true} backdrop={true} keyboard={false} centered={true}>
                <ModalHeader toggle={toggleIsOpenModal}/>
                <ModalBody>
                    <Row>
                        <Col sm="12" className="text-center">
                            <img src={icon || ellipseImg} height="125" width="125" className="mb-3" alt="custom"/>
                            <div className="h5">
                                {title1}{title2 ? <><br/>{title2}</> : ''}
                            </div>
                            <hr className="mt-4 "/>
                            {description ?
                                <p className="mt-3 text-secondary">
                                    {description}
                                </p>
                                : ''}

                            {link && link.title ?
                                <a className="mt-3" href={link.href} target="_blank" rel="noreferrer">
                                    <b>{link.title}</b>
                                </a>
                                : ''}
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className="with-bg full-btn">
                    <Button onClick={poolIndex} color="none" className="btn-starch btn btn-lg">
                        Return to Pools
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default CustomModal;