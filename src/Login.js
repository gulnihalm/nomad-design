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

export default class Login extends Component{
  constructor(props){
      super(props)
	  this.state = {
          userName:'',
		  userEmail:'',
		  userPassword:'',
		  data:[]
	}
  }



  login = () => {

	userId = 0;

	const {userName} = this.state;
	const {userEmail} = this.state;
	const {userPassword} = this.state;

	console.log("incoming username: ", userEmail);
	console.log("incoming pass: ", userPassword);


	fetch('http://nomad-server2.000webhostapp.com/getUsers.php')
	.then((response)=> response.json())
	.then((response) => {
		// console.log('response from get: ',response);
		let str = JSON.stringify(response);
		str = str.replace(/\\/g, "")
		str = str.substr(1,str.length - 2);
		
		let obj = JSON.parse(str);
		
		let array=Object.keys(obj).map(function(k){
			return obj[k];
		})

		// console.log(array);

		array[0].forEach(element => {
           
			console.log(element.email,element.password);


			if ( userEmail === String(element.email) && userPassword === String(element.password) ){
				console.log("USER FOUND:",element.ID );
				this.props.setUser( element );
			}

 
		});
		
	}).catch((error) => {
        Alert.alert('The error is',JSON.stringify(error.message));
      });
	  
	  
  }
  getData = () => {
    
    userId = 0;

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
			placeholder = "E-mail"
			style = {{width:200,margin:10,alignItems:'center'}}
			onChangeText = {userEmail => this.setState({userEmail})}
		></TextInput>
		<TextInput
			placeholder = "Password"
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


