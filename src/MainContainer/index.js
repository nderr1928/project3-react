import React, {Component} from 'react';
// import {Header} from 'semantic-ui-react';
import NavBar from '../NavBar';
// import CreateMonster from '../CreateMonster';


class MainContainer extends Component{
    constructor(){
        super();
        this.state = {
            currentUser: []
        }
    }
    componentDidMount(){
        this.getUser();
    }
    getUser = async () => {
        try{
            // console.log("get user function");
            const userId = localStorage.getItem('sessionUserId');
            // console.log(userId);
            const user = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`, {
                credentials: 'include',
                method: "GET"
            })

            const parsedUser = await user.json()
            // console.log("currentUser:", parsedUser);
            this.setState({
                currentUser: parsedUser
            })

        } catch(err){
            console.log(err);
            this.props.history.push('/')
        }
    }
    render(){
        return(
            <React.Fragment>
                <NavBar />
                <h1>
                    Welcome {this.state.currentUser.display_name}
                </h1>
                {/* <CreateMonster /> */}
            </React.Fragment>
        )
    }
}


export default MainContainer;