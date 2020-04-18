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
        
	}
  }

  render(){
    const {user} = this.props;

    return (
        <View>
            <Text> Hello User: {user.username} </Text>


        </View>

        // create trip pageina giden buton
        // my trips pageine giden buton
        // followed trips pageine giden buton
        // followed users pageine giden buton
        // logout butonu
        
        // my achivements (SON ISLER)

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


