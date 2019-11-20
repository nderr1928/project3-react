import React, {Component, Fragment} from 'react';
import NavBar from '../NavBar'

class Profile extends Component{
    render(){
        return(
            <Fragment>
                <NavBar />
                <h1>Profile</h1>
            </Fragment>
        )
    }
}

export default Profile;