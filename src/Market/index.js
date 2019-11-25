import React from 'react';
import {Modal, Button} from 'semantic-ui-react';

const Market = (props) => {

	  const potionStyle = {
	  	width: "100px",
	  	hight: "100px"
    };

    return(

        <Modal open={props.open}>

        <img style={potionStyle} src={'/images/potions/potions(5).png'} /><img style={potionStyle} src={'/images/potions/potions(4).png'} /><img style={potionStyle} src={'/images/potions/potions(3).png'} /> <br/>
        <button type="button" onClick={() => props.createItem(1)}>purchase minor potion</button>
        <button type="button" onClick={() => props.createItem(2)}>purchase potion</button>
        <button type="button" onClick={() => props.createItem(3)}>purchase super potion</button><br/>
        <Button onClick={props.closeModal}>Exit Market</Button>
        </Modal>
    )
}


export default Market;
