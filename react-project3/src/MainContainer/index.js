import React, {Component} from 'react';
// import {Header} from 'semantic-ui-react';
import NavBar from '../NavBar';


class MainContainer extends Component{
    constructor(){
        super();
        this.state = {
            displayName: ""
        }
    }
    componentDidMount(){
        this.getUser();
    }
    getUser = async () => {
        try{
            const userId = localStorage.getItem('sessionUserId');
            const user = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`, {
                credentials: 'include',
                method: "GET"
            })

            const parsedUsers = await user.json()
            
            this.setState({

            })

        } catch(err){
            console.log(err);
        }
    }
    render(){
        return(
            <React.Fragment>
                <NavBar />
                <h1>
                    Welcome {this.state.displayName}
                </h1>
            </React.Fragment>
        )
    }
}


export default MainContainer;