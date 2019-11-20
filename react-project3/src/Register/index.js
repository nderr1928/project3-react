import React, {Component} from 'react';
import {Form, Button, Label, Message, Card, Header} from 'semantic-ui-react';

class Registration extends Component{
    constructor(){
        super();
        this.state = {
            email: "",
            displayName: "",
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
        const registrationUrl = `${process.env.REACT_APP_API_URL}/api/v1/users/register`;
        const registerResponse = await fetch(registrationUrl, {
            method: "POST",
            body: JSON.stringify(this.state),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const parsedResponse = await registerResponse.json();

        if(parsedResponse.status.code === 201){
            console.log(parsedResponse);
            localStorage.setItem('sessionUserId', parsedResponse.data.id)
            this.props.history.push('/create')
        } else{
            this.setState({
                errorMsg: parsedResponse.status.message
            })
        }
    }
    render(){
        return(
            <Card centered>
                <Card.Content>
                    <Header>Registration</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Label>Email</Label>
                        <Form.Input name="email" value={this.state.email} type="email" onChange={this.handleChange}/>
                        <Label>Display Name</Label>
                        <Form.Input name="displayName" value={this.state.displayName} type="text" onChange={this.handleChange} />
                        <Label>Password</Label>
                        <Form.Input name="password" value={this.state.password} type="password" onChange={this.handleChange}/>
                        <Button color="green" >Register</Button>
                        {this.state.errorMsg ? <Message negative>{this.state.errorMsg}</Message> : null}
                    </Form>
                </Card.Content>
            </Card>
        )
    }
}


export default Registration;