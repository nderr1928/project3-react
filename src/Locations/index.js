import React, {Component} from 'react';
import NavBar from '../NavBar';
import {Button, Grid} from 'semantic-ui-react';
import Market from '../Market'
import Dungeon from '../Dungeon'

// const locationSelectionStyle = {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignContent: 'center'
// }

// const bodyStyle = {
//     backgroundImage: "url('/testImages/background.jpeg')", 
//     height: 100+'vh', 
//     width: 100+'vw',
//     backgroundRepeat: 'no-repeat',
//     backgroundSize: 'cover'
// }


class Locations extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            race: "",
            char_class: "",
            level: 0,
            experience: 0,
            health: 0,
            damage: 0,
            image: '',
            item_name: '',
            description: '',
            effect: '',
            marketModal: false,
            dungeonModal: false,
            gold: '',
            items: []
        }
    }
// Location Page
//  
    componentDidMount = async () => {
        await this.getUser();
        await this.getItems();
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
            // console.log("currentUser:", parsedUser);
            this.setState({
                gold: parsedUser.gold
            })

        } catch(err){
            // console.log(err);
            this.props.history.push('/')
        }
    }
    getItems = async () => {
        try{
            console.log('get items');
            const userId = localStorage.getItem('sessionUserId');
            const items = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/items/`, {
                method: "GET",
                credentials: 'include'
            });
            const parsedItems = await items.json()
            console.log(parsedItems.data)
            for(let i=0; i<parsedItems.data.length; i++){
                console.log(parsedItems.data[i].user.id)
                console.log(parsedItems.data[i].user.id == localStorage.getItem('sessionUserId'))
                if(parsedItems.data[i].user.id.toString() == localStorage.getItem('sessionUserId').toString()){
                    this.setState({
                        items: [...this.state.items, parsedItems.data[i]]
                    })
                    console.log(this.state.items)
                }
            }
        } catch(err){
            console.log(err)
            this.props.history.push('/')
        }
    }

    updateUser = async (id) => {
        const gold = this.state.gold
        console.log('gold amount:', gold)
        try{
            const editResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${id}/gold`, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify(gold),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } catch(err){
            console.log(err)
        }
    }

    createItem = async (item) => {
        if (item == 1) {  
            if (this.state.gold >= 10){          
                this.setState ({
                    item_name: 'Minor Health Potion',
                    description: 'Heals a small amount of health.',
                    effect: '1',

                    gold: this.state.gold-10
                })
            console.log('CREATTEITEM') 
            this.updateUser()
            this.getUser()
            const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
            const itemResponse = await fetch(itemUrl, 
            {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(this.state),
                headers: 
                {
                    'Content-Type': 'application/json'
                }
            });
                console.log("you got a minor potion!")
            } else {
                console.log("you do not have enough money for this item")
            }
        } else if (item == 2) {
            if (this.state.gold >= 10){   
                this.setState ({
                    item_name: 'Health Potion',
                    description: 'Heals a substantial amount of health.',
                    effect: '5',

                    gold: this.state.gold-15
                }) 
            this.updateUser()
            this.getUser()
            const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
            const itemResponse = await fetch(itemUrl, 
            {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(this.state),
                headers: 
                {
                    'Content-Type': 'application/json'
                }
            });                       
                console.log("you got a potion")
            } else {
                console.log("you do not have enough money for this item")
            }
        } else if (item == 3) {
            if (this.state.gold >= 20){   
                this.setState ({
                    item_name: 'Super Health Potion',
                    description: 'Heal a large amount of health.',
                    effect: '10',

                    gold: this.state.gold-20
                })    
                this.updateUser()
                this.getUser()  
                const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
                const itemResponse = await fetch(itemUrl, 
                {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(this.state),
                headers: 
                {
                    'Content-Type': 'application/json'
                }

            });                  
                console.log("you got a super potion")
            } else {
                console.log("you do not have enough money for this item")
            }
        }
    }
    openMarketModal = () => {
        this.setState({
            marketModal: true,
            dungeonModal: false
        })
    }
    closeMarketModal = () => {
        this.setState({
            marketModal: false,
            dungeonModal: false
        })
    }
    openDungeonModal = () => {
        this.setState({
            marketModal: false,
            dungeonModal: true
        })
    }
    closeDungeonModal = () => {
        this.setState({
            marketModal: false,
            dungeonModal: false
        })
    }
    render(){
        return(
            <React.Fragment>
                <NavBar />
                <Grid divided>
                    <Grid.Column>
                        <Grid.Row>
                            <Button type="button" onClick={this.openMarketModal}>Market</Button>
                        </Grid.Row>
                        <Grid.Row>
                            <Button type="button" onClick={this.openDungeonModal}>Dungeon</Button>
                        </Grid.Row>
                    </Grid.Column>
                    <Market open={this.state.marketModal} createItem={this.createItem} closeModal={this.closeMarketModal}/>
                    <Dungeon open={this.state.dungeonModal} closeModal={this.closeDungeonModal} userGold={this.state.gold} items={this.state.items} />

                </Grid>
            </React.Fragment>
        )
    }
}

export default Locations;
//Dungeon Route: 75% encounter Monster and 25% of encounter a Companion
    //Monster: 
        // Turn based battle system between your party and monster's party. 
    //Companion:
        // NPC is randomly generated and you can choose for randomly generated NPC
        //to join your party
//Market Route: 85% of going to market and 15% chance of encounter a Companion
    //Market
        //List all items in market, click a button and push item into inventory
    // Companion:
        //Same as above
