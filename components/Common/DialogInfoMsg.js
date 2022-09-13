import { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Row, Col, ToastContainer, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const DialogInfoMsg = () => {

    const [isShowDialog, setisShowDialog] = useState(false);
    const [dialogMsg, setdialogMsg] = useState('');

    useEffect(() => {

        // check to show Balance of Coin
        async function ShowDialogInfoMsg(message) {
            setdialogMsg(message);
            setisShowDialog(true);
        }

        // share this method to another component can call it.
        //Ex: ([buy now] button will call this method)
        window.ShowDialogInfoMsg = ShowDialogInfoMsg.bind(window);
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
                    <span className='info'><FontAwesomeIcon icon={faCircleInfo} /></span>
                    Info
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
                <Button variant="primary" onClick={async () => setisShowDialog(false)}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DialogInfoMsg;