import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TextInput,
    Alert,
    Platform,
    TouchableOpacity,
    ScrollView
  } from 'react-native';
  import {Actions} from 'react-native-router-flux';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import {Header,Card,Button, SearchBar, Icon} from 'react-native-elements';
  import App from './App';
export default class Comments extends React.Component{

    constructor(props){
        super(props);
        this.state={
            enabled:false
        }
    }
    
    render(){
        const comments = this.props.comments;
        const user = this.props.user;
        const obj = JSON.parse(user)
        if(this.state.enabled === false){
            return (
                
                <View >
                    <Text style = {styles.forTitle}>Comments</Text>
                    <ScrollView style={styles.scrollView}>
                    {
                        comments.map(comment => 

                        <Card style= {styles.container}>
                            <Text>{comment[0] + " "}{comment[1]}</Text>
                            <Text>{"User Level: "+comment[6] + ", User Rate: "+comment[3]}</Text>
                            <View style={{borderBottomColor: 'black',borderBottomWidth: 1,}}
                            />
                            <Text>{comment[5]}</Text> 
                        </Card>)

                    }
                    <Text> {"\n"}  </Text>
                    </ScrollView>
                    <Text> {"\n"}  </Text>
                    <TouchableOpacity style={styles.altButton}
                        onPress={()=>this.setState({enabled:true})}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <Text> {"\n"}  </Text>
                    
                    
                </View>
            ); 
        }else{
            return (<App guid = {obj.userID} userEmail = {obj.email} userName = {obj.username} userPassword = {obj.password} page = {9}/>);
        }

    }
}
const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'#fff',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    buttonText: {
		fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    altButton: {
		borderRadius: 30,
		backgroundColor: 'grey',
		justifyContent: 'center',
		alignItems: 'center',
        padding: 10	,
        width : 100,
        height: 30,
        alignSelf: 'center'
    },
    forTitle:{
        fontWeight:'bold',
        fontSize:20,
        alignSelf:'center'
    },
    textField:{
        width:200,
        margin:10
    },
    scrollView: {
      backgroundColor: 'pink',
      marginHorizontal: 20,
    },
    myButton:{
      padding: 5,
      height: 20,
      width: 20,  //The Width must be the same as the height
      borderRadius:40, //Then Make the Border Radius twice the size of width or Height   
      backgroundColor:'red'
  
    }
})