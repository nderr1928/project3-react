import React from 'react';
import {Modal, Button, Menu} from 'semantic-ui-react';

const headerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center'
}

const h1Style = {
    height: 100+'%',
    margin: 0
}

function ShowCompanion (props){
    // console.log("loaded props", props);
    let imgPath = ''
    switch(props.race){
        case("Human"):
            imgPath = '/testImages/human.png'
            break;
        default:
            imgPath = '/testImages/default.gif'
            break;
    }
    // console.log(imgPath);
    return(
        <Modal dimmer='blurring' open={props.open}>
            <Modal.Header style={headerStyle}>
                <h1 style={h1Style}>{props.companion.name}</h1>
                <h1 style={h1Style}>Level: {props.companion.level}</h1>
                <Menu position='right'>
                    <Button onClick={props.closeModal} style={{margin: 0}}>Close</Button>
                </Menu>
            </Modal.Header>
            <Modal.Content>
                <h3>{props.companion.race}</h3>
            </Modal.Content>
        </Modal>
    )
}


export default ShowCompanion;