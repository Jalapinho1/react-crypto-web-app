import { useContext } from "react";
import { Container, Card, Button, Accordion, useAccordionButton, AccordionContext } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import FileList from "./FileList";
import FileSending from "./FileSending";

const CustomToggle = ({ color, children, eventKey, callback }) => {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
        eventKey,
        () => callback && callback(eventKey),
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Button variant={isCurrentEventKey ? "danger" : "primary"} onClick={decoratedOnClick}>
            <span> {isCurrentEventKey ? <FaArrowUp size={17} className="mb-1 me-1"></FaArrowUp> : <FaArrowDown size={17} className="mb-1 me-1"></FaArrowDown>}</span>
            <span>{isCurrentEventKey ? "Close" : "Send file"}</span>
        </Button >
    );
}

const FileManagement = () => {
    return (
        <Container>
            <Card bg='light' className="shadow-sm my-4">
                <Card.Body>
                    <Accordion defaultActiveKey="1">
                        <Card>
                            <Card.Header>
                                <CustomToggle eventKey="1" color="primary">

                                </CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <FileSending></FileSending>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    <FileList></FileList>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default FileManagement;