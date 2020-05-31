import React from 'react';
import MapView, {Marker, AnimatedRegion, PROVIDER_GOOGLE, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from "@react-native-community/geolocation";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TextInput } from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import { Footer} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';
import {RNCamera} from 'react-native-camera';
import { hostURL } from './common/general';
import {Actions} from 'react-native-router-flux';
import MapViewDirections from 'react-native-maps-directions';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({

    textStyle: {
      fontSize: wp('4%'),
      textAlign: 'center',
      marginRight: wp('4%'),
      color: "#f8f8ff",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 7
    },
    textStyle2: {
      fontSize: wp('4%'),
      marginRight: wp('4%'),
      textAlign: 'center',
      color: "#f8f8ff",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
    },
    textStyle3: {
      fontSize: wp('3.5%'),
      textAlign: 'center',
      marginRight: wp('4%'),
      color: "#f8f8ff",
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 7
    },
    buttonStyle: {
      alignItems: 'center',
      width: wp('32%'),
      height: hp('8%'),
      padding:10,
      backgroundColor: '#BF1E2E',
      borderRadius:3,
      borderColor: "#d3d3d3",
      borderWidth: 1
    },
    buttonStyle2: {
      alignItems: 'center',
      width: wp('48%'),
      height: hp('6%'),
      padding:10,
      backgroundColor: '#BF1E2E',
      borderRadius:3,
      borderColor: "#d3d3d3",
      borderWidth: 1
    },
    buttonStyle21: {
      alignItems: 'center',
      width: wp('32%'),
      height: hp('6%'),
      padding:10,
      backgroundColor: '#BF1E2E',
      borderRadius:3,
      borderColor: "#d3d3d3",
      borderWidth: 1
    },
    buttonStyle3: {
      alignItems: 'center',
      width: wp('48%'),
      height: hp('10%'),
      padding:10,
      backgroundColor: '#BF1E2E',
      borderRadius:3,
      borderColor: "#d3d3d3",
      borderWidth: 1
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      justifyContent: 'space-around'
    },
    map: {
      width: wp('100%'),
      height: hp('65%'),
    },
    marker: {
      backgroundColor: "#550bbc",
      padding: 5,
      borderRadius: 5
    },
    markerStyle: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerStyle2: {
      width: 80,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userStyle: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userStyle2: {
      width: 60,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabView2: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.01)',
    },
});

const DISTANCE_LIMIT = 10000000000000000000000000000000; // 100 meters is close enough to collect token but right now it is close to 10km for testing
const GOOGLE_MAPS_APIKEY = 'AIzaSyAxXVF5Z4CbXiIssgfqYGYqgUuy0yzMdbM'; //google api key with directions included
//AIzaSyCA0MiYtfUFz70Mz4vZh6YTnjfY4_r_r18
export default class FollowTrip extends React.Component{

    constructor(props){
        super(props);
        this.buttonPress = this.buttonPress.bind(this);
        this.markRoute= this.markRoute.bind(this);
        this.markersChecked = [];//bollean array for tracking which marker is checked and closest. This is basically an array which can determine whole process (for example which marker is next, which are done)
        this.tokeNum =0;//token collected
        this.finished;//end toute condition, 1 is finished, 0 is not finished
        this.m=0;//marker array length
        this.mode="WALKING";
        this.workedOnce = 0;
        this.mapdata= {
          distance : 0,
          duration : 0,
        }
        this.coordinates = {//global variable to get closest marker coordinates for drawing
          latitude :0,
          longitude:0,
        };

        const {markers} = this.props;
        this.state = {
            //flag: 0,
            //markersChecked2: this.props.markersChecked2,
            //markersClaimed: [],
            markers: [],//marker array
            markerIndex: -1,//index
            //finished2 : this.props.finished2,

        }
    }

    componentDidMount(){
        let {markers} = this.state;
//      let {coordinates} = this.state;
        markers = this.getMarkers();//get markers from DB
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

    checkPosition(){//this function is for returning the ID of the closest marker to user within DISTANCE_LIMIT
        const {pos} = this.props;
        const {markers} = this.state;
        //let {markersChecked} = this.state;
        let count = 0;
        var distance = DISTANCE_LIMIT;
        let flag=0;
        markers.forEach( marker => {
            var diff =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )
            ///console.log("-------------DISTANCE____IF DISINDAKİ:", diff, marker.markerID);


            if ( diff < distance && !this.markersChecked[count]){// if same index for marker in question is true on bool array then that marker is checked.
                ///console.log("YOU ARE CLOSE TO MARKER IF ICINDE:",marker);
                ///console.log("DISTANCE IF ICINDE:",this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude ) );
                distance = diff
                flag = marker.markerID;
            }
            count++;

        });
        return flag;//ID
    }

    markRoute(){// This funtion is for getting the coordinates of closest marker to user no matter where the user is for route drawing
        const {pos} = this.props;
        const {markers} = this.state;
//        let {coordinates} = this.state;
        var count =0;
        var temp=1000000; //this funtion will for markers closer than 1000km
        var flag2 =0;
//        let finished2= this.state;
//        var m;
        for(let i = 0; i<this.m; i++){//loop for determining if route is finished
            if (this.markersChecked[i]){// if all bool array true route finished
              this.finished= 1;//finished
            }
            else {
              this.finished =0;//not finished
            }
        }
        markers.forEach(marker => {
            var distance =  this.measure( pos.latitude, pos.longitude, marker.latlng.latitude, marker.latlng.longitude )

            if (distance <= temp && !this.markersChecked[count]){// if same index for marker in question is true on bool array then that marker is checked.
              temp=distance;
              flag2=count;//index of closest marker to user in the marker array
//            m=marker;
              this.coordinates= marker.latlng;//coordinates of closest marker under 1000km
//            console.log(this.markersChecked,"GİRDİİİİİİİİİİİİİ")


            }
            count++;
        });
//      coordinates=marker.latlng
//      return coordinates;
//        return m;
    }

    markClose(closeEnough){//this function is for getting the index of closest marker within DISTANCE_LIMIT, which is found by ID(from checkposition)
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

    buttonPress = (closeEnough) => {//this funtion is for button.
      const {pos} = this.props;
      let {markersChecked2}=this.state;
      //let {finished2}=this.state;
      const {markers} = this.state;
      //let mchecked = markersChecked;
      let mindex = this.markClose(closeEnough);// get Index of closest marker within DISTANCE_LIMIT
      this.markersChecked[mindex]=true;//make the same index in bool array true
      console.log(markers[mindex])
      this.tokeNum=this.tokeNum+1;//collected one token
      let obj = JSON.parse(this.props.user)
      
      fetch('http://nomad-server2.000webhostapp.com/addToCollectedTokens2.php',
      {
            method: 'POST',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userID: obj.userID,
                tripID: markers[mindex].tripID,
                markerID: markers[mindex].markerID
            })

        })
        .then((response)=> response.json())
        .then((response) => {
            
        }).catch((error) => {
            Alert.alert('The error is',JSON.stringify(error.message));
        });
        
        
      //this.setState({markersChecked: mchecked ,markerIndex: mindex});
      ///console.log(mindex,"_________");
      ///console.log(this.markersChecked,"_________");
      Actions.ARpage();//go to AR
    }


    getMarkers(){//get markers from DB and also form bool array, filled with false.
        //let {markersChecked, markersClaimed} = this.state;
        let myMarkers = [];
        let tripID = this.props.trip;
        fetch( hostURL + 'getMarkers.php')
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

                ///console.log("->",element);
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
                    this.markersChecked.push(false);//put exactly one false for one marker. No of markers and "false"s will be same
                    this.m=this.m+1;//increase the size by one
                    //markersClaimed.push(false);
                    ///console.log("marker found:",element);
                    
                }
            });

        }).catch((error) => {
            alert('The error iss',JSON.stringify(error.message));
        });
        //this.setState({markersChecked, markersClaimed});

        return myMarkers;
    }
    changeMode()
    {
      if (this.mode==="WALKING"){
        this.mode="DRIVING";
      }
      else {
        this.mode="WALKING";
      }
    }

    finishTrip=()=>{
        console.log(this.props.user);
        console.log(this.props.trip);

        fetch(hostURL + 'finishTrip.php', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: this.props.user,
                trip: this.props.trip
            })
        })
        .then((response)=> response.json())
        .then((response) => {
            console.log('finishTrip response: ', response);
            if(response.result == 1){
                this.props.onBack(9);
            }
            else if(response.error != ""){
                alert("Finished trip could not be saved");
            }
        }).catch((error) => {
            alert('Finish trip error: ', error);
        });
    }

    render(){
        ///console.log(this.props.user);//for tracking
        ///console.log(this.props.trip);//for tracking

        const {markers} = this.state;
        const {pos} = this.props

        var closeEnough = this.checkPosition();//close enough is the ID of marker which is under DISTANCE_LIMIT
        this.markRoute();// draw route and check if route is completed
//        this.coordinates = m.latlng;

        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log(this.finished,"22222222222222222222222");                                                 //for tracking
        ///console.log(this.markersChecked,"111111111111111111111111111");                                       //for tracking
        ///console.log(closeEnough,"__________________________________________________________________________");//for tracking
        ///console.log("My markers for trip:",this.props.trip,"----->",markers);                                 //for tracking
        ///console.log(this.coordinates,"***************************");                                          //for tracking
        ///console.log(this.markersChecked[1]);                                                                  //for tracking

          return (
              <View style={{flex: 1, flexDirection: 'column',justifyContent: 'center',alignItems:'center' , width:  wp('96%'),height:  hp('105%')}}>
                 <View style={{width: wp('100%'),height:  hp('8.5%'), position: 'absolute'}}></View>
                  <MapView style={styles.map}  provider={PROVIDER_GOOGLE} showsUserLocation={true} followUserLocation= {true} showsBuildings={true} ref={(ref) => this.mapView=ref} initialRegion={pos}>
                      { this.mode==="WALKING" &&
                        <Marker coordinate={{latitude: this.props.pos.latitude , longitude: this.props.pos.longitude}}>
                           <View style ={styles.userStyle}>
                           <Image style ={styles.userStyle} source= {{uri : 'https://media.giphy.com/media/Nle3G2U155vHi/giphy.gif'}} />
                         </View>
                        </Marker>
                      }
                      { this.mode==="DRIVING" &&
                        <Marker coordinate={{latitude: this.props.pos.latitude , longitude: this.props.pos.longitude}}>
                           <View style ={styles.userStyle2}>
                           <Image style ={styles.userStyle2} source= {{uri : 'https://www.pinclipart.com/picdir/big/141-1419823_svg-free-techflourish-collections-man-driving-pinterest-driving.png'}} />
                         </View>
                        </Marker>
                      }
                      {markers.map((marker, i) => (<Marker coordinate={marker.latlng} title={marker.text} key = {i}>
                          <View style ={styles.markerStyle}>
                            <Image style ={styles.markerStyle} source= {{uri : 'https://www.mountcarmelliving.com/wp-content/uploads/2016/07/map-marker.gif'}} />
                          </View>
                      </Marker>))}
                      {this.finished<1 && this.workedOnce<1 && (this.workedOnce= this.workedOnce+1) &&//if route is not finished keep drawing to next marker
                      <MapViewDirections
                        origin={{latitude: this.props.pos.latitude , longitude: this.props.pos.longitude}}//from user location to
                        destination={this.coordinates}//closest maker
                        apikey={GOOGLE_MAPS_APIKEY}
                        resetOnChange = {false}
                        timePrecision = "now"
                        presicion = "high"
                        mode={this.mode}
                        strokeWidth= {5}//kalınlık
                        strokeColor = "#BF1E2E"//renk
                        onStart={(params) => {
                         console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                          console.log(`Distance: ${result.distance} km`)
                          console.log(`Duration: ${result.duration} min.`)
                          this.mapdata.distance = result.distance;
                          this.mapdata.duration = parseInt(result.duration);

                          this.mapView.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                            }
                          });
                        }}
                      />}

                      {this.finished<1 && this.workedOnce>0 &&//if route is not finished keep drawing to next marker
                      <MapViewDirections
                        origin={{latitude: this.props.pos.latitude , longitude: this.props.pos.longitude}}//from user location to
                        destination={this.coordinates}//closest maker
                        apikey={GOOGLE_MAPS_APIKEY}
                        resetOnChange = {false}
                        timePrecision = "now"
                        presicion = "high"
                        mode={this.mode}//walking route
                        strokeWidth= {5}//kalınlık
                        strokeColor = "#BF1E2E"//renk
                        onStart={(params) => {
                         console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                          console.log(`Distance: ${result.distance} km`)
                          console.log(`Duration: ${result.duration} min.`)
                          this.mapdata.distance = result.distance;
                          this.mapdata.duration = parseInt(result.duration);
                        }}
                      />}
                  </MapView>
                  {closeEnough>0 &&//if distance to closest marker under DISTANCE_LIMIT show AR button
                      <View style={{flex:1,flexDirection: 'column',height: hp('20%'), width: wp('96%')}}>
                          <View style={{backgroundColor:"#BF1E2E", padding:10 , width: wp('96%')}} >
                            <Text style={styles.textStyle2}>Close to a checkpoint! Please STAY STILL and look for a Token with your camera!</Text>
                            <Text style={styles.textStyle3}> Distance :{this.mapdata.distance} km, Duration : {this.mapdata.duration} min</Text>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.buttonStyle21} onPress= { () => {this.buttonPress(closeEnough)}}>
                              <Text style={styles.textStyle}>Get Token</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonStyle21} onPress= { () => {this.mapView.animateToRegion(pos, 2000)}}>
                              <Text style={styles.textStyle}>Find Me</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonStyle21} onPress= { () => {this.mapView.fitToCoordinates([{latitude: this.coordinates.latitude, longitude: this.coordinates.longitude}], {
                              edgePadding: {
                                right: (width / 20),
                                bottom: (height / 20),
                                left: (width / 20),
                                top: (height / 20),
                              }
                            });
                          }}>
                              <Text style={styles.textStyle}>Find Marker</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                              <Image style={styles.markerStyle}
                                source= {{uri : 'https://lh3.googleusercontent.com/proxy/rY3OCHpu6ffO29_Mrv8sMe9kWc0mAUrUeBBmSR4r6CMrwDuB7X0TvuevzAa-rHQQYJJ3f1JJUFYDT-MlU2TlQ42qL8rT7xhe'}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                              <Image style={styles.markerStyle2}
                                source= {{uri : 'https://www.pinclipart.com/picdir/big/141-1419823_svg-free-techflourish-collections-man-driving-pinterest-driving.png'}} />
                            </TouchableOpacity>
                          </View>
                      </View>
                  }
                  {closeEnough<1 && this.finished<1 &&
                      <View style={{flex:1,flexDirection: 'column',height: hp('20%'), width: wp('96%')}}>
                        <View style={{backgroundColor:"#BF1E2E", padding:10}} >
                          <Text style={styles.textStyle2}>Follow the route and go to the next checkpoint!</Text>
                          <Text style={styles.textStyle3}> Distance :{this.mapdata.distance} km, Duration : {this.mapdata.duration} min</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity style={styles.buttonStyle2} onPress= { () => {this.mapView.animateToRegion(pos, 2000)}}>
                            <Text style={styles.textStyle}>Find Me</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonStyle2} onPress= { () => {this.mapView.fitToCoordinates([{latitude: this.coordinates.latitude, longitude: this.coordinates.longitude}], {
                            edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                            }
                          });
                        }}>
                            <Text style={styles.textStyle}>Find Marker</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                            <Image style={styles.markerStyle}
                              source= {{uri : 'https://lh3.googleusercontent.com/proxy/rY3OCHpu6ffO29_Mrv8sMe9kWc0mAUrUeBBmSR4r6CMrwDuB7X0TvuevzAa-rHQQYJJ3f1JJUFYDT-MlU2TlQ42qL8rT7xhe'}} />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                            <Image style={styles.markerStyle2}
                              source= {{uri : 'https://www.pinclipart.com/picdir/big/141-1419823_svg-free-techflourish-collections-man-driving-pinterest-driving.png'}} />
                          </TouchableOpacity>
                        </View>
                      </View>
                  }
                  {this.finished>0 &&//if route is finished show finish button
                      <View style={{flex:1,flexDirection: 'column', height: hp('20%'), width: wp('96%')}}>
                        <View style={{backgroundColor:"#BF1E2E", padding:10}} >
                          <Text style={styles.textStyle2}>Trip done. TAP FINISH.</Text>
                          <Text style={styles.textStyle3}> Distance :{this.mapdata.distance} km, Duration : {this.mapdata.duration} min</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={styles.buttonStyle21} onPress={this.finishTrip}>
                            <Text style={styles.textStyle}>FINISH</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonStyle21} onPress= { () => {this.mapView.animateToRegion(pos, 2000)}}>
                            <Text style={styles.textStyle}>Find Me</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonStyle21} onPress= { () => {this.mapView.fitToCoordinates([{latitude: this.coordinates.latitude, longitude: this.coordinates.longitude}], {
                            edgePadding: {
                              right: (width / 20),
                              bottom: (height / 20),
                              left: (width / 20),
                              top: (height / 20),
                            }
                          });
                        }}>
                            <Text style={styles.textStyle}>Find Marker</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                            <Image style={styles.markerStyle}
                              source= {{uri : 'https://lh3.googleusercontent.com/proxy/rY3OCHpu6ffO29_Mrv8sMe9kWc0mAUrUeBBmSR4r6CMrwDuB7X0TvuevzAa-rHQQYJJ3f1JJUFYDT-MlU2TlQ42qL8rT7xhe'}} />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.buttonStyle3} onPress= { () => {this.changeMode()}}>
                            <Image style={styles.markerStyle2}
                              source= {{uri : 'https://www.pinclipart.com/picdir/big/141-1419823_svg-free-techflourish-collections-man-driving-pinterest-driving.png'}} />
                          </TouchableOpacity>
                        </View>
                      </View>
                  //Burada bize yakın veya geçtiğimiz (token aldığımız) maerker ın index i ve ID si dahil sahip olduğu her veriye erişimimiz var ve istediğimiz gibi kullanabiliyoruz.
                  //DB de ayrı token yerine user in üstünden geçtiği marker ları ayrıca tutabiliriz veya her rota için bool array i DB ye gidebilir. Çünkü bütün rota takibi ve user nerde kaldı
                  //bir tane bool array ile anlaşılabilyor.
                  }

              </View>

        );
    }
}