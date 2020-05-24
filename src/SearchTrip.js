import React, {Component} from 'react';
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

import {Header,Card,Button, SearchBar} from 'react-native-elements';
import Search from 'react-native-search-box';

export default class SearchTrip extends Component{
    constructor(props){
        super(props)
        this.state = {
            trips: this.getTrips(),
            searchText:null
        }
    }


    getTrips(){
        var trips = [];
        fetch('http://nomad-server2.000webhostapp.com/getTrips.php')
        .then((response)=> response.json())
        .then((response) => {
            // console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            console.log('str:',str);
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {
            
                var trip = [];
                trip.push(element.tripID);
                trip.push(element.userID);
                trip.push(element.name);
                trip.push(element.label);
                trip.push(element.description);

                trips.push(trip);
    
            });
            
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

        return trips;
    }


    onPressFollow( tripID ){
        console.log("Trip Followed :",tripID);
        this.props.setTrip( tripID );
    }


    searchTrip(){ 
        var trips = [];
        fetch('http://nomad-server2.000webhostapp.com/searchTrip.php',
        {
            method: 'POST',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                searchText:this.state.searchText
            })
    
        })
        .then((response)=> response.json())
        .then((response) => {
            console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            console.log('str:',str);
            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {
            
                var trip = [];
                trip.push(element.tripID);
                trip.push(element.userID);
                trip.push(element.name);
                trip.push(element.label);
                trip.push(element.description);

                trips.push(trip);
    
            });
            this.setState({trips});
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

        
    }

    updateSearch = searchText => {
        this.setState({ searchText });
        console.log(searchText)
        
    };
    onSearch = () => {
        
        return new Promise((resolve, reject) => {

            this.searchTrip(this.state.searchText)
            resolve();
        });
    }
    onChangeText = (searchText) => {
        return new Promise((resolve, reject) => {
            this.updateSearch(searchText)

            resolve();
        });
    }
    render(){

        const {user} = this.props;
        const {trips} = this.state;
        const { searchText } = this.state;
        if ( trips.length == 0 )
            return (
                <Text>Getting Available Trips...</Text>
            );
        console.log(trips.length)
        return (
            <ScrollView style={styles.scrollView}>
            <View>
                <SearchBar
                  lightTheme
                  placeholder="Type Here..."
                  onChangeText = {(searchText) => this.updateSearch(searchText)}
                  value = {searchText}
                />
                <Button title='Search' onPress={() => this.searchTrip()}> </Button>
                
                {trips.map(trip =>
                    
                    <Card title={trip[2]}>
                        <Text style={{fontWeight:"bold"}}>{trip[3]}</Text>
                        <Text>{trip[4]}</Text>
                        <Button title='Follow This Trip' onPress={() => this.onPressFollow(trip[0])}> </Button>
                    </Card>
                    
                )}
                
            </View>
            </ScrollView>
        );
    }
  
 
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  button:{
    padding:20,
    borderWidth:1,

  },
  
  textField:{
	  width:200,
	  margin:10
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  }
})