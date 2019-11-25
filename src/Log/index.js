import React from 'react'
import {Header, Button} from 'semantic-ui-react'

const logStyle = {
    display: 'flex',
    flexDirection: 'column-reverse',
    textAlign: "center",
    maxHeight: 80+'%',
    width: 100+'%',
    minHeight: 100+'px',
    overflow: 'auto'
}

const headerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100+'%',
    height: 10+'%'
}


const Log = (props) => {
    const logInputs = props.log.map((log) => {
        return(
            <p>{log}</p>
        )
    })
    return(
        <React.Fragment>
            <header style={headerStyle}>
                <h1>Log</h1>
                <Button onClick = {props.clearLog}>Clear Log</Button>
            </header>
            <div style={logStyle}>
                {logInputs}
            </div>
        </React.Fragment>
    )
}

export default Log;