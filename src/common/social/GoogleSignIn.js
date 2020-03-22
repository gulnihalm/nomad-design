import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import {Actions} from 'react-native-router-flux';

export async function google_signIn(){
    try {
        await GoogleSignin.hasPlayServices();
        let userInfo = await GoogleSignin.signIn();
        return userInfo;
    }
    catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // sign in was cancelled
            // alert('cancelled');
        }
        else if (error.code === statusCodes.IN_PROGRESS) {
            // operation in progress already
            alert('GOOGLE - in progress');
        }
        else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            alert('GOOGLE - play services not available or outdated');
        }
        else {
            alert('GOOGLE-LOGIN' + error.toString());
        }
        return null;
    }
}

export async function google_signOut() {
	try {
		await GoogleSignin.revokeAccess();
		await GoogleSignin.signOut();
	}
	catch (error) {
	  	alert( "GOOGLE - sign out failed: " + error );
	}
};