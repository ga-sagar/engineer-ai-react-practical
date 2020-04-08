import React from 'react';

import { Modal, Button } from 'react-bootstrap';

const postDetailsModal = (props) => {
    return (
        <Modal show={props.selectedPost !== null} onHide={props.onModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.selectedPost.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{JSON.stringify(props.selectedPost)}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default postDetailsModal;