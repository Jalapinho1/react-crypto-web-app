import { useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import FileList from "./FileList";
import FileSending from "./FileSending";
import msgImg from '../../../assets/msgImg.svg';
import { LazyLoadImage } from "react-lazy-load-image-component";

const FileSharing = () => {
    const [wasFileSent, setWasFileSent] = useState(false);
    const [lgShow, setLgShow] = useState(false);

    const onFileSendHandler = () => {
        setLgShow(true);
    }

    const onFileSendSuccessHandler = () => {
        setWasFileSent(true);
    }

    return (
        <Container className="mt-3">
            <Card className="shadow-sm mt-4">
                <div className="bg-light py-3 text-center shadow-sm">
                    <LazyLoadImage
                        height={250}
                        width={250}
                        effect="blur"
                        src={msgImg}
                    ></LazyLoadImage>
                </div>
                <Card.Body className='p-4'>
                    <div>
                        <h4>File Sharing</h4>
                    </div>
                    <Card.Text>
                        Share files with your friends.
                    </Card.Text>
                    <Button onClick={onFileSendHandler} className="shadow-sm">
                        <FaDownload className="mb-1"></FaDownload> Send file
                    </Button>
                    <FileList wasFileSent={wasFileSent}></FileList>
                    {lgShow &&
                        <FileSending lgShow={lgShow} setLgShow={setLgShow} onSuccessHandler={onFileSendSuccessHandler}></FileSending>}
                </Card.Body>
            </Card>
        </Container >
    );
}

export default FileSharing;