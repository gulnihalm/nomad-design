import React, { Component } from 'react'
import { StyleSheet, View, Alert, Text, Button, TouchableOpacity, Image, Dimensions, PixelRatio, Animated ,PanResponder,DeviceEventEmitter, NativeModules, BackHandler} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { RNCamera } from 'react-native-camera'
import { gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

//830.5714285714286 411.42857142857144
//const objWidth = width/8;
//const objHeight = height/8;

class ARpage extends Component {
    constructor(props) {
    super(props);

    this.token= {x: 0, y:0}//token place (pixel)
    this.state = {
      x: Math.random() < 0.5 ? (Math.random()*(-16)) : (Math.random()*(16)),//initial place for token(degree to translate)
      y: Math.random() < 0.5 ? (Math.random()*(-22)) : (Math.random()*(22)),//oynayabiliyoruz
      rt: Math.floor(Math.random() * 6)
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
    //console.log(this.state.x,"XX....YYYY", this.state.y);
    if(this.token.y  >2150 || this.token.y<-2150){//360 degree turn
      this.setState({x:0});

   }
    if(this.token.x >2150 || this.token.x <-2150){//360 degree turn
      this.setState({y:0});

   }
    this.token.x = parseFloat((this.state.y - 0.03) * 30)//degree to pixel translation
    this.token.y = parseFloat((this.state.x + 0.05) * 30)//degree to pixel translation

  });
  setUpdateIntervalForType(SensorTypes.gyroscope, 35);//gyroscope interval, smaller for more presicion, but if too small phone heats up! 45 is fine
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
            {this.state.rt ===0 &&
              <Image style={[styles.token]}
              source= {require("../images/AR1.gif")} />
            }
            {this.state.rt ===1 &&
              <Image style={[styles.token2]}
              source= {require("../images/AR2.gif")} />
            }
            {this.state.rt ===2 &&
              <Image style={[styles.token]}
              source= {require("../images/AR3.gif")} />
            }
            {this.state.rt ===3 &&
              <Image style={[styles.token]}
              source= {require("../images/AR4.gif")} />
            }
            {this.state.rt ===4 &&
              <Image style={[styles.token]}
              source= {require("../images/AR5.gif")} />
            }
            {this.state.rt ===5 &&
              <Image style={[styles.token3]}
              source= {require("../images/AR6.gif")} />
            }
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
    width: wp('40%'),
    height: wp('40%'),
    position: 'absolute',
  },
  token2: {
      width: wp('20%'),
      height: wp('20%'),
      position: 'absolute',
    },
    token3: {
        width: wp('65%'),
        height: wp('40%'),
        position: 'absolute',
      },
})


export default ARpage
