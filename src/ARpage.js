import React, { Component } from 'react'
import { StyleSheet, View, Alert, Text, Button, TouchableOpacity, Image, Dimensions, Animated ,PanResponder,DeviceEventEmitter, NativeModules, BackHandler} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera'
import { gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;

class ARpage extends Component {
    constructor(props) {
    super(props);

    this.token= {x: 0, y:0}//token place (pixel)
    this.state = {
      x:0,//initial place for token(degree to translate)
      y:0,//oynayabiliyoruz
      //t: true,
    };
  }

componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);//telefonun geri tuşu çalışmasın
  const subscription = gyroscope.subscribe(({x,y }) => {//gyroscope açık
    x= parseInt((100*x))/100// degree to int
    y= parseInt((100*y))/100
    this.setState(state => ({
      x: x + state.x , y: y + state.y// degree turn
    }));
    if(this.token.y  >2150 || this.token.y<-2150){//360 degree turn
      this.setState({x:0});

   }
    if(this.token.x >2150 || this.token.x <-2150){//360 degree turn
      this.setState({y:0});

   }
    this.token.x = parseFloat((this.state.y - 0.03) * 30)//degree to pixel translation
    this.token.y = parseFloat((this.state.x + 0.05) * 30)//degree to pixel translation

  });
  setUpdateIntervalForType(SensorTypes.gyroscope, 45);//gyroscope interval, smaller for more presicion, but if too small phone heats up! 45 is fine
  this.setState({ subscription });
}
  handleBackButton() {//telefonun geri tuşu çalışmasın
    return true;//telefonun geri tuşu çalışmasın
}
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);//telefonun geri tuşu çalışmasın
    this.state.subscription.unsubscribe();//gyroscope kapalı
}


  render() {
    //console.log(this.state.t);
    return (
      <View style={styles.container}>
        <RNCamera
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}
          ref={ref => {
            this.camera = ref
          }}
          captureAudio = {false}
        >
          <TouchableOpacity style={[styles.token,
            {alignItems: 'center', justifyContent: 'center'},
            {transform:[{translateX:this.token.x},
                        {translateY: this.token.y }]}]}
            onPress= {()=>Actions.popTo("MainPage",{})}>
            <Image style={[styles.token]}
              source= {{uri : 'https://i.pinimg.com/originals/c1/2d/c5/c12dc536b8f8797b629eb9942a2dbbf1.gif'}} />
          </TouchableOpacity>
        </RNCamera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    width: wp('100%'),
    height: wp('100%'),
  },
  token: {
    width: wp('50%'),
    height: wp('50%'),
    position: 'absolute',
  },
})


export default ARpage
