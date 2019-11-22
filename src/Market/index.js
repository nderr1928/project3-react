import React from 'react';
import {Modal, Button} from 'semantic-ui-react';

const Market = (props) => {
    return(
        <Modal open={props.open}>
            <Button onClick={props.closeModal}>Exit Market</Button>
        </Modal>
    )
}


export default Market;
