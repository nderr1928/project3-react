import React from 'react'
import {Header, Button} from 'semantic-ui-react'

const logStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: "center",
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    maxHeight: 80+'vh',
    height: 80+'vh',
    width: 100+'%',
    overflow: 'scroll',
    marginBottom: 5+'px',
    borderTop: '2px black solid',
    borderBottom: '2px black solid'
}

const headerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100+'%',
    height: 10+'%',
    alignContent: 'center'
}


const Log = (props) => {
    const logInputs = props.log.map((log, i) => {
        return(
            <p key={i} style={{borderTop: '1px black solid', margin: '5px 0'}}>{log}</p>
        )
    })
    return(
        <React.Fragment>
            <header style={headerStyle}>
                <h1 style={{margin: 'auto 0', height: 100+'%'}}>Log</h1>
                <Button onClick = {props.clearLog}>Clear Log</Button>
            </header>
            <div style={logStyle}>
                {logInputs}
            </div>
        </React.Fragment>
    )
}

export default Log;