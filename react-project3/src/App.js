import React from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import {Route, Switch} from 'react-router-dom';
import MainContainer from './MainContainer';
import CharacterCreation from './CharacterCreation'
import Profile from './Profile'

const my404 = () => {
  return(
    <div>
      <h3>Error!</h3>
    </div>
  )
}


function App() {
  return (
    <main>
      <Switch>
        <Route exact path='/' component= {Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/home' component={MainContainer}/>
        <Route exact path='/create' component={CharacterCreation} />
        <Route exact path='/profile' component={Profile} />
        <Route component={my404} />
      </Switch>
    </main>
  );
}

export default App;
