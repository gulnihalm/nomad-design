import React from 'react';
import App from '../App';

export default class CreateTripPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            guid: 				this.props.guid,
            userName: 			this.props.userName,
            userEmail:          this.props.userEmail,
            userPassword: this.props.userPassword
        }
    }

    render(){
        console.disableYellowBox = true;
            return (
                <App guid = {this.state.guid} userEmail = {this.state.userEmail} userName = {this.state.userName} userPassword = {this.state.userPassword} page = {1}/>
            );      
    }
}