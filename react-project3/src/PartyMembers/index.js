import React from 'react';
import {Card} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

function PartyMembers(props){
    console.log(props.companions)
    const companions = props.companions.map((companion) => {
        return(
            <Link to={`/companion/${companion.id}`} style={{color:"black"}}>
                <Card key={companion.id}>
                    <Card.Header>{companion.name}, {companion.level}</Card.Header>
                    <Card.Content>
                        <Card.Description>{companion.race}</Card.Description>
                        <Card.Description>{companion.char_class}</Card.Description>
                    </Card.Content>
                </Card>
            </Link>
        )
    })
    return(
        <Card.Group>
            {companions}
        </Card.Group>
    )
}

export default PartyMembers