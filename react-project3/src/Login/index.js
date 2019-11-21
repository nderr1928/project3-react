import React, {Component} from 'react';
import { Form, Label, Button, Card, Message, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom'

const style = {

}

class Login extends Component{
	constructor(){
		super();
		this.state = {
			email: "",
			password: ""
		}
	}
	handleChange = (e) => {
		this.setState({
			[e.currentTarget.name]: e.currentTarget.value
		})
	}
	handleSubmit = async (e) => {
        e.preventDefault();
        const loginUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/login`;
        const loginResponse = await fetch(loginUrl, {
            method: "POST",
            body: JSON.stringify(this.state),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const parsedResponse = await loginResponse.json();
		console.log(parsedResponse);

        if(parsedResponse.status.code === 200){
			console.log(parsedResponse.data.id)
			localStorage.setItem('sessionUserId', parsedResponse.data.id)
			this.props.history.push('/home')
        } else{
            this.setState({
                errorMsg: parsedResponse.status.message
            })
        }
    }
	render(){
		return(
			<Card centered style={{justifyContent: "center"}, {alignContent: 'center'}, {display: 'grid'}, {background: "linear-gradient(white, black)"}}>
				<Card.Content>
					<Header centered="true">Login</Header>
					<Form onSubmit={this.handleSubmit}>
						<Label>Email</Label>
						<Form.Input name="email" value={this.state.email} type="email" onChange={this.handleChange}/>
						<Label>Password</Label>
						<Form.Input name="password" value={this.state.password} type="password" onChange={this.handleChange}/>
						<Button color="green">Login</Button>
						{this.state.errorMsg ? <Message negative>{this.state.errorMsg}</Message> : null}
						{/* {this.props.location.state.loggedout ? <Message positive>{this.props.location.state.msg }</Message> : null} */}
					</Form>
				</Card.Content>
				<Card.Content>
					<Label>Not a member? Sign up now!</Label>
					<Link to="/register">
						<Button color="blue">Create Account</Button>
					</Link>
				</Card.Content>
			</Card>
		)
	}
}


export default Login;