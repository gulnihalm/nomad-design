import React, { Component } from 'react';
import { NativeModules, Text, View, TextInput, TouchableOpacity, Dimensions, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { createGuid, hostURL } from '../common/general';
import PasswordTextInput from '../common/PasswordTextInput';
import { GoogleSignin } from '@react-native-community/google-signin';
import { twitterAuthorization } from '../common/social/TwitterAuth';
import { google_signIn } from '../common/social/GoogleSignIn';

var { height, width } = Dimensions.get('window');
if(Platform.OS == 'android'){
	height = height-24;
}

//TWITTER
const { RNTwitterSignIn } = NativeModules;

export default class LoginPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// the following "userX" states are guaranteed to have values in the case of a successful login.
			userName: "",		// real name of the user, so it's not bound to be unique.
			userSurname: "",	// real surname of the user, like name, may not be unique.
			userPassword: "",	/* password of an account, it's encouraged to set and use a password after a new login, but it's not mandatory to do so,
			as a user can only login with one social media account as well. TODO: hash password */
			userEmail: "",		/* the main user email associated with an account. It is unique compared to other main emails in the table. It is guaranteed to be
			the same with at least one social media email in the same row, but it may or may not be the same with the other social media emails. */

			// These boolean parameters denote whether an entrance/synchronization with the associated login option has been made. Maybe in future you might opt to use
			// userPassword's existence for emailEntrance and social emails/ID's existence for social entrances, but I chose not to as I find myself using
			// these parameters quite often
			emailEntrance: false,
			fbEntrance: false,
			googleEntrance: false,
			twitterEntrance: false,

			/* Social media emails. On top of the things explained above with userEmail, the user has to have at least one social media account to enter.
			   As such, at least one of those emails will not be empty in the case of a successful login
			   they may or may not be unique within the same row but each social email will be unique within the same column */
			fbMail: "",
			googleMail: "",
			twitterMail: "",

			// Similar to social media emails, but it's their unique ID's instead. These ID's are created and given by their respective social medias.
			fbID: "",
			twitterID: "",
			googleID: "",

			guid: createGuid(), // create and assign a new guid in the case of new user entry, an entry is initially treated as new until proven otherwise. A guid is
			// unique to each account and is the most common way to identify a user throughout the program.
			pic: "",			/* picture link, the picture associated with the social media account will be shown in the case of a social login, however in the case of
			an email login, it will show the picture of the social media account that has been used to create the account */
			disable: false,		/* when a login button is pressed, this state is used to disable all the login buttons from future presses until the function associated with
			the initial press returns a response. Similar state variables with the same name are used throughout the program, and they are used for pretty much the same purposes*/
			email: "",			// this email state is used only for the text input that user enters their email in.

			userChoice:"",		/* throughout the program some "choice" parameters, most frequently userChoice, are used to denote what option has been picked to login,
			0 is facebook, 1 is google, 2 is twitter and 3 is regular email and password entrance, commonly referred to as just "email entrance"
			important thing to note here is that they are not stored as integers, but strings, this is done to avoid any confusion that may arise from type conversions */

		};
	}

	//EMAIL
	emailLogin() { // this is for email entrance
		let { userEmail, userPassword } = this.state;

		if (userEmail == "" || userPassword == "") {
			alert("Please fill every input field");
			this.setState({disable: false});
		}
		else {
			fetch( hostURL + 'user_login.php', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: userEmail,
					password: userPassword
				})
			})
			.then((res) => res.json()) // in the case of errors replace "json" with "text" and uncomment the line below to see console output.
			// especially "JSON Parse error: Unrecognized token" errors. This the same for every fetch error throughout the program
			.then((res) => {
				//console.log("email res: " + res );
				if (res.result == 1){ //SUCCESS
					alert("Welcome " + res.name);
					// we take the user to the main page now. this is an existing account login, so we get the values from the database.
					// important thing to note here is emailEntrance is directly given the true value as this is the direct email entrance
					Actions.MainPage({
						type: 'reset', userName: res.name, userSurname: res.surname, userEmail: userEmail, userPassword: userPassword,
						fbEntrance: res.fbEntrance, googleEntrance: res.googleEntrance, twitterEntrance: res.twitterEntrance,
						fbMail: res.facebookemail, googleMail: res.googleemail, twitterMail: res.twitteremail,
						googleID: res.googleid, twitterID: res.twitterid, fbID: res.facebookid,
						guid: res.guid, pic: res.pic, emailEntrance: true, register: false, userChoice: "3",
					});
				}
				else if (res.result == -1){ //WRONG OR NON-EXISTING USER
					alert("User not verified");
					this.setState({disable: false});
				}
				else if (res.result == -2){ //WRONG PASSWORD
					alert("Wrong Password");
					this.setState({disable: false});
				}
			})
			.catch((err) => { //ERROR
				alert("LOGIN " + err);
				this.setState({disable: false});
			})
		}
	}

	//TWITTER
	twitter_signIn() {
		//these are twitter keys and they can be found in the developer console of twitter
		let TWITTER_CONSUMER_KEY = "8ovOZFvJGnEXETzYb9OQv7TEZ";
		let TWITTER_CONSUMER_SECRET = "8E7HFH5mJFFhA0uITjj9GFbxgg6UJjjJVNSEZQ2vwxjXVTzphg";

		RNTwitterSignIn.init(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
		RNTwitterSignIn.logIn()
		.then(data => {
			//console.log("twitter data: " + data );
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
					//console.log("twitter res: " + res);
					if(res){
						let bigger = res.profile_image_url.replace("normal", "400x400"); //for bigger and more detailed picture link
						let name = res.name.split(' ').slice(0, -1).join(' '); //splitting name and surname
						let surname = res.name.split(' ').slice(-1).join(' ');
						this.setState({ // we set the values we get from the successful twitter login to states.
							userName: name, userSurname: surname, pic: bigger, userEmail: data.email, twitterID: data.userID,
							twitterMail: data.email, twitterEntrance: true, userChoice: "2", disable: true
						});
						this.socialCheck(this.state.twitterID);
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
        //console.disableYellowBox = true; //this line will be uncommented in the future to film the video, it makes warnings go away.
		GoogleSignin.configure({
			webClientId: '400607000498-jn424j5pgm227lanvijrctf4kktm2bpp.apps.googleusercontent.com',
			offlineAccess: false,
		});
	}

	//GOOGLE
	googleSignIn = async () => {
		let userInfo = await google_signIn();
		//console.log("google data: " + userInfo);
		if(userInfo){
			this.setState({ // we set the values we get from the successful google login to states.
				userName: userInfo.user.givenName, userSurname: userInfo.user.familyName, pic: userInfo.user.photo,
				userEmail: userInfo.user.email, googleMail: userInfo.user.email, googleID: userInfo.user.id, googleEntrance: true,
				userChoice: "1", disable: true
			});
			this.socialCheck(this.state.googleID);
		}
	}

	// FB
	fbLogin() {
		LoginManager.logInWithPermissions(['public_profile', 'email']).then(
			(result) => {
				if (!result.isCancelled) {
					AccessToken.getCurrentAccessToken().then(
						(data) => {
							//console.log("fb data: " + data);
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
			//console.log("fb result: " + result );
			let name = result.name.split(' ').slice(0, -1).join(' '); //splitting name and surname
			let surname = result.name.split(' ').slice(-1).join(' ');
			this.setState({ // we set the values we get from the successful fb login to states.
				fbEntrance: true, fbID: result.id, userName: name, userSurname: surname,
				pic: result.picture.data.url, userEmail: result.email, fbMail: result.email, userChoice: "0", disable: true
			});
			this.socialCheck(this.state.fbID);
		}
	}

	// This is where the social media interactions with the database happen after the user successfully logins from a social media, but
	// they may or may not pass to the main page of the program depending on the results of the checks done here.
	socialCheck = ( id ) => {
		let { userName, userSurname, userEmail, guid, userChoice, pic } = this.state;

		fetch( hostURL + 'social_login.php', {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: userName,
				surname: userSurname,
				email: userEmail,
				id: id,
				choice: userChoice,
				guid: guid,
				pic: pic,
			})
		})
		.then((res) => res.json())
		.then((res) => {
			//console.log("social check: " + res);
			if (res.result == 0){ //NEW LOGIN
				alert("Sisteme kaydınız yapıldı");
				Actions.MainPage({ // since this is a new entry we pass the user to the main page with the values we already set to the states. register is set to true
					// to denote that the RegisterModal (more info on this on its file) will be the first thing the user sees upon his arrival to the main page
					type: 'reset', userChoice: userChoice, register: true, pic: this.state.pic,
					userName: this.state.userName, userSurname: this.state.userSurname, userEmail: this.state.userEmail,
					fbMail: this.state.fbMail, googleMail: this.state.googleMail, twitterMail: this.state.twitterMail,
					googleID: this.state.googleID, twitterID: this.state.twitterID, fbID: this.state.fbID, guid: this.state.guid,
					googleEntrance: this.state.googleEntrance, fbEntrance: this.state.fbEntrance, twitterEntrance: this.state.twitterEntrance, emailEntrance: false,
				});
			}
			else if (res.result == 1){ //EXISTING LOGIN
				alert("Welcome " + res.name);
				Actions.MainPage({ // this is not a new entry so we get the values we need from the database. Email entrance is found depending on the existence of a password
					type: 'reset', userChoice: userChoice, register: false, pic: this.state.pic,
					userName: res.name, userSurname: res.surname, userEmail: res.email, userPassword: res.password,
					fbMail: res.facebookemail, googleMail: res.googleemail, twitterMail: res.twitteremail,
					googleID: res.googleid, twitterID: res.twitterid, fbID: res.facebookid, guid: res.guid,
					googleEntrance: res.googleEntrance, fbEntrance: res.fbEntrance, twitterEntrance: res.twitterEntrance, emailEntrance: (res.password)?(true):(false),
				});
			}
			else if (res.result == -2){ //SYNC - the email that is linked with the social media account that the user has tried to enter with already exists in database,
				//meaning that, that email has been used with another social media login. The social media account that the user has tried to enter with can be synchronized
				// to the said existing account.
				let acc = "";
				if(userChoice == "0")
					acc = " facebook";
				if(userChoice == "1")
					acc = " google";
				if(userChoice == "2")
					acc = " twitter";
				alert("Email associated with this" + acc + " account is used in another login. You need to login to other account and sync both accounts in order to used this" + acc + " account.");
				this.setState({disable: false});
			}
			else if (res.result == -1){
				alert("Login with social media account not verified: "  + res.error );
				this.setState({disable: false});
			}
		})
		.catch((err) => {
			alert("SC-LG " + err);
			this.setState({disable: false});
		})
	}

	render() {
		return (
			<View style={{ backgroundColor: "#E7E6EC", flex: 1, justifyContent: 'center', alignItems: 'center', top: -hp(0.9) }}>
				<View style={{ marginVertical: 8.3, width: wp(50) }}>
					<TouchableOpacity style={[styles.button, { backgroundColor: "#3b5998" }]}
						onPress={this.fbLogin.bind(this)}
						disabled={this.state.disable}>
						<Text style={styles.buttonText}>Login with Facebook</Text>
					</TouchableOpacity>
				</View>

				<View style={{ marginVertical: 8.3, width: wp(50) }}>
					<TouchableOpacity style={[styles.button, { backgroundColor: "#db4437" }]}
						onPress={this.googleSignIn}
						disabled={this.state.disable}>
						<Text style={styles.buttonText}>Login with Google</Text>
					</TouchableOpacity>
				</View>

				<View style={{ marginVertical: 8.3, width: wp(50) }}>
					<TouchableOpacity style={[styles.button, { backgroundColor: "#00acee" }]}
						onPress={this.twitter_signIn.bind(this)}
						disabled={this.state.disable}>
						<Text style={styles.buttonText}>Login with Twitter</Text>
					</TouchableOpacity>
				</View>

				<View style={{ marginVertical: 8.3, borderBottomWidth: 1, borderBottomColor: '#C6C6CC', width: wp(90) }}/>
				<View style={{ width: wp(75) }}>
					<Text style={{ color:'#96969C', fontSize: 10, textAlign: 'center' }}>If you created a password during an old login seesion</Text>
				</View>

				<TextInput
					style={{ width: wp(75), borderBottomColor: 'black', borderBottomWidth: 1 }}
					onChangeText={(value) => this.setState({ userEmail: value, email: value })}
					value={this.state.email}
					placeholder="E-mail"
					autoCorrect={false} autoCapitalize="none" autoCompleteType="off" />

				<PasswordTextInput
					borderColor='black'
					onChangeText={(value) => this.setState({ userPassword: value })}
					value={this.state.userPassword}
					placeholder="Passoword" />

				<View style={{ marginVertical: 8.3, width: wp(25) }}>
					<TouchableOpacity style={styles.button}
						onPress={this.emailLogin.bind(this)}
						onPressOut={()=>{this.setState({disable: true});}}
						disabled={this.state.disable}>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
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
		padding: 10
	},
	buttonText: {
		fontSize: 18,
		color: '#fff'
	},
});
