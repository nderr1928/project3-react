import React, {Component} from 'react';
import {Menu, Header, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class NavBar extends Component{
    constructor(){
        super();
        this.state = {
            active: ""
        }
    }
    handleNav = async (e) => {
        console.log(e.target);
        await this.setState({
            active: e.currentTarget.value
        })
        console.log(this.state.active);
    }
    render(){
        return(
            <Header>
                <Menu pointing secondary>
                    <Menu.Item name="home" active={this.state.active==="home"}>
                        <Link to="/home">
                            <Button value="home" onClick={this.handleNav}>Home</Button>
                        </Link>
                    </Menu.Item>
                    <Menu.Item name="profile" value="profile" active={this.state.active==="profile"}>
                        <Link to="/profile" value="profile">
                            <Button value="profile" onClick={this.handleNav}>Profile</Button>
                        </Link>
                    </Menu.Item>
                    <Menu.Item name="locations" active={this.state.active==="locations"}>
                        {/* <Link to="/locations"> */}
                            <Button value="locations" onClick={this.handleNav}>Locations</Button>
                        {/* </Link> */}
                    </Menu.Item>
                    <Menu.Item position="right">
                        {/* <Link to="/"> */}
                            <Button value="logout" onClick={this.handleNav}>Logout</Button>
                        {/* </Link> */}
                    </Menu.Item>
                </Menu>
            </Header>
        )
    }
}


export default NavBar;