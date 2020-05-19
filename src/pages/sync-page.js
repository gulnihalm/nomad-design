import React, { Component } from 'react';
import { NativeModules, Text, View, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { twitterAuthorization } from '../common/social/TwitterAuth';
import { google_signIn, google_signOut } from '../common/social/GoogleSignIn';
import { hostURL } from '../common/general';

var { height, width } = Dimensions.get('window');
if(Platform.OS == 'android'){
	height = height-24;
}

//TWITTER
const { RNTwitterSignIn } = NativeModules;

export default class SyncPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
            guid:               this.props.guid, 			//guid of the account that will be synced
            googleEntrance:   	this.props.googleEntrance, 	//google account linked in the account that will be synced?
            fbEntrance:    		this.props.fbEntrance,		//fb account linked in the account that will be synced?
			twitterEntrance:  	this.props.twitterEntrance,	//twitter account linked in the account that will be synced?
			socialID:           "",							//social id of the account that will be linked
			socialMail:			"",							//social email of the account that will be linked
			userChoice:         this.props.userChoice, 		//what social media option the user selected to end up here. (1=fb, 2=g, 3=tw)
			disable:			false,
		};
	}

	//TWITTER
	twitter_sync() {
		let TWITTER_CONSUMER_KEY = "8ovOZFvJGnEXETzYb9OQv7TEZ";
		let TWITTER_CONSUMER_SECRET = "8E7HFH5mJFFhA0uITjj9GFbxgg6UJjjJVNSEZQ2vwxjXVTzphg";

		RNTwitterSignIn.init(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
		RNTwitterSignIn.logIn()
		.then(data => {
			const { authToken, authTokenSecret } = data;
			if (authToken && authTokenSecret) {
				fetch(`https://api.twitter.com/1.1/users/show.json?screen_name=${data.userName}`, {
					method: "GET",
					headers: {
						'Authorization': twitterAuthorization(
							'GET',
							'https://api.twitter.com/1.1/users/show.json',
							{ 'screen_name': data.userName },
							authToken,
							authTokenSecret
						)
					},
				})
				.then((res) => res.json())
				.then((res) => {
					if(res){
						this.setState({ socialID: data.userID, socialMail: data.email, disable: true });
						this.sync( "2" );
					}
				})
				.catch((err) => {
					alert("TWITTER-LOGIN (1) " + err);
				})
			}
		})
		.catch(error => {
			//alert("TWITTER-LOGIN (2) " + error);
		})
	}

	//GOOGLE
	async componentDidMount() {
		GoogleSignin.configure({
			webClientId: '400607000498-jn424j5pgm227lanvijrctf4kktm2bpp.apps.googleusercontent.com',
			offlineAccess: false,
		});
	}

	//GOOGLE
	googleSync = async () => {
		let userInfo = await google_signIn();
		if(userInfo){
			this.setState({ socialID: userInfo.user.id, socialMail: userInfo.user.email, disable: true });
			this.sync( "1" );
		}
	}

	// FB
	fbSync() {
		LoginManager.logInWithPermissions(['public_profile', 'email']).then(
			(result) => {
				if (!result.isCancelled) {
					//alert('Login success with permissions: ' + JSON.stringify(result));
					AccessToken.getCurrentAccessToken().then(
						(data) => {
							const infoRequest = new GraphRequest(
								'/me?fields=email,name,picture.type(large)',
								null,
								this.fb_responseInfoCallback
							);
							new GraphRequestManager().addRequest(infoRequest).start();
						}
					)
				}
			},
			(error) => {
				alert('FB - Login fail with error: ' + error);
			}
		);
	}

	// FB
	fb_responseInfoCallback = (error, result) => {
		if (error) {
			alert('FB - Error fetching data: ' + error.toString());
		}
		else {
			this.setState({ socialMail: result.email, socialID: result.id, disable: true});
			this.sync( "0" );
		}
	}

	sync = ( syncChoice ) => {
		let { guid, userChoice, socialMail, socialID } = this.state;

		fetch( hostURL + 'sync.php', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: socialID,
				mail: socialMail,
				choice: syncChoice,
				guid: guid,
			})
		})
		.then((res) => res.json())
		.then((res) => {
			if (res.result == 1){
				alert("Senkronizasyon başarılı. Tekrar giriş yapmanız gerekiyor.");
				Actions.LoginPage({type: 'reset'});
			}
			else if (res.result == -1){
				alert("Senkronizasyon başarısız.");
				this.setState({disable: false});
			}
			else if (res.result == -2){
				let acc = "";
				if(syncChoice == "0")
					acc = " facebook";
				if(syncChoice == "1")
					acc = " google";
				if(syncChoice == "2")
					acc = " twitter";
				alert("Bu" + acc + " hesabıyla bağlantılı bir kitapapp hesabı kullanımda. Eğer senkronize etmek istiyorsanız öncelikle iki kitapapp hesabından birini silmeniz gerekiyor.");
				this.setState({disable: false});
			}

			if( (res.result == 1 && userChoice == "0") || syncChoice == "0" ){
				LoginManager.logOut();
			}
			if( (res.result == 1 && userChoice == "1") || syncChoice == "1" ){
				google_signOut();
			}
			if( (res.result == 1 && userChoice == "2") || syncChoice == "2" ){
				RNTwitterSignIn.logOut();
			}
		})
		.catch((err) => {
			alert("SYNC " + err);
			this.setState({disable: false});
		})
	}

	render() {
		return (
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, justifyContent: 'center', alignItems: 'center', top: -hp(0.9) }}>

                {!this.state.fbEntrance &&
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#3b5998" }]}
                            onPress={this.fbSync.bind(this)}
							disabled={this.state.disable}>
                            <Text style={styles.buttonText}>Facebook Hesabını Senkronize Et</Text>
                        </TouchableOpacity>
                    </View>
                }

                {!this.state.googleEntrance &&
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#db4437" }]}
                            onPress={this.googleSync}
							disabled={this.state.disable}>
                            <Text style={styles.buttonText}>Google Hesabını Senkronize Et</Text>
                        </TouchableOpacity>
                    </View>
                }

                {!this.state.twitterEntrance &&
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#00acee" }]}
                            onPress={this.twitter_sync.bind(this)}
							disabled={this.state.disable}>
                            <Text style={styles.buttonText}>Twitter Hesabını Senkronize Et</Text>
                        </TouchableOpacity>
                    </View>
				}

				<View style={{
					width: wp(25), top: height/2 - hp(18) - (!this.state.fbEntrance && hp(6))
					- (!this.state.googleEntrance && hp(6)) - (!this.state.twitterEntrance && hp(6))
				}}>
                    <TouchableOpacity style={styles.altButton}
                        onPress={()=>{Actions.pop();}}>
                        <Text style={styles.buttonText}>İptal</Text>
                    </TouchableOpacity>
                </View>

				<View style={{
					alignItems: 'center', top: height/2 - hp(18) - (!this.state.fbEntrance && hp(6))
					- (!this.state.googleEntrance && hp(6)) - (!this.state.twitterEntrance && hp(6))
				}}>
                    <View style={{ marginVertical: 8.3, borderBottomWidth: 1, borderBottomColor: '#C6C6CC', width: wp(90) }}/>
					<View style={{ width: wp(75) }}>
						<Text style={{ color:'#96969C', fontSize: 10, textAlign: 'center' }}>Lütfen senkronize edeceğiniz hesabın başka bir kitapapp hesabı ile bağlantılı olmadığından emin olun.</Text>
					</View>
                    <View style={{ marginVertical: 8.3, borderBottomWidth: 1, borderBottomColor: '#C6C6CC', width: wp(90) }}/>
                    <View style={{ width: wp(75) }}>
                        <Text style={{ color:'#96969C', fontSize: 10, textAlign: 'center' }}>Hesaplarınızı senkronize etmek zorunda değilsiniz, ancak aynı e-mail ile bağlantılı farklı sosyal medya hesaplarını kullanarak yeni hesap oluşturamazsınız.</Text>
                    </View>
                </View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 30,
		backgroundColor: '#BF1E2E',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 18
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
