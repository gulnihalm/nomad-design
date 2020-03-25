import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import React from 'react';
import {
  StyleSheet,
  View, Image,
  Dimensions,
  Button,Text,
  Alert,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LATITUDE_DELTA = 1;
const LONGITUDE_DELTA = 1;
const LATITUDE =40.016331868381485;
const LONGITUDE = 32.81651669267004;





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
    justifyContent: 'flex-start',
    justifyContent: 'space-between'
  },
  map: {
    width: wp('100%'),
    height: hp('40%'),

  },
  marker: {
    backgroundColor: "#550bbc",
    padding: 5,
    borderRadius: 5
  },
  paragraph: {
    width:wp('60%'),
    height: hp('13%'),

},
});
export default class SelectedRoute extends React.Component {
  markerIndex = 0;
  constructor(props) {
    super(props);
    this.state = {
      coordinates: [],
      pos: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markers: [],
      markerPlaceEnabled: false
    }
  }

  componentDidMount() {
   this.requestLocationPermission();
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

        if (this.state.coordinates.length > 0) {

          let coord = this.state.coordinates[this.state.coordinates.length - 1];

          if (this.measure(coord.latitude, coord.longitude, position.coords.latitude, position.coords.longitude) > 50) {
            let joined = this.state.coordinates.concat({latitude: position.coords.latitude, longitude: position.coords.longitude});
            this.setState({coordinates: joined, pos: region});
          }
        }

        else {
          let joined = this.state.coordinates.concat({latitude: position.coords.latitude, longitude: position.coords.longitude});
          this.setState({coordinates: joined, pos: region});
        }
      }, error => console.log(error.message), {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600000,
        distanceFilter: 100000
      })
    }, 1000);
  };




  render() {
    return (

    <View style={styles.container}>

      <Header
        leftComponent={<Icon name="menu" size={40} color="white" ></Icon>}
        centerComponent={{ text: 'SELECTED ROUTE', style: { color: '#fff' } }}
        rightComponent={<Button title="LogOut" color='#bada55'/> }
      />

      <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={this.state.pos}
        >
      </MapView>
      <View style={styles.multiButtonContainer}>
        <Button title="Start Now !" />
        <Icon.Button
          name="star"
          backgroundColor="dodgerblue">
          Add to Favorites
        </Icon.Button>
      </View>

      <View style= {styles.multiButtonContainer}>
        <Text style={{fontWeight:'bold', fontSize: 20}}>About This Route</Text>
        <Button title="See Profile" />
      </View>

      <View style= {styles.multiButtonContainer}>
        <ScrollView style={styles.paragraph}>
          <Text>
            This route is awesome!This route is awesome!This route is awesome!This route is awesome!
            This route is awesome!This route is awesome!This route is awesome!This route is awesome!
            This route is awesome!202This route is awesome!202This route is awesome!202This route is awesome!202This route is awesome!202This route is awesome!202
          </Text>
        </ScrollView>
        <View>
          <Image
            style={{width: 105, height: 90}}
            source={{uri: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'}}/>
          <Text>Created by XXXX</Text>
        </View>
      </View>


      <View style= {styles.buttonContainer}>
        <Button title="Back" />
      </View>
      <View>
        <Footer style={{backgroundColor: "dodgerblue"}}/>
      </View>
    </View>
);

  }


}
