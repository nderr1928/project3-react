import React from 'react';
import {Modal, Button, Header} from 'semantic-ui-react';
import Log from '../Log'

const modalStyle = {
    // backgroundImage: 'url(/testImages/background.jpeg)',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    height: 75+'vh',
    width: 100+'%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    margin: 0
}

const buttonStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    margin: 0
}

// Global variables
let party = [];
let monster = {};
let partyHealth = 0;
let partyAttack = 0;
let id;
let enemyExp;
let enemyGold;
let accumulatedExp = 0;
let accumulatedGold = 0;

const setParty = async () => {
    try{
        console.log('1');
        const companions = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/companions/`, {
            method: "GET",
            credentials: 'include'
        });
        console.log('2')
        const parsedCompanions = await companions.json()
        console.log("3", parsedCompanions.data)
        console.log('4')
        for(let i=0; i<parsedCompanions.data.length; i++){
            console.log("4a",i, parsedCompanions.data[i].user.id)
            console.log("4b", i, parsedCompanions.data[i].user.id.toString() === localStorage.getItem('sessionUserId').toString())
            if(parsedCompanions.data[i].user.id.toString() === localStorage.getItem('sessionUserId').toString()){
                party.push(parsedCompanions.data[i])
                console.log("4c", i, party)
            }
        }
    } catch(err){
        console.log(err, "on setPartyRoute");
        // this.props.history.push('/')
    }
}


class Dungeon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            battle: false,
            start: true,
            companionEncounter: false,
            playerTurn: false,
            logStrings: [],
            randomCompanion: {
                name : '',
                race : '',
                char_class : '',
                level : '',
                experience : '',
                health : '',
                damage : '',
                image : ''
            },
            enemyHealth: '',
            partyHealth: '',
            totalPartyHealth: '',
            partyAttack: ''
        }
    }
    componentDidMount = async () => {
        await setParty();
        await this.partyHealthCalc();
        await this.partyAttackCalc();
    }
    partyHealthCalc = () => {
        console.log("5");
        for (let i = 0; i<party.length; i++) {
            console.log('5a', i)
            partyHealth = partyHealth + party[i].health
            console.log("total partyHealth at iteration", i, ";", partyHealth)
        }
        this.setState ({
            totalPartyHealth: partyHealth,
            partyHealth: partyHealth
        })
        console.log("6, total party health:", partyHealth);
    }
    partyAttackCalc = () => {
        console.log("5");
        for (let i = 0; i<party.length; i++) {
            console.log('5a', i)
            partyAttack = partyAttack + party[i].damage
            console.log("total partyAttack at iteration", i, ";", partyAttack)
        }
        this.setState ({
            partyAttack: partyAttack
        })
        console.log("6, total party health:", partyAttack);
    }
    clearLog = async () => {
        await this.setState({
            logStrings: []
        })
        console.log('logCleared');
    }
    appendString = async (string) => {
        await this.setState({
            logStrings: [...this.state.logStrings, string]
        })
    }
    randomizeEvent = () => {
        let dice = Math.random(); //roll a dice between 0 and 1
        if (dice < 0.75) {
            console.log("aaa a monster")
            if (this.state.totalPartyHealth < 20) {
                id = 1 
                enemyGold = 40;
                enemyExp = 10;
                console.log(id)
            } else if (this.state.totalPartyHealth >= 20 && this.state.totalPartyHealth < 40) {
                id = 2;
                enemyGold = 80;
                enemyExp = 20;
                console.log(id)
            } else {
                id = 3;
                enemyGold = 160;
                enemyExp = 40;
                console.log(id)
            }
            this.setState({
                start: false,
                battle: true,
                companionEncounter: false
            })
            this.encounterMonster(id);
        } else{
            this.setState({
                start: false,
                battle: false,
                companionEncounter: true
            })
            this.encounterCompanion();
            console.log("you got a new friend")
            // this.encounterCompanion();
        }
    }
    encounterMonster = async (id) => {
        console.log("7");
        let rawMonster = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/monsters/${id}/`, {
            credentials: 'include',
            method: "GET"
        })
        console.log('8');
        let parsedMonster = await rawMonster.json()
        console.log('9')
        monster = parsedMonster
        this.setState({
            enemyHealth: monster.health
        })
        console.log("10", monster);
        const string = `An aggresive ${monster.mons_type} approaches the party.`;
        console.log(string);
        this.appendString(string);
        this.attackRandomizer();
    }
    attackRandomizer = async () => {
        const dice = Math.random(); //roll a dice between 0 and 1
        if (dice < 0.50) {
            const string = `The enemy attacks first!`
            this.appendString(string);
            this.enemyAttack();
        } else{
            const string = `The party attacks first!`
            this.appendString(string);
            console.log("party attacks first")
            this.setState({
                playerTurn: true
            })
        }
    }
    enemyAttack = async () => {
        const string = await `The enemy deals ${monster.damage} point(s) of damage to the party.`
        await this.appendString(string);
        if(this.state.partyHealth <= 0 ){
            await this.partyDeath();
        } else{
            await this.setState({
                playerTurn: true,
                partyHealth: this.state.partyHealth - monster.damage
            })
            const string1 = await `It is your turn to attack.`
            await this.appendString(string1);
        }
    }
    partyDeath = () => {
        console.log('party died');
    }
    partyAttack = async () => {
        if(this.state.playerTurn === true){
            const string = `The party deals ${monster.damage} point(s) of damage to the monster.`
            this.appendString(string);
            if(this.state.enemyHealth - this.state.partyAttack <= 0){
                await this.setState({
                    enemyHealth: 0
                })
            } else{
                await this.setState({
                    enemyHealth: this.state.enemyHealth - this.state.partyAttack
                })
            }
            console.log(this.state.enemyHealth);
            if(this.state.enemyHealth <= 0 ){
                await this.enemyDeath();
            } else{
                await this.setState({
                    playerTurn: false
                })
                await this.enemyAttack();
            }
        }
    }
    enemyDeath = async () => {
        const string1 = `The ${monster.mons_type} has been slain!`
        this.appendString(string1);
        const string2 = `You have earned ${enemyExp} exp points and ${enemyGold} gold.`
        this.appendString(string2);
        console.log('enemy died');
        accumulatedExp += enemyExp;
        console.log(accumulatedExp);
        accumulatedGold += enemyGold;
        console.log(accumulatedGold);
        this.setState({
            start: true,
            battle: false,
            companionEncounter: false
        })
    }
    encounterCompanion = async () => {
        const randomName = await fetch('https://uinames.com/api/?amount=1')
        const parsedName = await randomName.json();
        console.log(parsedName)
        const arrRace = ['Human', 'Elf', 'Orc', 'Dwarf']
        const arrClass = ['Rogue', 'Warrior', 'Mage']
        this.setState ({
            randomCompanion: {
                name : parsedName.name,
                race : arrRace[Math.floor(Math.random() * 4)],
                char_class : arrClass[Math.floor(Math.random() * 3)],
                level : 1,
                experience : 0,
                health : 1 * 10,
                damage : 1,
                image : "nullstring"
            }
        })
        const string = `You are approched by a ${this.state.randomCompanion.race} ${this.state.randomCompanion.char_class} named ${this.state.randomCompanion.name}. They want to join your party. Will you accept or deny them?`
        console.log(string)
        this.appendString(string);
    }
    companionJoin = async () => {
        const companionUrl = `${process.env.REACT_APP_API_URL}/api/v1/companions/`;
        const companionResponse = await fetch(companionUrl, {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(this.state.randomCompanion),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const string = `You have accepted ${this.state.randomCompanion.name}, the ${this.state.randomCompanion.race} ${this.state.randomCompanion.char_class} into your party! They will join you on your next expedition.`
        this.appendString(string);
        console.log("companion added!")
        this.setState({
            battle: false,
            start: true,
            companionEncounter: false
        })
    }
    companionReject = () => {
        const string = `You have declined ${this.state.name}'s request to join. They walk away looking disappointed.`
        this.appendString(string);
        this.setState({
            battle: false,
            start: true,
            companionEncounter: false
        })
    }
    collect = () => {
        this.gainGold(localStorage.getItem('sessionUserId'));
        this.setState({
            logStrings: []
        })
        const string = `You have earned ${accumulatedGold} and ${accumulatedExp} exp points.`
        this.appendString(string)
        accumulatedGold = 0
        accumulatedExp = 0

    }
    gainGold = async (id) => {
        const gold = this.props.userGold + accumulatedGold;
        console.log('gold amount:', gold)
        console.log(typeof(gold));
        // try{
        //     const editResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${id}/gold`, {
        //         method: 'PATCH',
        //         credentials: 'include',
        //         body: JSON.stringify(gold),
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        // } catch(err){
        //     console.log(err)
        // }
    }
    render(){
        return(
            <Modal open={this.props.open}>
                <Header style={{height: 40+'px', padding: 0}}>
                    {this.state.start ? <Button onClick={this.props.closeModal} color='red' floated='left'>Exit Dungeon</Button> : null}
                    {this.state.start ? <Button color='yellow' floated='right' onClick={this.collect}>Collect</Button> : null}
                </Header>
                <div style={{borderTop: '2px black solid',borderBottom: '2px black solid', display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
                    <h1 style={{margin: 0}}>Party Health: {this.state.partyHealth}</h1>
                    {this.state.start ? <h1 style={{margin: 0}}>Dungeon</h1> : null}
                    {this.state.battle ? <h1 style={{margin: 0}}>Enemy Health: {this.state.enemyHealth}</h1> : null}
                    {this.state.companionEncounter ? <h1 style={{margin: 0}}>Companion Encounter</h1> : null}
                </div>
                <div style={modalStyle}>
                    <Log log={this.state.logStrings} clearLog={this.clearLog} />
                </div>
                <div style={buttonStyle}>
                    {this.state.start ? <Button onClick={this.randomizeEvent} style={{height: 10+'%', minHeight: 50+'px', margin: 'auto'}} color='blue'>Explore</Button> : null}
                    {this.state.battle ? <Button style={{height: 10+'%', minHeight: 50+'px', margin: 'auto'}} onClick={this.partyAttack}>Attack</Button>  : null}
                    {this.state.battle ? <Button style={{height: 10+'%', minHeight: 50+'px', margin: 'auto'}}>Item</Button>  : null}
                    {this.state.companionEncounter ? <Button style={{height: 10+'%', minHeight: 50+'px', margin: 'auto'}} onClick={this.companionJoin} color='green'>Accept</Button>  : null}
                    {this.state.companionEncounter ? <Button style={{height: 10+'%', minHeight: 50+'px', margin: 'auto'}} onClick={this.companionReject} color="red">Deny</Button>  : null}
                </div>
            </Modal>
        )
    }
}

export default Dungeon;


// import React from 'react';
// function Dungeon(props){
//     constructor(props){
//     super(props);
//     this.state = {
//         party: [],
//         monster: {},
//         items: [],
//         partyHealth: 0,
//         name: "",
//         race: "",
//         char_class: "",
//         level: 0,
//         experience: 0,
//         health: 0,
//         damage: 0,
//         image: '',
//         updatedCompanion: {
//             name: "",
//             race: "",
//             char_class: "",
//             level: 0,
//             experience: 0,
//             health: 0,
//             damage: 0,
//             image: '',
//             },
//         item_name: '',
//         description: '',
//         effect: '',
//         gold: ''
//         }
//     }
//     let charCounter = 0
//     let char = {}
//     let game = {
//         monsterCounter: 0,
//         partyCounter: 0,
//         partyHealth: 0,
//     }
//     //This function tests to see if user clicked market location or dungeon location
//     //Also where out random companion events happen
//     pickLocation = async (LocationID) => { 
//         const locationUrl = `${process.env.REACT_APP_API_URL}/api/v1/locations/${LocationID}/`;
//         const locationResponse = await fetch(locationUrl, {
//             method: 'GET',
//             credentials: 'include'
//         })
//         const parsedLocation = await locationResponse.json();
//         // _____ D u n g e o n ______
//         if (LocationID === 2){
//             let dice = Math.random(); //roll a dice between 0 and 1
//             if (dice < .75) {
//                 console.log("aaa a monster")
//                 this.encounterMonster();
//             } else{
//                 console.log("you got a new friend")
//                 this.encounterCompanion();
//             }
//         }
//         // ______ M a r k e t ______
//         if (LocationID === 1) {
//             let dice=Math.random();
//             if (dice <.85){
//                 //this is where you will list items which you can purchase
//                 console.log("going shopping")
//             } else {
//                 encounterCompanion();
//                 console.log("you got a new friend")
//             }
//         } 
//     }
//     // Dungeon
//     encounterMonster = () => {
//         //partyCounter and monsterCounter logs when either party or monster has died
//         setMonster();
//         while (game.partyCounter == game.monsterCounter)
//         {   
//             console.log('you are in the while loop')
//             // Setting current character to next character in our array,
//             // a really fancy for loop which allows for editing of the individual character
//             // more than likely overkill, but you can mess with it as you will
//             setChar();
//             //Roll a die to see if charcter or monster goes first
//             let monsterDice = Math.random()
//             let partyDice = Math.random()
//             if (monsterDice > partyDice) 
//             //Monster rolled higher, therefore monster attacks first
//             {
//                 //monster attack and character takes damage here boiiii
//                 console.log(monster.damage, char.health)
//                 charDamage();
//                 console.log("party member health", char.health)
//                 if (char.health <= 0) 
//                 {
//                     //Checking to see if currently assigned character has died
//                     checkDeath();
//                 } else {
//                     //Monster takes damage, Character goes second
//                     monsterDamage();
//                     // ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! 
//                     //____________USER INPUT FUNCTION HERE ___________
//                     // user should be able to use item, attack, or run
//                     // monsterDamage, in this case, would be the attack
//                     console.log("monster health", monster.health)
//                     if (monster.health <= 0) 
//                     {
//                         //Monster death
//                         game.monsterCounter++
//                     }
//                 }
//             } else {
//                 //Character goes first
//                 //Monster takes damage, Character goes second
//                 monsterDamage();
//                 // ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! 
//                 //____________USER INPUT FUNCTION HERE ___________
//                 // user should be able to use item, attack, or run
//                 // monsterDamage, in this case, would be the attack
//                 console.log("monster health", monster.health)
//                 if (monster.health <= 0) 
//                 {
//                     //Monster has F A L L E N 
//                     game.monsterCounter++
//                 } else {
//                     //Selected character takes damage
//                     charDamage();
//                 }
//             }
//             partyHealth();
//             if (partyHealth <= 0)
//             {
//                  game.partyCounter++
//             } 
//         }
//         //I don't know why we are adding this here, but I am keeping it because
//         //I have a feeling Earlier-In-The-Day Jordan had a idea that current Jordan forgot
//         game.monsterCounter++
//         game.partyCounter++
//         }
//         //setting monster my dude
//         setMonster = async (id) => {
//             if (partyHealth < 20) {
//                 const rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/1/', {
//                         credentials: 'include',
//                         method: "GET"
//                     })
//                 const parsedMonster = await rawMonster.json()
//                 this.setState({
//                     monster = parsedMonster
//                     )}
//                 console.log(monster)
//             } else if (partyHealth >= 20 && partyHealth < 40) {
//                 const rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/2/', {
//                         credentials: 'include',
//                         method: "GET"
//                     })
//                 const parsedMonster = await rawMonster.json()
//                 this.setState({
//                     monster = parsedMonster
//                     )}
//                 console.log(monster)
//             } else {
//                 let rawMonster = await fetch(process.env.REACT_APP_API_URL + '/api/v1/monsters/3/', {
//                         credentials: 'include',
//                         method: "GET"
//                     })
//                 const parsedMonster = await rawMonster.json()
//                 this.setState({
//                     monster = parsedMonster
//                     )}
//                 console.log(monster)
//             }
//         }
//         setChar = () => {
//             if (charCounter<party.length){
//                 char = party[charCounter]
//                 charCounter++
//             } else {
//                 charCounter = 0
//             }
//         }
//         charDamage = () => {
//             char.health = char.health - monster.damage
//             party[charCounter] = char
//         }
//         //Check for death of individual party members. Death does not permenently kill a character,
//         //they just can no longer participate in the battle and will not gain XP
//         checkDeath = () => {
//             for (let i = 0; i<party.length; i++) 
//             {
//                 if(party[i].health <= 0){
//                     console.log("has died", party[i])
//                     party.splice(i,1)
//                 }
//             }
//         }
//         //Monster taking damage
//         monsterDamage = () => {
//             monster.health = monster.health - char.damage
//         }
//         //Total health of party to test when party has been defeated.
//         partyHealth =() => {
//             for (let i = 0; i<party.length; i++) 
//             {
//                 game.partyHealth = partyHealth + party[i].health
//                 console.log("total partyHealth", partyHealth)
//             }
//         }
//         //Function for user to get gold after defeating monsters
//         gainGold = () => {
//             // ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! 
//             //____STILL NEEED TO EDIT USER IN DATABASE TO INCLUDE THIS AMOUNT OF GOLD___
//             this.setState({gold: (monster.damage)})
//         }
//         //Function to gain experience after defeating monsters
//         //Calls to update character after it has run
//         //Within a for loop in main game logic to loop through all characters,
//         // if issues with updating occures, this is where its going to be
//         gainExperience = (char) => {
//             this.setState({
//                 updatedCompanion: {
//                     name: char.name,
//                     race: char.race,
//                     char_class: char.char_class,
//                     level: char.level,
//                     experience: char. experience + monster.damage,
//                     health: char.health,
//                     damage: char.damage,
//                     image: char.image
//                         }
//                     })
//             updateChar()
//         }
// //         //Put edited character, with new XP, into our database
//         updateChar = () => {
//             try {
//                 const editItemUrl = `${process.env.REACT_APP_API_URL}/api/v1/companions/${this.state.charToEdit.id}/`;
//                 const editResponse = await fetch(editItemUrl, {
//                     method: 'PATCH',
//                     credentials: 'include', //cookies
//                     body: JSON.stringify(this.state.charToEdit),
//                     headers: {
//                     'Content-Type': 'application/json'
//                     }
//                 });
//                 const editResponseParsed = await editResponse.json();
//                 console.log(editResponseParsed, ' parsed edit')
//                 const newPartyArrayWithEdit = this.state.char.map((char) => {
//                     if(char.id === editResponseParsed.data.id){
//                         char = editResponseParsed.data
//                     }
//                     return char
//                 });
//                 this.setState({
//                     party: newCharArrayWithEdit
//                 });
//             } catch(err){
//                 console.log(err)
//             }
//         }
//         //Logic for encountering a companion
//         encounterCompanion = async () => {
//             const randomName = await fetch('https://uinames.com/api/?amount=1')
//             const parsedName = await randomName.json();
//             console.log(parsedName)
//             const arrRace = ['Human', 'Elf', 'Orc', 'Dwarf']
//             const arrClass = ['Rogue', 'Warrior', 'Mage']
//             this.setState ({
//                 name : parsedName.name,
//                 race : arrRace[Math.floor(Math.random() * 4)],
//                 char_class : arrClass[Math.floor(Math.random() * 3)],
//                 level : 1,
//                 experience : 0,
//                 health : 1 * 10,
//                 damage : 1,
//                 image : "nullstring"
//             })
//         }
//         // Create the companion which is set in the previous encounter
//         // This should be the onSubmit of the encounterCompanion event
//         companionHandleSubmit = async () => {
//             const companionUrl = `${process.env.REACT_APP_API_URL}/api/v1/companions/`;
//             const companionResponse = await fetch(companionUrl, {
//                 method: "POST",
//                 credentials: 'include',
//                 body: JSON.stringify(this.state),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             console.log("companion added!")
//         }
//         //"Use Item" Functionality, allows user to use items if clicked during battle
//         UseItem = async (id) => {
//             //This id will be the id of the item clicked 
//             //Heal character for the effect of the item
//             char.health = char.health + item.effect 
//             //Remove item from user's inventory
//             const deleteditem = await fetch(process.env.REACT_APP_API_URL + '/api/v1/items/' + id +'/', {
//               method: 'DELETE',
//               credentials: 'include' 
//             });
//             const deleteItemParsed = await deleteItemResponse.json();
//             console.log(deleteItemResponse)
//             if (deleteItemParsed.status.code === 200) {
//               console.log(deleteItemParsed, ' response from Flask server')
//               this.setState({items: this.state.item.filter((item) => item.id !== id )})
//             } else {
//               console.log(deleteItemParsed.status.message);
//             }
//         }
        
//         //Get all items associated with the user and set items to this array
//         getItems = async (id) => {
//             try{
//                 console.log('get items');
//                 const items = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/items/`, {
//                     method: "GET",
//                     credentials: 'include'
//                 });
//                 const parsedItems = await items.json()
//                 console.log(parsedItems.data)
//                 for(let i=0; i<parsedItems.data.length; i++){
//                     console.log(parsedItems.data[i].user.id)
//                     console.log(parsedItems.data[i].user.id == localStorage.getItem('sessionUserId'))
//                     if(parsedItems.data[i].user.id.toString() == localStorage.getItem('sessionUserId').toString()){
//                         this.setState({
//                             items: [...this.state.items, parsedItems.data[i]]
//                         })
//                         console.log(this.state.items)
//                     }
//                 }
//             } catch(err){
//                 console.log(err)
//                 this.props.history.push('/')
//             }
//         }
        
//         // Market
//     //Loop through characters in a way which allows each one to individually be called
//     //so they can be edited
    
    
    
//     //Reset for each game 
//     resetBoard = () => {
//         game.partyCounter = 0
//         game.monsterCounter = 0
//     }
//     //Character taking damage and updating both the selected character and selected
//     //character in our party array
    
    
//     //___________M A I N    G A M E    L O G I C _______________
    
//         //________ O U T S I D E   O F   W H I L E   L O O P ________
//         //Whoever's team has more points on their counters looses
//         if (game.partyCounter > game.monsterCounter) {
//             console.log("you have died")
//         }
//         if (game.partyCounter < game.monsterCounter) {
//             console.log("you have defeated the monster")
//             //a for loop that I am not sure is working yet, it is here to make sure all
//             //characters still alive get XP
//             for (let i = 0; i < party.length; i++)
//             {
//             gainExperience(char)
//             setChar()
//             }
//         //Main user gets golds 
//         gainGold()
//     }
//     //Buying items logic. really just creating items each time you click a thingy thing 
//     createItem = async (item) => {
//         if (item == 1) {            
//             this.setState ({
//                 item_name: 'Minor Health Potion',
//                 description: 'Heals a small amount of health.',
//                 effect: '1'
//             })
//         const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
//         const itemResponse = await fetch(itemUrl, 
//         {
//             method: "POST",
//             credentials: 'include',
//             body: JSON.stringify(this.state),
//             headers: 
//             {
//                 'Content-Type': 'application/json'
//             }
//         });
//             console.log("you got a minor potion!")
//         } else if (item == 2) {
//             this.setState ({
//                 item_name: 'Health Potion',
//                 description: 'Heals a substantial amount of health.',
//                 effect: '5'
//             }) 
//         const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
//         const itemResponse = await fetch(itemUrl, 
//         {
//             method: "POST",
//             credentials: 'include',
//             body: JSON.stringify(this.state),
//             headers: 
//             {
//                 'Content-Type': 'application/json'
//             }
//         });                       
//             console.log("you got a potion")
//         } else if (item == 3) {
//             this.setState ({
//                 item_name: 'Super Health Potion',
//                 description: 'Heal a large amount of health.',
//                 effect: '10'
//             })      
//         const itemUrl = `${process.env.REACT_APP_API_URL}/api/v1/items/`;
//         const itemResponse = await fetch(itemUrl, 
//         {
//             method: "POST",
//             credentials: 'include',
//             body: JSON.stringify(this.state),
//             headers: 
//             {
//                 'Content-Type': 'application/json'
//             }
//         });                  
//             console.log("you got a super potion")
//         } else {
//             console.log("item does not exist")
//         }
//     }   
//     render()
//     {
//         return(
//             <React.Fragment>
//                 <NaBar />
//                     <h1>
//                         You have reached main location page
//                     </h1>
//                     <button type="button" onClick={() => this.pickLocation(1)}>Market</button>
//                     <button type="button" onClick={() => this.pickLocation(2)}>Dungeon</button>
//                     <button type="button" onClick={() => this.companionHandleSubmit()}>Add Companion</button>
//                     <button type="button" onClick={() => this.createItem(1)}>minor potion</button>
//                     <button type="button" onClick={() => this.createItem(2)}>potion</button>
//                     <button type="button" onClick={() => this.createItem(3)}>super potion</button>
//                 </React.Fragment>
//             )
//     }
// }
// export default Dungeon
