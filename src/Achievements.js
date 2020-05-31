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
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Header,Card,Button, SearchBar, Icon} from 'react-native-elements';
import { Footer} from 'native-base';
import { Actions } from 'react-native-router-flux';
export default class Achievements extends React.Component{

    constructor(props){
        super(props);
        this.state={
            achievements:[],
            count : 0,
        }
        this.getAchievements();
        this.getTokenCount(this.props.guid)

    }
    
    getAchievements(){
        var achievements = [];
        
        
        fetch('http://nomad-server2.000webhostapp.com/getAchievements.php')
        .then((response)=> response.json())
        .then((response) => {
            //console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {
            
                var achievement = [];
                achievement.push(element.ach_id);
                achievement.push(element.name)
                achievement.push(element.ach_desc);
                achievement.push(element.token);
                achievements.push(achievement);
    
            });
            
            this.setState({achievements:achievements})
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

    }

    getAchImage(id){
        if(id === "1"){
            return require("../src/achimage/cricket.jpg")
        }else if(id === "2"){
            return require("../src/achimage/littlepony.jpg")
        }else if (id === "3"){
            return require("../src/achimage/strider.jpg")
        }else if (id === "4"){
            return require("../src/achimage/roadrunner.jpg")
        }else if (id === "5"){
            return require("../src/achimage/ghostrider.jpg")
        }else if (id === "6"){
            return require("../src/achimage/fastandtraveller.jpg")
        }else if (id === "7"){
            return require("../src/achimage/nomad.jpg")
        }
    }
    getTokenCount(userID){
        var count = 0;
        console.log("wtf is userID", userID)
        fetch('http://nomad-server2.000webhostapp.com/getTokenCountByID2.php',
        {
            method: 'POST',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userID: userID,
            })

        })
        .then((response)=> response.json())
        .then((response) => {
            
            console.log("response = ", response)
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);
            console.log("obj = ", obj)
            let obj = JSON.parse(str);
            
            count = parseInt(obj.count,10);
            console.log("count = ",count)
            this.setState({count:count})
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });
        
    }

    render(){
        
        const {achievements} = this.state;
        const {count} = this.state
        if ( achievements.length == 0 )
        return (
            <Text>Getting the Achivements...</Text>
        );
        
        return (

            <View style = {styles.container}>
                <Header
                backgroundColor = '#BF1E2E'
                centerComponent={{ text: 'Achivements', style: { color: '#fff', fontWeight:'bold', fontSize:20, alignSelf:'center' } }}/>
                <Text> Your token count is: {count}</Text>

                <ScrollView style={styles.scrollView}>
                {
                    achievements.map(achievement =>{
                        var req = this.getAchImage(achievement[0]);
                        if(achievement[3] <= count){
                        return(
                        <Card title={achievement[1]}
                              image = {req}>
                            
                            <Text >{achievement[2]}</Text>                                                   
                            <Text>Congratulations! You unlocked this achievement :)</Text>
                        </Card>)
                        }else{
                            return(
                                <Card title={achievement[1]}
                                      image = {req}>
                                    
                                    <Text >{achievement[2]}</Text>                                                   
                                    <Text>{achievement[3] - count} number of tokens to collect :(</Text>
                                </Card>)
                        }
                    
                    }
                        
                    )
                }
                <Text> {"\n"}  </Text>
                    <TouchableOpacity style={styles.altButton}
                        onPress={()=>{Actions.pop();}}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <Text> {"\n"}  </Text>
                    <Text> {"\n"}  </Text>
                </ScrollView>
                <View>
                    <Footer style={{backgroundColor: "#BF1E2E", position: 'absolute', bottom: 0}}/>
                </View>
                
            </View>

            
        ); 
    }
}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-start',
        justifyContent: 'space-around'
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
