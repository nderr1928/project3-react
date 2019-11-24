import React, {Component} from 'react'
import { Form, Card, Label, Header, Button} from 'semantic-ui-react'

class MonsterCreation extends Component{
    constructor(){
        super();
        this.state = {
            mons_type: "",
            level: "",
            health: "",
            damage: '',
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
        console.log(e.currentTarget.value)
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const monsterUrl = `${process.env.REACT_APP_API_URL}/api/v1/monsters/`;
        const monsterResponse = await fetch(monsterUrl, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const parsedResponse = await monsterResponse.json()

        if(parsedResponse.status.code === 201){
            this.props.history.push('/home')
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
                    <Header>Character Creation</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Label>Name</Label>
                        <Form.Input name="mons_type" value={this.state.name} type="text" onChange={this.handleChange}/>
                        <Label>Level</Label>
                        <Form.Input name="level" value={this.state.name} type="text" onChange={this.handleChange}/>
                        <Label>Health</Label>
                        <Form.Input name="health" value={this.state.health} type="number" onChange={this.handleChange}/>
                        <Label>Damage</Label>
                        <Form.Input name="damage" value={this.state.damage} type="number" onChange={this.handleChange}/>
                        <Button color="green" type='submit'>Create</Button>
                    </Form>
                </Card.Content>
            </Card>
        )
    }
}

export default MonsterCreation;