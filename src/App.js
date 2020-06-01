/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Button,Text,
  Alert,
  TouchableOpacity
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Header,Card} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';

import EditTrip from './EditTrip';
import Database from './Database';
import Login from './Login';
import SearchTrip from './SearchTrip';
import FollowTrip from './FollowTrip';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = 1;
const LATITUDE =40.016331868381485;
const LONGITUDE = 32.81651669267004;

const Pages = {
  CreateTripPage: 1,
  FollowTripPage: 8,
  SearchTripPage: 9
};

const styles = StyleSheet.create({
  button:{
    color: 'red'
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
    borderColor:'red',
    justifyContent: 'flex-start',
    justifyContent: 'space-around'
  },
  map: {
    width: wp('100%'),
    height: hp('60%'),
  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5
  },
  text:{
    fontFamily:'Open Sans'
  }
});

export default class App extends React.Component {
  markerIndex = 0;
  constructor(props) {
    super(props);
    this.state = {
      pos: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markers: [],
      markerPlaceEnabled: false,
      Page: this.props.page,
      user: 0, //This will include all the user information. Not just UserID. It should include UserID, email, username and password like the user JSON object below
      trip: null,
    }
  }

  componentDidMount() {
    let { Page, user } = this.state;
    let useMapServices = false;
    if( Page === 1 || Page === 2 || Page === 8 || Page === 9 )
        useMapServices = true;
    if(useMapServices)
        this.requestLocationPermission();

    user = '{"userID":"' + this.props.guid + '", "email":"' + this.props.userEmail + '", "username":"' + this.props.userName + '", "password":"' + this.props.userPassword + '"}';//HI I AM THE JSON OBJECT MENTIONED
    this.setState({Page, user});

  };

  requestLocationPermission = async () => {
    var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (response === 'granted')
      this.locateCurrentPosition();

  };

  locateCurrentPosition = () => {
    setInterval(() => {
      Geolocation.getCurrentPosition(position => {
        //console.log(JSON.stringify(position));
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }
        this.setState({pos: region});

      }, error => console.log(error.message), {
        enableHighAccuracy: false,
        timeout: 10000,
        //maximumAge: 3600000,

      })
    }, 1000);
  };

  // measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
  //   var R = 6378.137; // Radius of earth in KM
  //   var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  //   var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  //   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   var d = R * c;
  //   return d * 1000; // meters
  // }

  onPressMarker(e) {

    console.log('On Press');
    console.log(e.nativeEvent.coordinate);

    const {markers} = this.state;
    console.log('markers');
    console.log(markers);

    let filteredMarkers = markers.filter((marker) => (marker.latlng.latitude != e.nativeEvent.coordinate.latitude) && (marker.latlng.longitude != e.nativeEvent.coordinate.longitude));

    console.log('filtered markers');
    console.log(filteredMarkers);

    this.setState({markers:filteredMarkers})

  }

  setUser(userElement) {
    console.log("setUser: ",userElement)
  	this.setState({user: userElement});
  }

  setTrip(tripID){
    console.log("setTrip: ",tripID);
    this.setState({trip: tripID,Page: Pages.FollowTripPage });
  }

  render() {

    const {user,trip,Page,pos} = this.state;
    //console.log("App js render",trip,Page);

    //should be able to delete this later?
  	/*if ( user === null ){
  		return (
  			<Login setUser = { (user) => this.setUser(user) }>

  			</Login>
  			);
  	}*/

    if ( Page === Pages.SearchTripPage  ){
      return (
        <SearchTrip user = {user} trip = {trip} setTrip = { (tripID) => this.setTrip(tripID) } >

        </SearchTrip>
      );
    }

    if ( Page === Pages.FollowTripPage ){
      return (
        <FollowTrip
          user = {user}
          trip = {trip}
          pos = {pos}
          onBack={( page )=>{
            this.setState({ Page: page });
          }}
        />
      )
    }

    const {markers} = this.state;

    if(Page === Pages.CreateTripPage){

      let button = <Button title="Stop" color="#ff5c5c" onPress={(e) => this.setState({markerPlaceEnabled: false})}/>

      if(!this.state.markerPlaceEnabled)
        button = <Button title="Start" color="#bada55" onPress={(e) => this.setState({markerPlaceEnabled: true})}/>

      return (
      <View style={styles.container}>
      	<Header
        	backgroundColor = '#BF1E2E'
        	centerComponent={{ text: 'TRIP CREATION', style: { color: '#fff' } }}

      	/>

        <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true}
         ref={(ref) => this.mapView=ref} initialRegion={this.state.pos}
                onPress={(e) => {
                  console.log(e.nativeEvent.coordinate);
                  if(this.state.markerPlaceEnabled)
                    this.setState({ markers: [...this.state.markers, { latlng: e.nativeEvent.coordinate }] })}}>

          {this.state.markers.map((marker, i) => (<Marker onPress= {(e) => { if(this.state.markerPlaceEnabled) this.onPressMarker(e)}}
          coordinate={marker.latlng} key = {i}/>))}

        </MapView>

        <View style={styles.multiButtonContainer}>
          {button}
          <Button title="Next" onPress = {(e) => {if(markers.length === 0 ) {Alert.alert('Wait!','You did not place any markers yet!',
                                                                                          [
                                                                                            {text: 'OK', onPress: () => console.log('Ok Pressed')},
                                                                                            ],
                                                                                            { cancelable: false }
                                                                                        )} else this.setState({Page:2})}}/>
        </View>
        <View style={styles.multiButtonContainer}>

        <Text>TIP: You will tap map to put markers and retap to remove the marker. To disable/enable removing and see the locations, click STOP/START button. To add description tap NEXT.</Text>

        </View>

        <View>
          <Footer style={{backgroundColor: "#BF1E2E"}}/>
        </View>

        </View>

      );

    }
    else if(Page === 2){

      return(

        <EditTrip user = {user} markers = {markers} pos = {pos}>

        </EditTrip>
      );
    }



  }

}
