import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';

//navigator library used throughout the program. Most important thing to know is Actions.xPage takes you to the page you want. type = 'reset' resets navigator's history.
import {Actions, Scene, Router} from 'react-native-router-flux';
import LoginPage from './src/pages/login-page';
import MainSidebar from './src/pages/main-page-sidebar'; //IMPORTANT: MainPage refers to main-page-sidebar, main-page-content is sidebar's child.
import StartPage from './src/pages/start-page';
import SyncPage from './src/pages/sync-page';
import ARpage from './src/ARpage';
import FollowTrip from './src/FollowTrip';

export default class Login extends Component {

    render() {
        //pages used throughout the program
        const scenes = Actions.create(
            <Scene key="root" hideNavBar="true">
                <Scene key="StartPage" component={StartPage}/>
                <Scene key="LoginPage" component={LoginPage}/>
                <Scene key="MainPage" component={MainSidebar}/>
                <Scene key="SyncPage" component={SyncPage}/>
                <Scene key="ARpage" component={ARpage}/>
                <Scene key="FollowTrip" component={FollowTrip}/>
            </Scene>
    );

        return <Router scenes={scenes}/>
    }
}

//Login to enable login, App to test App directly.
AppRegistry.registerComponent(appName, () => Login);
