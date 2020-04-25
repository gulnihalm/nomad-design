import React from 'react';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    Text,
} from 'react-native';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TextInput } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    button:{
      color: 'red'
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      //  height: 400,
      //  width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    map: {
      flex: 1,
      width,
      height
    },
    buttonContainer: {
        margin: 20,
        alignSelf: 'flex-end',
    },
    multiButtonContainer: {
     margin: 20,
     flexDirection: 'row',
     justifyContent: 'space-between'
   },
   container: {
     ...StyleSheet.absoluteFillObject,
     flex: 1,
     justifyContent: 'flex-start',
     justifyContent: 'space-around'
   },
});

export default class EditTrip extends React.Component{

    constructor(props){
        super(props);
        const {markers} = this.props;
        this.state = {
            markers: markers,
            descriptions: [],
            tripDescription: '',
            titles: [],
            text: '',
            inputEnabled: false,
            selectedMarker: -1
                //possible userid
        }
    }

    onPressMarker(i) {

        this.setState({inputEnabled: true, selectedMarker: i, text: ''});
    }

    async getLastTripCreatedByUser(){
        const userID = this.props.user.ID;
        console.log("LOG CURRENT USER:",userID);
        tripID = 0;
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
            
                if ( element.userID === userID ){
                    tripID = element.tripID;
                    console.log('trip id updated:',tripID);
                }
    
            });
            
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

        return tripID;

    }

    async submitMarkers(){
        const {markers,titles} = this.state;
        const userID = this.props.user.ID;
        // console.log("LOG CURRENT USER:",userID);
        tripID = 0;
        await fetch('http://nomad-server2.000webhostapp.com/getTrips.php')
        .then((response)=> response.json())
        .then((response) => {
            // console.log('response from get: ',response);
            let str = JSON.stringify(response);
            str = str.replace(/\\/g, "");
            str = str.substr(1,str.length - 2);

            let obj = JSON.parse(str);
            let array=Object.keys(obj).map(function(k){
                return obj[k];
            })

            array[0].forEach(element => {
            
                if ( element.userID === userID ){
                    tripID = element.tripID;
                    console.log('trip id updated:',tripID);
                }
    
            });
            
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });

        console.log("Submitting MARKERS ->",tripID);
        // console.log("************",markers[0].latlng.latitude);
        // console.log("************",markers[0].latlng.longitude);
        // console.log("************",titles[0]);

        for (i = 0; i<markers.length ; i++) {
            await fetch('http://nomad-server2.000webhostapp.com/submitMarker.php',{
		        method: 'POST',
		        headers:{
			        Accept: 'application/json',
			        'Content-Type':'application/json'
		        },
                body: JSON.stringify({
                    tripID: tripID,
                    latitude: markers[i].latlng.latitude,
                    longitude: markers[i].latlng.longitude,
                    text: titles[i]
                })
            })
            .then(response => {response.text()})
            .then(response => {
                console.log('SUBMIT MARKER response is', response);
            }).catch((error) => {
                console.log('error is ', error.message);
            });

        }
    }

    async submitTrip(){
        console.log("Trip submitted");
        console.log(this.state.markers);
        console.log(this.state.titles);
        console.log(this.state.tripDescription);
        console.log('----------------');

        await fetch('http://nomad-server2.000webhostapp.com/submitTripInfo.php',{
		  method: 'POST',
		  headers:{
			Accept: 'application/json',
			'Content-Type':'application/json'
		  },
		  body: JSON.stringify({
			  userID: this.props.user.ID,
              name: 'Default Trip Name', // change this later
              label: 'Default Label', // change this later
              description: this.state.tripDescription
		  })

        })
        .then(response => {response.text()})
        .then(response => {
            console.log('SUBMIT TRIP response is', response);
        }).catch((error) => {
            console.log('error is ', error.message);
        });

        this.submitMarkers();        

    }

    render(){

        console.log('titles');
        //console.log(this.state.titles);
        const {titles} = this.state;
        const {tripDescription} = this.state
        console.log(titles);
        console.log(tripDescription);
        const {pos} = this.props;
        const {selectedMarker} = this.state

        if(this.state.inputEnabled){

            return (
                <View style={styles.container}>

                    <Header
        	            leftComponent={<Icon name="menu" size={40} color="white" ></Icon>}
        	            centerComponent={{ text: 'CREATE ROUTE', style: { color: '#fff' } }}
        	            rightComponent={<Button title="LogOut" color='#bada55'/> }
      	            />
                    <View>
                        <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }} label = {'Description'} placeholder = {'Trip Description'} value={this.state.tripDescription} onChangeText={desc => {
                            this.setState({tripDescription: desc});}}/>
                    </View>
                    <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>
            
                        {this.state.markers.map((marker, i) => <Marker identifier = {i.toString(10)} title = {this.state.titles[i]} description = {this.state.descriptions[i]} 
                            onPress= {(e) => {this.onPressMarker(i)}} coordinate={marker.latlng} key = {i}/>)}
            
                    </MapView>
                    <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }} label = {'title'} placeholder = {'title'} value={this.state.text} onChangeText={text => {
                        let temp = titles.slice();
                        temp[selectedMarker] = text;
                        this.setState({titles: temp, text: text});}}/>

                    <View style={styles.multiButtonContainer}>
                        <Button title="Create Trip" onPress = {(e) => this.submitTrip() }/>
                        <Button title="Next" onPress = {(e) => this.setState({Page:2})}/>
                    </View>

                    <View style= {styles.buttonContainer}>
                        <Button title="Back" onPress = {(e) => this.setState({Page:2})}/>
                    </View>

                    <View>
                        <Footer style={{backgroundColor: "dodgerblue"}}/>
                    </View>

                </View>
                
            );      

        }
        else if(!this.state.inputEnabled){

            return (
                <View style={styles.container}>

                    <Header
        	            leftComponent={<Icon name="menu" size={40} color="white" ></Icon>}
        	            centerComponent={{ text: 'TRIP CREATION', style: { color: '#fff' } }}
        	            rightComponent={<Button title="LogOut" color='#bada55'/> }
      	            />
                    <View style={{width:'100%'}}>
                        <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1 }} label = {'Description'} placeholder = {'Trip Description'} value={this.state.tripDescription} onChangeText={desc => {
                            this.setState({tripDescription: desc});}}/>
                    </View>

                    <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>
            
                        {this.state.markers.map((marker, i) => <Marker identifier = {i.toString(10)} title = {this.state.titles[i]} description = {this.state.descriptions[i]} onPress= {(e) => {this.onPressMarker(i)}} coordinate={marker.latlng} key = {i}/>)}
            
                    </MapView>

                   
                    <View style={styles.multiButtonContainer}>
                        <Button title="Create Trip" onPress = {(e) => this.submitTrip() }/>
                    </View>

                    <View style= {styles.buttonContainer}>
                        <Button title="Back" onPress = {(e) => this.setState({Page:2})}/>
                    </View>

                    <View>
                        <Footer style={{backgroundColor: "dodgerblue"}}/>
                    </View>

                    
            
                </View>
                
            );     

        }
             

    }


}