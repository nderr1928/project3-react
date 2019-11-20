import React, {Component} from 'react';
// import {Header} from 'semantic-ui-react';
import NavBar from '../NavBar';


class MainContainer extends Component{
    constructor(){
        super();
    }
    render(){
        return(
            <React.Fragment>
                <NavBar />
                <h1>
                    Home page
                </h1>
            </React.Fragment>
        )
    }
}


export default MainContainer;