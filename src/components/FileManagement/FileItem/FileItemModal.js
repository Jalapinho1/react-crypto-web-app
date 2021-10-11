import { useContext, useEffect, useRef, useState } from "react";
import { Col, Form, ListGroup, Row, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../../store/auth-context";

import classes from './FileItemModal.module.css';

const FileItem = (props) => {
    const newCommentInputRef = useRef();
    const [file, setFile] = useState();
    const [error, setError] = useState('');

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        console.log('Activitiy useEffect');

        if (!authCtx.accessToken) return;

        fetch(`http://localhost:8080/api/file/` + props.id,
            {
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken
                })
            }
        ).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
            setFile(data);
        });
    }, [props.id, authCtx.accessToken]);

    const onAddCommentHandler = () => {
        setError('');

        const comment = newCommentInputRef.current.value;

        if (!comment) {
            setError('Write a comment!');
            return;
        }

        const commentData = { fileMetadataId: props.id, commentedBy: authCtx.username, content: comment };

        fetch(
            `http://localhost:8080/api/file/update-comments`,
            {
                method: 'POST',
                body: JSON.stringify(commentData),
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        }).then(response => {
            setFile(previousFile => {
                return {
                    ...previousFile,
                    comments: [
                        ...previousFile.comments,
                        response
                    ]
                }
            });
            newCommentInputRef.current.value = '';
        }).catch(err => {
            err.json().then((body) => {
                setError(body.message);
            });
        });
    };

    let comments = <ListGroup.Item>
        <div className="ms-2 me-auto">
            <div>No comments for the selected file. Add the first one!</div>
        </div>
    </ListGroup.Item>;
    if (file && file.comments.length > 0) {
        comments = file.comments.map((comment, index) =>
            <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{comment.commentedBy}</div>
                    {comment.content}
                </div>
                {/* <Button variant="danger" size="sm" onClick={onCommentDeleteHandler}>
                    <FaTrashAlt className="mb-1"></FaTrashAlt>
                </Button> */}
            </ListGroup.Item>)
    }
    return (
        <>
            <Modal
                size="lg"
                show={props.lgShow}
                onHide={() => props.setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        File Comments
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <Row className="py-3 my-2 fw-bold bg-light">
                        <Col md>
                            <span>File name: {file && file.filename}</span>
                        </Col>
                        <Col md>
                            <span className="mb-0 ">Sender username: {file && file.senderUsername}</span>
                        </Col>
                    </Row>
                    <ListGroup className={classes.comments} as="ol" numbered="true">
                        {comments}
                    </ListGroup>
                    <Row className="mt-3">
                        <Col md>
                            <Form.Control type="text" placeholder="New comment" ref={newCommentInputRef} />
                        </Col>
                        <Col md>
                            <Button className="float-end" onClick={onAddCommentHandler}>Add comment</Button>
                        </Col>
                    </Row>
                    {error && <Row>
                        <div className="text-danger my-3 ms-1 fw-bold">
                            {error}
                        </div>
                    </Row>}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FileItem;