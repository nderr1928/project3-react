import React from 'react';


function ShowCompanion (props){
    console.log(props.race);
    let imgPath = ''
    switch(props.race){
        case("Human"):
            imgPath = '/testImages/human.png'
            break;
        default:
            imgPath = '/testImages/default.gif'
            break;
    }
    console.log(imgPath);
    return(
        <img src={imgPath} />
    )
}


export default ShowCompanion;