# nomad-design

## To run the code:
1. Run "npm install" in root project folder
2. "cd android" then run "gradlew clean" until it works
3. "cd .." then "npx react-native run-android"

In "index.js", on line "AppRegistry.registerComponent(appName, () => x);" replace x with "Login" to enable login process; or with "App" to view and test App.js directly

## Login requirements
1. Run XAMPP ([download link for XAMPP](https://www.apachefriends.org/download.html))
2. Get your IP adress
3. In "src/common/general.js" edit the "hostURL" variable's IP adress and port number parts with your IP adress and the port you use for XAMPP (default is 80)

   So the format is "http://your_ip_adress:your_xampp_port_number/login_php/"  
4. Cut the "login_php" file (located in "src") and put it in "xampp/htdocs/"
5. In XAMPP start Apache
6. Edit "index.js" (look to first section)
7. Run the code
