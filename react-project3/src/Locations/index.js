import React, {Component} from 'react';
import NavBar from '../NavBar';

class Locations extends Component{
    constructor(props){
        super(props);
        this.state = {
            party: [],
            monster: {},
            partyHealth: 0,
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
            effect: ''
        }
    }
// Location Page
// 
    pickLocation = async (LocationID) => { //1= Dungeon 2 = Market 
        const locationUrl = `${process.env.REACT_APP_API_URL}/api/v1/locations/${LocationID}/`;
        const locationResponse = await fetch(locationUrl, {
            method: 'GET',
            credentials: 'include'
        })
        const parsedLocation = await locationResponse.json();
        if (LocationID === 2){
            //this.props.history.push("/locations/2/")
            let dice = Math.random(); //roll a dice between 0 and 1
             if (dice < .75) {
                console.log("aaa a monster")
                this.encounterMonster();
             } else{
                console.log("you got a new friend")
                this.encounterCompanion();
             }
        }
        //Dungeon or Market
        if (LocationID === 1) {
            // this.props.history.push("/locations/1/")
            let dice=Math.random();
            if (dice <.85){
                //listMarketItem();
                console.log("going shopping")
            } else {
                //encounterCompanion();
                console.log("you got a new friend")
            }
        } 
    }
    setParty = async () => 
    {
        try{
            console.log('get party');
            const companions = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/companions/`, {
                method: "GET",
                credentials: 'include'
            });
            const parsedCompanions = await companions.json()
            console.log(parsedCompanions.data)
            for(let i=0; i<parsedCompanions.data.length; i++){
                console.log(parsedCompanions.data[i].user.id)
                console.log(parsedCompanions.data[i].user.id == localStorage.getItem('sessionUserId'))
                if(parsedCompanions.data[i].user.id.toString() == localStorage.getItem('sessionUserId').toString()){
                    this.setState({
                        party: [...this.state.party, parsedCompanions.data[i]]
                    })
                    console.log(this.state.party)
                }
            }
        } catch(err){
            console.log(err)
            this.props.history.push('/')
        }
    }
    encounterMonster = async () => 
    {
        let setParty = await this.setParty()
        console.log("monster encountered")
        console.log(this.state.party)
        let party = this.state.party
        let monster = this.state.monster
        console.log(party)
        let partyHealth = this.state.partyHealth
        console.log(partyHealth)
        for (let i=0; i< party.length; i++) {
            partyHealth = partyHealth + party[i].health
            console.log(partyHealth)
        }
        //fetch data from monster with location dungeon
        if (partyHealth < 20) {
            const rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/1/', {
                    credentials: 'include',
                    method: "GET"
                })
            const parsedMonster = await rawMonster.json()
            monster = parsedMonster
            console.log(monster)
        } else if (partyHealth >= 20 && partyHealth < 40) {
            const rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/2/', {
                    credentials: 'include',
                    method: "GET"
                })
            const parsedMonster = await rawMonster.json()
            monster = parsedMonster
            console.log(monster)
        } else {
            let rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/3/', {
                    credentials: 'include',
                    method: "GET"
                })
            const parsedMonster = await rawMonster.json()
            monster = parsedMonster
            console.log(monster)
        }
        
        while (monster.health != 0 && partyHealth != 0 ) 
        {   
            console.log('you are in the while loop')
            let monsterDice = Math.random()
            for (let i = 0 ; i < party.length; i++) 
            {
                let partyDice = Math.random()
                console.log(party[i])
                if (monsterDice > partyDice) 
                {
                    party[i].health = party[i].health - monster.damage
                    console.log("party member health", party[i].health)
                    if (party[i].health <= 0) 
                    {
                        console.log("has died", party[i])
                        party.splice(i,1)
                    }
                } else 
                {
                    monster.health = monster.health - party[i].damage 
                    console.log("monster health", monster.health)
                    if (monster.health <= 0) 
                    {
                        monster.health = 0
                    }
                }
                for (let i = 0; i<party.length; i++) 
                {
                    partyHealth = partyHealth + party[i].health
                    console.log("total partyHealth", partyHealth)
                }
                if (partyHealth <= 0)
                {
                    partyHealth = 0
                } 
            }
        }
        if (monster.health == 0) {
            console.log("you got gold and exp")
            this.setState({
                party: []
            })
            //gain experience and gold
        } else if (partyHealth == 0) {
            console.log("you have died")
            this.setState({
                party: []
            })
        }
        else {
            console.log("you are very, very lost")
            this.setState({
                party: []
            })
            //redirect home
        }
    }
    encounterCompanion = async () => {
        const randomName = await fetch('https://uinames.com/api/?amount=1')
        const parsedName = await randomName.json();
        console.log(parsedName)
        const arrRace = ['Human', 'Elf', 'Orc', 'Dwarf']
        const arrClass = ['Rogue', 'Warrior', 'Mage']
        this.setState ({
            name : parsedName.name,
            race : arrRace[Math.floor(Math.random() * 4)],
            char_class : arrClass[Math.floor(Math.random() * 3)],
            level : 1,
            experience : 0,
            health : 1 * 10,
            damage : 1,
            image : "nullstring"
        })
    }
    handleSubmit = async () => {
        const companionUrl = `${process.env.REACT_APP_API_URL}/api/v1/companions/`;
        const companionResponse = await fetch(companionUrl, 
        {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(this.state),
            headers: 
            {
                'Content-Type': 'application/json'
            }
        });
        console.log("companion added!")
    }
    encounterMarket = () => 
    {
        this.setState({
            market: true
        })
    }
    marketSubmit = async () => 
    {
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
        console.log("companion added!")
    }
    createItem = async (item) => {
        if (item == 1) {            
            this.setState ({
                item_name: 'Minor Health Potion',
                description: 'Heals a small amount of health.',
                effect: '1'
            })
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
        } else if (item == 2) {
            this.setState ({
                item_name: 'Health Potion',
                description: 'Heals a substantial amount of health.',
                effect: '5'
            }) 
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
        } else if (item == 3) {
            this.setState ({
                item_name: 'Super Health Potion',
                description: 'Heal a large amount of health.',
                effect: '10'
            })      
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
            console.log("item does not exist")
        }
    }
    render(){
        return(
            <React.Fragment>
                <NavBar />
                <h1>
                    You have reached main location page
                </h1>
                <button type="button" onClick={() => this.pickLocation(1)}>Market</button>
                <button type="button" onClick={() => this.pickLocation(2)}>Dungeon</button>
                <button type="button" onClick={() => this.handleSubmit()}>Add Companion</button>
                <button type="button" onClick={() => this.createItem(1)}>minor potion</button>
                <button type="button" onClick={() => this.createItem(2)}>potion</button>
                <button type="button" onClick={() => this.createItem(3)}>super potion</button>
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
