/* eslint-disable semi */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import MapView,{Marker, Callout, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
export default class Playground extends Component{
  constructor(props){
	  super(props)
	  this.state = {
		  userEmail:'',
		  userPassword:'',
		  data:[]
	}
  }
  login = () => {
	  
	  const {userEmail} = this.state
	  const {userPassword} = this.state;
	  
	  fetch('https://nomadserver.000webhostapp.com/takeFromApplication.php',{
		  method: 'POST',
		  headers:{
			'Accept': 'application/json',
			'Content-Type':'application/json'
		  },
		  body: JSON.stringify({
			  username:this.state.userEmail,
			  email:this.state.userPassword
		  })

	  })
	  .then(response => {response.text()})
	  .then(responseJson => {
		  console.log('response is2', responseJson)
		  Alert.alert('response is ',responseJson)
	  }).catch((error) => {
		  Alert.alert('error is ', error.message)
	  })
	  
  }
  getData = () => {
	
	fetch('https://nomadserver.000webhostapp.com/sendToApplication.php')
	.then((response)=> response.json())
	.then((responseJson) => {
		/*let str = JSON.stringify(responseJson);
		str = str.replace(/\\/g, "");
		str = str.substr(1,str.length - 2);
		let obj = JSON.parse(str)
		let deneme = 
		Alert.alert( deneme[0])
		//Alert.alert("str is",Object.length(obj))*/
		/*let str = JSON.stringify(responseJson)
		
		str = str.replace(/\\/g, "")
		str = str.substr(1,str.length - 2);*/
		console.log("ebenin amı")
		let str = JSON.stringify(responseJson);
		str = str.replace(/\\/g, "");
		str = str.substr(1,str.length - 2);
		//Alert.alert("str = ",str)
		let something = JSON.parse(str)
		let collect = Object.entries(something)
		let values = collect.values()
		console.log(values)
		
		
	}).catch((error) => {
        Alert.alert('The error is',error);
      });

  }
  render(){
    return (
    <View>
		<TextInput
			placeholder = "Enter Email"
			style = {{width:200,margin:10,alignItems:'center'}}
			onChangeText = {userEmail => this.setState({userEmail})}
		></TextInput>
		<TextInput
			placeholder = "Enter Password"
			style = {{width:200,margin:10,alignItems:'center'}}
			onChangeText = {userPassword => this.setState({userPassword})}
		></TextInput>
		<TouchableOpacity
		onPress = {this.login}
		style={{width:100,margin:20,backgroundColor:'magenta',alignItems:'center'}}
		><Text style={{color:'white'}}>PressMe</Text></TouchableOpacity>


		<TouchableOpacity
		onPress = {this.getData}
		style={{width:100,margin:20,backgroundColor:'black',alignItems:'center'}}
		><Text style={{color:'white'}}>get data</Text></TouchableOpacity>
		<FlatList
 			data={this.state.data}
		/>

    </View>
      
    );
  }
  
 
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },button:{
    padding:20,
    borderWidth:1,

  },textField:{
	  width:200,
	  margin:10
  }
})


