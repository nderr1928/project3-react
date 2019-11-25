import React from 'react';
import {Modal, Button} from 'semantic-ui-react';

const Market = (props) => {
    return(
        <Modal open={props.open}>
        <button type="button" onClick={() => props.createItem(1)}>purchase minor potion</button>
        <button type="button" onClick={() => props.createItem(2)}>purchase potion</button>
        <button type="button" onClick={() => props.createItem(3)}>purchase super potion</button><br/>
        <Button onClick={props.closeModal}>Exit Market</Button>
        </Modal>
    )
}


export default Market;
