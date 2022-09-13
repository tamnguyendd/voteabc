import { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Row, Col, ToastContainer, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const DialogErrorMsg = () => {

    const [isShowDialog, setisShowDialog] = useState(false);
    const [dialogMsg, setdialogMsg] = useState('');

    useEffect(() => {

        // check to show Balance of Coin
        async function ShowDialogErrorMsg(message) {
            setdialogMsg(message);
            setisShowDialog(true);
        }

        // share this method to another component can call it.
        //Ex: ([buy now] button will call this method)
        window.ShowDialogErrorMsg = ShowDialogErrorMsg.bind(window);
    });
    return (
        <Modal show={isShowDialog}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={async () => setisShowDialog(false)}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className='error'><FontAwesomeIcon icon={faTriangleExclamation} /></span>
                    Error
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label>
                            {dialogMsg}
                        </Form.Label>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer className='text-center'>
                <Button variant="danger" onClick={async () => setisShowDialog(false)}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DialogErrorMsg;