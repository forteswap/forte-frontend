import {Col, Container, Row} from "reactstrap";


const Footer = () => {
    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col sm={12} className="text-center">
                        <p className="text-white">
                            Help improve ForteSwap by <a className="text-white fw-bold"
                                                         href="https://forms.gle/exMxUju3iRGyLXLV9" target="_blank"
                                                         rel="external">reporting bugs here.</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Footer;