import { Container, Row, Col } from "react-bootstrap";

import FileList from "./FileList";
import FileSending from "./FileSending";


const FileManagement = () => {
    return (
        <Container>
            <Row>
                <Col xs={12} lg={12}>
                    <FileSending></FileSending>
                </Col>
                <Col xs={12} lg={12}>
                    <FileList></FileList>
                </Col>
            </Row>
        </Container>
    );
}

export default FileManagement;