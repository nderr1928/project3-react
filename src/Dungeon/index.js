import React from 'react';
import {Modal, Button} from 'semantic-ui-react';

const Dungeon = (props) => {
    return(
        <Modal open={props.open}>
            <Button onClick={props.closeModal}>Exit Dungeon</Button>
        </Modal>
    )
}


export default Dungeon;
