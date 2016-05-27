Neighbourhood Map
========================

###Summary###
  This web app provides user with ability to search for the city and get the restaurant information in its neighborhood. This app is developed using Angular.js, HTML5 and TwitterBootstrap. It employs concept of OOJS, built upon MVVM framework of Angular and features its Routing, Service and Controller concepts.

----------

### Project Setup###

 - Copy the repo in your system and double click on index.html.
 -  You can check the Live Demo [here](https://developer.chrome.com/devtools/docs/timeline)

### Navigation###

1. In the input box enter the city name and hit Search Box. (You will see the url changing with city name appended to url). This will trigger the Angular-Routing and inject the restaurant.html page clubbed with restaurantController.js
2. A page will be displayed with map of the neighborhood with all the nearby restaurants marked on the map.
3. On the left panel you will see a list of the restaurants. It also has a search bar on top of it where you can search for the restaurants and it will filter based on your search term.
4. Clicking on any restaurant will make its respective marker to bounce highlighting its location on the map and also underneath the restaurant name, it's rating and list will be displayed.
5.  A title stripe will be displayed on top which has the option to search any other city.

----------

### Architecture###
This app employs MVVM model of Angular js. MVVM stands for Model-View-ViewModel. In this app it is achieved as can be explained using following image.


![MVVM](/images/mvvm.PNG)

Angular-Routing: ng-route after 1.4.0 was implemented as separate library instead of integral part of Angular.js. It defined the binding of View-Controller(View-Model). In the controller class we inject the service class. In this case the controller is retaurantController.js and Service injected is mapService.js

####View####
##### Index.html#####
This is the initial html files which gets loaded to the browser. It is the home page of the app and also contains the ng-view div.
**ng-view** div is where angular will inject the dynamic html based on Angular Routing using the url in the address-bar. Also body has **ng-app** defined ad myApp. The definition of myApp would be elaborated in config.js

#####restaurant.html#####
It contains the container for the Map which controller received from mapService.js and also the side menu which contains the list of all the restaurants.

#####error.html#####
We handled the errors in the app by routing them to separate page. I also provided a way to navigate back to home page from error page. This provides more cleaner and secure way of handling errors.

#### Config.js####
This file contains the configuration of the application. It basically has Angular Routing defined in it.

####Controller####
#####restaurantController.js#####
This controller is bind with restaurant.html and it injects the mapService.
I am handling Async and also nested service calls by **angular-promises.**
It has the functionality to updateMarkers when user filters the restaurant from the side nav list, renderMap based on the url which contains the city name, renderPlaces to display the list of restaurants and also handles the event to bounce the marker on map when any restaurant is selected.

####Service####
In this app model is basically third party google maps and google places library. Follwing calls are made to google maps-API.
1. GeoLocation: to get the lat lang coordinates of given location.
2. MapInitialization: to get the map centered on the geoLocation.
3. Places: To get the nearby restaurants places

Since the calls are async, I have used **$q** to store the promises of the service requests.

###Important Links####
Google API: https://developers.google.com/maps/
Angular-Routing: http://viralpatel.net/blogs/angularjs-routing-and-views-tutorial-with-example/
Angular Promises: http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
