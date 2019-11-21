import React, {Component, Fragment} from 'react';
import NavBar from '../NavBar';
import PartyMembers from '../PartyMembers';
import {Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'

class Profile extends Component{
    constructor(){
        super();
        this.state = {
            companions: [],
            gold: ''
        }
    }
    componentDidMount(){
        this.getUser();
        this.getCompanions();
    }
    getUser = async () => {
        try{
            // console.log("get user function");
            const userId = localStorage.getItem('sessionUserId');
            const user = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${userId}`, {
                credentials: 'include',
                method: "GET"
            })

            const parsedUser = await user.json()
            console.log("currentUser:", parsedUser);
            this.setState({
                gold: parsedUser.gold
            })

        } catch(err){
            console.log(err);
            this.props.history.push('/')
        }
    }
    getCompanions = async () => {
        try{
            console.log('get companions function');
            const companions = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/companions/`, {
                method: "GET",
                credentials: 'include'
            });

            const parsedCompanions = await companions.json()

            console.log(parsedCompanions.data)

            for(let i=0; i<parsedCompanions.data.length; i++){
                console.log(parsedCompanions.data[i].user.id)
                console.log(parsedCompanions.data[i].user.id === localStorage.getItem('sessionUserId'))
                if(parsedCompanions.data[i].user.id.toString() === localStorage.getItem('sessionUserId').toString()){
                    this.setState({
                        companions: [...this.state.companions, parsedCompanions.data[i]]
                    })
                }
            }
            console.log(this.state.companions);

        } catch(err){
            console.log(err)
            this.props.history.push('/')
        }
    }
    render(){
        return(
            <Fragment>
                <NavBar />
                <h1>Profile</h1>
                <h1>Gold: {this.state.gold}</h1>
                <Link to="/create">
                    <Button>Create new companion</Button>
                </Link>
                <PartyMembers companions={this.state.companions} />
            </Fragment>
        )
    }
}

export default Profile;