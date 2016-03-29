# Moose Prototype

The prototype for Moose - Local Music Radio Meritocracy

To run the prototype's iOS build on an Apple computer:

* Install Xcode if you haven't already

* Install Node.js if you havent already

* Install Cordova if you haven't already. In the Terminal, input:

`npm install -g cordova`

* Download this repository

* Find "MooseServer/assets/js/RadioHome.js" and set the variable "domain" equal to the domain/IP of where you plan to host from. This can be found in your router's control panel, usually found at http://192.168.1.1/ on home LANs

* Navigate to "MooseServer" in the Terminal and input

`npm install`

* Next we need the sails project to make the front-end content that Cordova uses, so input 

`sails www`

* The assets are now sitting in "MooseServer/www", copy them to "MooseApp/www" and replace all the existing files

* Navigate to MooseApp in the Terminal and input

`cordova build`

* Open MooseApp/platforms/ios/HelloCordova.xcodeproj with Xcode

* You might need my developer account information to build, I'm not sure. If you can build, set an emulator or device and hit the play button. You should hear music once the app launches.