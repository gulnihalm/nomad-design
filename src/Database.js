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

export default class Database extends Component{
  constructor(props){
	  super(props)
	  this.state = {
		  userEmail:'',
		  userPassword:'',
		  data:[]
	}
  }
  login = () => {
	  
	  fetch('http://nomad-server2.000webhostapp.com/takeFromApplication.php',{
		  method: 'POST',
		  headers:{
			Accept: 'application/json',
			'Content-Type':'application/json'
		  },
		  body: JSON.stringify({
			  username:this.state.userEmail,
			  email:this.state.userPassword
		  })

	  })
	  .then(response => {response.text()})
	  .then(response => {
		  console.log('response is', response)
		  Alert.alert('response is ',response)
	  }).catch((error) => {
		  Alert.alert('error is ', error.message)
	  })
	  
  }
  getData = () => {
	
	fetch('http://nomad-server2.000webhostapp.com/sendToApplication.php')
	.then((response)=> response.json())
	.then((response) => {
		console.log('response from get: ',response);
		let str = JSON.stringify(response)
		str = str.replace(/\\/g, "")
		str = str.substr(1,str.length - 2);
		Alert.alert("adsa",str)
		
		let obj = JSON.parse(str)


		let array=Object.keys(obj).map(function(k){
			return obj[k];
		})
		array.forEach(element => {
			Alert.alert('element[0]', element[0].username)
		});
		
	}).catch((error) => {
        Alert.alert('The error is',JSON.stringify(error.message));
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


