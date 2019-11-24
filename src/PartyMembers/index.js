import React from 'react';
import {Card, Button} from 'semantic-ui-react';

function PartyMembers(props){
    // console.log(props.companions)
    const companions = props.companions.map((companion) => {
        return(
            <Card key={companion.id}>
                <Card.Header>{companion.name}, {companion.level}</Card.Header>
                <Card.Content>
                    <Card.Description>{companion.race}</Card.Description>
                    <Card.Description>{companion.char_class}</Card.Description>
                    <Button  onClick={() => props.openModal(companion)}>View Companion</Button>
                </Card.Content>
            </Card>
        )
    })
    return(
        <Card.Group>
            {companions}
        </Card.Group>
    )
}

export default PartyMembers