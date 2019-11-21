import React from 'react';


function RenderCompanionImage (props){
    console.log(props.race);
    let imgPath = ''
    switch(props.race){
        case("Human"):
            imgPath = '/testImages/human.png'
            break;
        case("Orc"):
            imgPath = '/testImages/orc.png'
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


export default RenderCompanionImage;