import AsyncStorage from '@react-native-community/async-storage';

//IP adress of your device and port number (type "ipconfig" on cmd to see your IPv4 adress) 10.0.2.2:8080 on emulator
//Don't change the "/login_php/" part
export const hostURL = 'http://192.168.1.31:8080/login_php/'; 

export async function isLogin() {
	var session = await AsyncStorage.getItem("session_ticket");
	if (session != null)
		return true;
	return false;
}

/*export async function setSessionTicket(ticket) {
	AsyncStorage.setItem("session_ticket", ticket);
}

export async function logOut() {
	await AsyncStorage.removeItem("session_ticket");
}*/

export function createGuid(){  
   return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
      return v.toString(16);  
   });  
}  