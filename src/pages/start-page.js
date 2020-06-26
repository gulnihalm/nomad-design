import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Text, View, ActivityIndicator } from 'react-native';
import { isLogin } from '../common/general';

export default class StartPage extends Component {
	
	constructor(props) {
		super(props);

		this.isLoginControl();
	}

	async isLoginControl() {
		isLogin().then((res) => {
			if (res)
				Actions.MainPage({type: 'reset'}); 
			else 
				Actions.LoginPage({type: 'reset'});
		})
	}

	render() {
		console.disableYellowBox = true;
		return(
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size = "large"/>
				<View style = {{top: 25}}>
					<Text style = {{fontSize: 20}}>Loading</Text>
				</View>
			</View>
		);
	}
} 