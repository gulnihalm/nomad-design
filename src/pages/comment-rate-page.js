import React, { Component } from 'react';
import { NativeModules, Text, TextInput, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hostURL } from '../common/general';
import { Rating, AirbnbRating } from 'react-native-ratings';

var { height, width } = Dimensions.get('window');
if(Platform.OS == 'android'){
	height = height-24;
}
const IMAGE = require('../a.gif');
export default class CommentRatePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
            guid:           this.props.guid,
            tripID:         this.props.tripID,
            tripName:       this.props.tripName, 
            label:          this.props.label, 
            description:    this.props.description,
            comment:        "",
            rating:         5,
            disable:        false,
		};
    }

    submitCommentAndRate(){
        let {guid, tripID, comment, rating} = this.state;
        if(comment == ""){
            alert("Puanlamanızla birlikte bir yorum da eklemelisiniz.");
        }
        else{
            fetch(hostURL + 'commentAndRate.php', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guid: guid,
                    tripID: tripID,
                    comment: comment,
                    rating: rating
                })
            })
            .then((response)=> response.json())
            .then((response) => {
                console.log('commentAndRate response: ', response);
                if(response.result == 1){
                    Actions.popTo('ProfilePage');
                    alert("Yorumunuz ve puanlamanız başarıyla eklendi");
                }
                else if( response.error != "" ){
                    alert("Yorumunuz ve puanlamanız eklenemedi");
                }
            }).catch((error) => {
                alert('Comment and rate error: ', error);
            });
        }
        this.setState({ disable: false });
    }

	render() {
        let {trips, requestDone} = this.state;
        console.log(this.state.rating);
		return (
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{top:hp(3), flex:1, alignItems: 'center'}}>
                    <Text style={[styles.text, {fontSize: 25}]}>{this.state.tripName}</Text>
                    <View style={styles.textWrapper}>
                        <Text style={[styles.text,{fontSize: 20, fontWeight:'bold'}]}>{this.state.label}</Text>
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={styles.text}>{this.state.description}</Text>
                    </View>
                    
                    <TextInput 
                        style={{ width: wp(75), marginVertical:hp(2), borderColor: 'black', borderWidth: 0.5 }}
                        onChangeText={(value) => this.setState({ comment: value })}
                        value={this.state.comment}
                        multiline
                        numberOfLines={10}
                        maxLength={65535}
                        textAlignVertical='top'
                        placeholder="Yorumunuzu yazın"
                        autoCorrect={false} autoCapitalize="none" autoCompleteType="off" />
                    
                    <AirbnbRating
                        reviews={["Çok kötü", "Kötü", "İdare Eder", "İyi", "Süper"]}
                        size={wp(12)}
                        reviewColor='#BF1E2E'
                        selectedColor='#BF1E2E'
                        onFinishRating={(rating)=>{this.setState({rating: rating});}}
                        reviewSize={20}
                        defaultRating={5}/>
                    <TouchableOpacity style={[styles.button,{marginVertical:hp(2)}]}
                        onPress={this.submitCommentAndRate.bind(this)}
                        onPressOut={()=>{this.setState({disable: true});}}
                        disabled={this.state.disable}>
                        <Text style={styles.buttonText}>Gönder</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', width: wp(25), top: height - hp(9) }}>
                    <TouchableOpacity style={styles.altButton}
                        onPress={()=>{Actions.pop();}}>
                        <Text style={styles.buttonText}>Geri</Text>
                    </TouchableOpacity>
                </View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        color: '#000',
        textAlign: 'center',
    },
    textWrapper: {
        marginVertical: 8.3,
    },
    button: {
		borderRadius: 30,
		backgroundColor: '#BF1E2E',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	buttonText: {
		fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    buttonWrapper: {
        marginVertical: 8.3,
        width: wp(55),
    },
    altButton: {
		borderRadius: 30,
		backgroundColor: 'grey',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
});
