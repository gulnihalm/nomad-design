import React from 'react';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    Text,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TextInput } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {RNCamera} from 'react-native-camera';
import {Actions} from 'react-native-router-flux';
import MapViewDirections from 'react-native-maps-directions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
      flex: 1,
      justifyContent: 'flex-start',
      justifyContent: 'space-around'
    },
    map: {
      width: wp('100%'),
      height: hp('80%'),
    },
    marker: {
      backgroundColor: "#550bbc",
      padding: 5,
      borderRadius: 5
    }
});


const DISTANCE_LIMIT = 9720; // 100 meters is close enough to collect token
const GOOGLE_MAPS_APIKEY = 'AIzaSyAxXVF5Z4CbXiIssgfqYGYqgUuy0yzMdbM';
export default class FollowTrip extends React.Component{

    constructor(props){
        super(props);
        this.buttonPress = this.buttonPress.bind(this);
        this.markRoute= this.markRoute.bind(this);
        this.markersChecked = [];
        this.tokeNum =0;
        this.finished;
        this.m=0;
        this.coordinates = {
          latitude :0,
          longitude:0,
        };
        this.poss={
          latitude: this.props.pos.latitude,
          longitude: this.props.pos.longitude,
        };
        const {markers} = this.props;
        this.state = {
            //flag: 0,
            //markersChecked2: this.props.markersChecked2,
            markersClaimed: [],
            markers: [],
            markerIndex: -1,
            //finished2 : this.props.finished2,


        }
    }



    componentDidMount(){
        let {markers} = this.state;
//      let {coordinates} = this.state;
        markers = this.getMarkers();
//        coordinates = this.markRoute();
        this.setState({markers});

    }

    measure(lat1, lon1, lat2, lon2) { // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000; // meters
    }

    checkPosition(){
        const {pos} = this.props;
        const {markers} = this.state;
        //let {markersChecked} = this.state;
        let count = 0;
        var distance = DISTANCE_LIMIT;
        let flag=0;
        markers.forEach( marker => {
            var diff =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )
            console.log("-------------DISTANCE____IF DISINDAKİ:", diff, marker.markerID);


            if ( diff < distance && !this.markersChecked[count]){
                console.log("YOU ARE CLOSE TO MARKER IF ICINDE:",marker);
                console.log("DISTANCE IF ICINDE:",this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) );
                distance = diff
                flag = marker.markerID;
            }
            count++;

        });

        return flag;
    }

    markRoute(){
        const {pos} = this.props;
        const {markers} = this.state;
//        let {coordinates} = this.state;
        var count =0;
        var temp=1000000;
        var flag2 =0;
        let finished2= this.state;
//        var m;
        for(let i = 0; i<this.m; i++){
            if (this.markersChecked[i]){
              this.finished= 1;
            }
            else {
              this.finished =0;
            }
        }
        markers.forEach(marker => {
            var distance =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )

            if (distance <= temp && !this.markersChecked[count]){
              temp=distance;
              flag2=count;
//            m=marker;
              this.coordinates= marker.latlng;
//            console.log(this.markersChecked,"GİRDİİİİİİİİİİİİİ")


            }
            count++;
        });
//      coordinates=marker.latlng
//      return coordinates;
//        return m;


    }

    markClose(closeEnough){
      const {pos} = this.props;
      const {markers} = this.state;

      let count = 0;
      let index= -1;
      markers.forEach( marker => {

          if ( marker.markerID === closeEnough){
              index = count;
          }
          count++;

      });
      return index;
    }

    buttonPress = (closeEnough) => {
      const {pos} = this.props;
      let {markersChecked2}=this.state;
      let {finished2}=this.state;
      const {markers} = this.state;
      //let mchecked = markersChecked;
      let mindex = this.markClose(closeEnough);
      this.markersChecked[mindex]=true;
      //this.setState({markersChecked: mchecked ,markerIndex: mindex});
      console.log(mindex,"_________");
      console.log(this.markersChecked,"_________");
      Actions.ARpage();
    }


    getMarkers(){
        //let {markersChecked, markersClaimed} = this.state;
        myMarkers = [];
        tripID = this.props.trip;
        fetch('http://nomad-server2.000webhostapp.com/getMarkers.php')
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

                console.log("->",element);
                if ( element.tripID === tripID ){

                    m = {
                        text: element.text,
                        latlng:{
                            latitude: parseFloat(element.latitude),
                            longitude: parseFloat(element.longitude)
                        },
                        tripID: element.tripID,
                        markerID: parseInt(element.markerID)
                    }

                    myMarkers.push(m);
                    this.markersChecked.push(false);
                    this.m=this.m+1;
                    //markersClaimed.push(false);
                    console.log("marker found:",element);
                }
            });

        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });
        //this.setState({markersChecked, markersClaimed});

        return myMarkers;
    }

    render(){

        console.log(this.props.user);
        console.log(this.props.trip);



        const {markers} = this.state;
        const {pos} = this.props




        var closeEnough = this.checkPosition();
        this.markRoute();
//        this.coordinates = m.latlng;

        console.log(closeEnough,"__________________________________________________________________________");
        console.log(closeEnough,"__________________________________________________________________________");
        console.log(this.finished,"22222222222222222222222");
        console.log(this.markersChecked,"111111111111111111111111111");
        console.log(closeEnough,"__________________________________________________________________________");
        console.log("My markers for trip:",this.props.trip,"----->",markers);
        console.log(this.coordinates,"***************************");
        console.log(this.markersChecked[1]);




        return (

            <View style={{flex: 1, justifyContent: 'space-between',alignItems:'center' , width:  wp('100%'),height:  hp('100%')}}>
              <View style={{flex: 1, width: wp('100%'),height:  hp('80%')}}>
                <MapView style={styles.map}  provider={PROVIDER_GOOGLE} showsUserLocation={true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>

                    {markers.map((marker, i) => (<Marker coordinate={marker.latlng} title={marker.text} key = {i}/>))}
                    {this.finished<1 &&
                    <MapViewDirections
                      origin={this.poss}
                      destination={this.coordinates}
                      apikey={GOOGLE_MAPS_APIKEY}
                      mode="WALKING"
                      strokeWidth= {3}
                      strokeColor = "#BF1E2E"
                    />}
                </MapView>
                {closeEnough>0 &&
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>You are close to a checkpoint! TAP button to collect your Token!</Text>
                      <Button title = "Get Token" color="#BF1E2E"  onPress= { () => {this.buttonPress(closeEnough)}}></Button>
                    </View>
                }
                {this.finished>0 &&
                    <View style={{flex:1 , height: hp('20%'), width: wp('100%')}}>
                      <Text>Route FINISHED! Tap button to proceed.</Text>
                      <Button title = "FINISH" color="#BF1E2E"></Button>
                    </View>
                }

              </View>


            </View>
        );


    }

}
