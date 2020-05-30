import React from 'react';
import {Actions} from 'react-native-router-flux';
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
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';


import Icon from 'react-native-vector-icons/Entypo';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
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
      width:400,
      height:400
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
   scrollView: {
    marginHorizontal: 20,
  },
  titleText: {
  fontSize: 20,
  fontWeight: "bold"
}
});

export default class EditTrip extends React.Component{

    constructor(props){
        super(props);
        const {markers} = this.props;
        this.state = {
            markers: markers,
            descriptions: [],
            tripDescription: '',
            tripName : '',
            titles: [],
            text: '',
            inputEnabled: false,
            selectedMarker: -1,
            label: '',
            done: false,
                //possible userid
        }
        this.submitMarkers = this.submitMarkers.bind(this);
    }

    onPressMarker(i) {


        this.setState({inputEnabled: true, selectedMarker: i, text: ''});
    }

    async getLastTripCreatedByUser(){
        let obj = JSON.parse(this.props.user)
        const userID = obj.userID;
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
        let obj = JSON.parse(this.props.user)
        const userID = obj.userID;
        console.log("LOG CURRENT USER:",obj.userID);
        console.log("Don't delete this log. It does woala")
        console.log("Don't delete this log. It does woala. This too")
        console.log("Don't delete this log. It does woala. This too")
        tripID = 0;
        await fetch('http://nomad-server2.000webhostapp.com/getTrips.php')
        .then((response)=> response.json())
        .then((response) => {
            console.log('response from get: ', response);
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

        /*console.log("Submitting MARKERS ->",tripID);
        console.log("************",markers[0].latlng.latitude);
        console.log("************",markers[0].latlng.longitude);
        console.log("************",titles[0]);*/

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

        this.setState({done:true});

    }

    async submitTrip(){
        this.setState({init:true});
        console.log("Trip submitted");
        console.log(this.state.markers);
        console.log(this.state.titles);
        console.log(this.state.tripDescription);
        console.log('----------------');
        let obj = JSON.parse(this.props.user)
        await fetch('http://nomad-server2.000webhostapp.com/submitTripInfo.php',{
		  method: 'POST',
		  headers:{
			Accept: 'application/json',
			'Content-Type':'application/json'
		  },
		  body: JSON.stringify({
			  userID: obj.userID,
              name: this.state.tripName,
              label: this.state.label,
              description: this.state.tripDescription
		  })

        })
        .then(response => {response.text()})
        .then(response => {
            console.log('SUBMIT TRIP response is', response);
        }).catch((error) => {
            console.log('error is ', error.message);
        });
        console.log("Trip")

        setTimeout(this.submitMarkers, 5000);

    }


//yaz, kış, doğa, tarihi, fun stuff, mixed
    render(){
        let obj = JSON.parse(this.props.user)

        //console.log('titles');
        //console.log(this.state.titles);
        const {titles} = this.state;
        const {tripDescription} = this.state
        //console.log(titles);
        //console.log(tripDescription);
        const {pos} = this.props;
        const {selectedMarker} = this.state
        const {checked} = this.state
        var radio_props = [
            {label: 'winter', value: 'winter' },
            {label: 'summer', value: 'summer' },
            {label: 'nature', value: 'nature' },
            {label: 'historical', value: 'historical'},
            {label: 'fun stuff', value : 'fun stuff'},
            {label: 'mixed', value : 'mixed'}
          ];
          /*<RadioForm
                          radio_props={radio_props}
                          initial = {'winter'}
                          onPress={(value) => { this.setState({ label: value }); }}
                        /> */
        if (this.state.done){
          return(
            <View style={styles.container}>

                <Header
                  backgroundColor = '#BF1E2E'
                  centerComponent={{ text: 'CREATE ROUTE', style: { color: '#fff' } }}

                />
                <ScrollView style={styles.scrollView}>

                    <Text style= {styles.titleText}>Trip Created. Please go back using the back button of the device.</Text>

                </ScrollView>


                <View>
                    <Footer style={{backgroundColor: "#BF1E2E"}}/>
                </View>

            </View>
          )
        }
        if(this.state.inputEnabled){

            return (
                <View style={styles.container}>

                    <Header
        	            backgroundColor = '#BF1E2E'
        	            centerComponent={{ text: 'CREATE ROUTE', style: { color: '#fff' } }}

      	            />
                    <ScrollView style={styles.scrollView}>
                    <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>

                        {this.state.markers.map((marker, i) => <Marker identifier = {i.toString(10)} title = {this.state.titles[i]} description = {this.state.descriptions[i]}
                            onPress= {(e) => {this.onPressMarker(i)}} coordinate={marker.latlng} key = {i}/>)}

                    </MapView>
                    <Text>{"\n"}</Text>
                        <Text>Trip Name:</Text>
                        <View style={{width:'100%'}}>
                            <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1,borderRadius: 4 }} label = {'Name'} placeholder = {'Trip Name'} value={this.state.tripName} onChangeText={name => {
                                this.setState({tripName: name});}}/>

                        </View>
                    <Text>{"\n"}</Text>
                    <Text>Trip Description:</Text>
                        <View>
                            <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1,borderRadius: 4 }} label = {'Description'} placeholder = {'Trip Description'} value={this.state.tripDescription} onChangeText={desc => {
                                this.setState({tripDescription: desc});}}/>

                        </View>
                        <Text>{"\n"}</Text>
                        <View>
                        <Text>Choose a label related to your trip(be honest :)):</Text>
                        <RadioForm
                            radio_props={radio_props}
                            initial = {'winter'}
                            onPress={(value) => { this.setState({ label: value }); }}
                        />
                        </View>
                        <Text>{"\n"}</Text>
                        <Text>Marker Title:</Text>
                        <TextInput style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1,borderRadius: 4 }} label = {'title'} placeholder = {'Marker Title'} value={this.state.text} onChangeText={text => {
                            let temp = titles.slice();
                            temp[selectedMarker] = text;
                            this.setState({titles: temp, text: text});}}/>

                        <View style={styles.multiButtonContainer}>
                            <Button title="Create Trip" onPress = {(e) =>
                            {if(this.state.tripDescription === '' || this.state.tripName === '' || this.state.label == '')
                            {alert('You did not fill all the fields!')}
                            else{this.submitTrip()} } }/>

                        </View>
                    </ScrollView>


                    <View>
                        <Footer style={{backgroundColor: "#BF1E2E"}}/>
                    </View>

                </View>

            );

        }
        else if(!this.state.inputEnabled){

            return (
                <View style={styles.container}>

                    <Header
                        backgroundColor = '#BF1E2E'

        	            centerComponent={{ text: 'TRIP CREATION', style: { color: '#fff' } }}

      	            />

                    <ScrollView style={styles.scrollView}>
                    <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>

                        {this.state.markers.map((marker, i) => <Marker identifier = {i.toString(10)} title = {this.state.titles[i]} description = {this.state.descriptions[i]} onPress= {(e) => {this.onPressMarker(i)}} coordinate={marker.latlng} key = {i}/>)}

                    </MapView>
                        <Text>{"\n"}</Text>
                        <Text>Trip Name:</Text>
                        <View style={{width:'100%'}}>
                            <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1,borderRadius: 4 }} label = {'Name'} placeholder = {'Trip Name'} value={this.state.tripName} onChangeText={name => {
                                this.setState({tripName: name});}}/>

                        </View>

                        <Text>{"\n"}</Text>
                        <Text>Trip Description:</Text>
                        <View style={{width:'100%'}}>
                            <TextInput style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1,borderRadius: 4 }} label = {'Description'} placeholder = {'Trip Description'} value={this.state.tripDescription} onChangeText={desc => {
                                this.setState({tripDescription: desc});}}/>

                        </View>
                        <Text>{"\n"}</Text>
                        <View>

                        <Text>Choose a label related to your trip(be honest :)):</Text>
                        <RadioForm
                            radio_props={radio_props}
                            initial = {'winter'}
                            onPress={(value) => { this.setState({ label: value }); }}
                        />
                        </View>
                        <Text>Tip: Tap to your markers to give them a title</Text>
                      {this.state.done===false &&
                        <View style={styles.multiButtonContainer}>
                        <Button title="Create Trip" onPress = {(e) =>
                            {if(this.state.tripDescription === '' || this.state.tripName === '' || this.state.label == '')
                            {alert('You did not fill all the fields!');}
                            else{alert('You have created a trip!'); this.submitTrip(); Actions.pop();} } }/>
                        </View>
                      }
                    </ScrollView>


                    <View>
                        <Footer style={{backgroundColor: "#BF1E2E"}}/>
                    </View>



                </View>

            );

        }


    }


}
