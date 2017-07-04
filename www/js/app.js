// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',
                           //'ionic.service.core',
                           //'ionic.service.analytics',
                           'ngMessages',
                           'ui.utils.masks',
                           'ui.router',
                           'firebase',
                           'ngCordova',
                           'app.core'])

.run(function(
            appServices,
            utilsServices,

            C_TIPO_AMBIENTE,
            C_APP_MENSAGENS,
            C_STORAGE,

            $rootScope,
            $global,
            $state,
            $ionicPlatform,
            $ionicHistory,
            $ionicPopup,
            GoogleMaps) {

  // Verificar se o variável "$global" não está definido
  if ($global == undefined) {
      /* eslint-disable no-param-reassign */
      // Garantir que ele está definido (se não, qualquer tentativa de usar $global.xpto dará erro)
      $global = {};
      /* eslint-enable no-param-reassign */
  }

  if ($global.ambiente != C_TIPO_AMBIENTE.producao) {
      console.log("---> config-Init #01 ($global.ambiente= " + appServices.getNomeAmbiente({ ambiente: $global.ambiente }) + ")");
  }

  // Buscar o último ambiente que foi acessao no aparelho (caso não tenha, presume "Produção")
  $global.ambiente = utilsServices.getStorage(
      C_STORAGE.ambiente,
      C_TIPO_AMBIENTE.producao);  // Ambiente padrão quando é primeira execução do App

  if ($global.ambiente != C_TIPO_AMBIENTE.producao) {
      console.log("---> config-Init #02 ($global.ambiente= " + appServices.getNomeAmbiente({ ambiente: $global.ambiente }) + ")");
  }

  $ionicPlatform.ready(function() {

    // Verificar se estamos conectados a internet
    if (window.Connection) {
        // Verificar se não temos nenhum tipo de conexão com a internet
        if (navigator.connection.type == Connection.NONE) {
            // Apresentar uma mensagem de erro para o usuário
            $ionicPopup.alert({
                title: "Acesso a Internet",
                content: C_APP_MENSAGENS.erroConectarInternet
            }).then(function() {
                // Sair do App
                ionic.Platform.exitApp();
            });
        }
    }

    // Verificar se temos informações do Device
    if (window.device) {
        $global.device = {}
        $global.device.cordova = device.cordova;
        $global.device.uuid = device.uuid;
        $global.device.model = device.model;
        $global.device.platform = device.platform;
        $global.device.version = device.version;
        $global.device.manufacturer = device.manufacturer;
        $global.device.isVirtual = device.isVirtual;
        $global.device.serial = device.serial;
    }

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getToken().then(function(accessToken) {
          // User is signed in.
          if($rootScope.usuario == undefined){
            $rootScope.usuario = {};
          }
          $rootScope.usuario.nome = user.displayName;
          $rootScope.usuario.email = user.email;
          if($rootScope.loginData != undefined)
            $rootScope.usuario.senha = $rootScope.loginData.senha;
          $rootScope.usuario.emailVerified = user.emailVerified;
          $rootScope.usuario.photoURL = user.photoURL;
          $rootScope.usuario.isAnonymous = user.isAnonymous;
          $rootScope.usuario.uid = user.uid;
          $rootScope.usuario.dados = user.providerData;
          $rootScope.usuario.provider = 'facebook';
          $rootScope.usuario.avatarURI = appServices.showAvatar();
          $rootScope.usuario.token = accessToken;

          // Salvar os dados do usuário localmente
          utilsServices.setStorage(C_STORAGE.usuario, $rootScope.usuario);

          // Preparar os paramêtros para ir para a tela de Alta Performance
          var stateParams = {
              openSideMenu: false, // Sinalizar que queremos o sidemenu aberto
          };

          // Desabilitar o botão voltar para voltar para essa tela
          $ionicHistory.nextViewOptions({
              disableBack: true
          });

          $state.go("app.map", stateParams);
        });
      } else {
        $state.go("app.login", stateParams);
      }
    }, function(error) {
      console.log(error);
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'layout/menu.html',
      controller: 'MenuCtrl'
      /*
      onEnter: function() {
          appServices.verbose('===== onEnterState.app-Init');
          appServices.verbose('===== onEnterState.app-Fim');
      },
      onExit: function() {
          appServices.verbose('===== onExitState.app-Init');
          appServices.verbose('===== onExitState.app-Fim');
      }
      */
  })
  .state('app.login', {
    url: '/login',
    views: {
        'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
  })
  .state('app.signup', {
    url: '/signup',
    views: {
        'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'LoginCtrl'
          }
        }
  })
  .state('app.signin', {
    url: '/signin',
    views: {
        'menuContent': {
            templateUrl: 'templates/signin.html',
            controller: 'LoginCtrl'
          }
        }
  })
  .state('app.map', {
    url: '/map/:openSideMenu',
    views: {
        'menuContent': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }
  })
  .state('app.placenew', {
    url: '/placenew/:openSideMenu',
    views: {
        'menuContent': {
            templateUrl: 'place/placenew.html',
            controller: 'PlaceNewCtrl'
          }
        }
  })
  .state('app.places', {
    url: '/places/:openSideMenu/:searchType/:country/:state/:city',
    views: {
        'menuContent': {
            templateUrl: 'place/placelist.html',
            controller: 'PlaceCtrl'
          }
        }
  })
  .state('app.countries', {
    url: '/countries/:openSideMenu',
    views: {
        'menuContent': {
            templateUrl: 'country/countrylist.html',
            controller: 'CountryCtrl'
          }
        }
  })
  .state('app.states', {
    url: '/states/:openSideMenu/:country',
    views: {
        'menuContent': {
            templateUrl: 'state/statelist.html',
            controller: 'StateCtrl'
          }
        }
  })
  .state('app.cities', {
    url: '/cities/:openSideMenu/:country/:state',
    views: {
        'menuContent': {
            templateUrl: 'city/citylist.html',
            controller: 'CityCtrl'
          }
        }
  })
  .state('app.place', {
    url: '/place/:placeId/:openSideMenu',
    views: {
        'menuContent': {
            templateUrl: 'place/place.html',
            controller: 'PlaceCtrl'
          }
        }
  });

  $urlRouterProvider.otherwise("/app/login");

})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }

    }
  }
})

.factory('States', function($http) {

  var states = [];

  return {
    getStates: function(params){

      return $http.get("http://guiaespirita.mythe.com.br/services/list_states.php",{params:params}).then(function(response){
          states = response;
          return states;
      });


    }
  }
})

.factory('Cities', function($http) {

  var cities = [];

  return {
    getCities: function(params){

      return $http.get("http://guiaespirita.mythe.com.br/services/list_cities.php",{params:params}).then(function(response){
          cities = response;
          return cities;
      });


    }
  }
})

.factory('Countries', function($http) {

  var countries = [];

  return {
    getCountries: function(params){

      return $http.get("http://guiaespirita.mythe.com.br/services/list_countries.php",{params:params}).then(function(response){
          countries = response;
          return countries;
      });


    }
  }
})

.factory('Markers', function($http) {

  var markers = [];

  return {
    getMarkers: function(params){

      return $http.get("http://guiaespirita.mythe.com.br/services/searchMarkersForPlacesAround.php",{params:params}).then(function(response){
          markers = response;
          return markers;
      });


    },
    getMarker: function(id){

    }
  }
})

.factory('Places', function($http) {

  var places = [];

  return {
    getPlaces: function(params){
      if(params.searchType == 'PROXIMITY'){
        return $http.get("http://guiaespirita.mythe.com.br/services/searchPlacesAround.php",{params:params}).then(function(response){
            places = response;
            return places;
        });
      } else if(params.searchType = "FILTER"){
        return $http.get("http://guiaespirita.mythe.com.br/services/list_places.php",{params:params}).then(function(response){
            places = response;
            return places;
        });
      }


    },
    getPlace: function(id){

    }
  }
})

.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading,
$rootScope, $cordovaNetwork, Markers, ConnectivityMonitor){

  var markerCache = [];
  var markerCluster = [];
  var markerClusterer = null;
  var apiKey = false;
  var map = null;
  var mapId = "map";

  function initMap(){

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options)
.then(function(position){

      var latLng = new google.maps.LatLng(position.coords.latitude,
position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById(mapId),
mapOptions);

      var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          draggable:true
      });

      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

      google.maps.event.addListener(marker, 'dragend', function(evt){
        console.log("marker moved!");
        map.panTo(this.getPosition()); // Set map center to marker position
        $rootScope.latitude = evt.latLng.lat();
        $rootScope.longitude = evt.latLng.lng();
        loadMarkers();
      });

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
        loadMarkers();

        //Reload markers every time the map moves
        google.maps.event.addListener(map, 'dragend', function(){
          console.log("moved!");
          loadMarkers();
        });

        //Reload markers every time the zoom changes
        google.maps.event.addListener(map, 'zoom_changed', function(){
          console.log("zoomed!");
          loadMarkers();
        });

        enableMap();

      });

    }, function(error){
      console.log("Could not get location");
    });

  }

  function enableMap(){
    $ionicLoading.hide();
  }

  function disableMap(){
    $ionicLoading.show({
      template: 'Você precisa estar conectado a Internet para ver essa página.'
    });
  }

  function loadGoogleMaps(){

    $ionicLoading.show({
      template: 'Carregando Google Maps'
    });

    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
      initMap();
    };

    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    //Note the callback function in the URL is the one we created above
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey
+ '&sensor=true&callback=mapInit';
    }
    else {
script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    }

    document.body.appendChild(script);

    //Create a script element to insert into the page
    var script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.id = "googleMapsClusterer";
    script2.src = 'js/core/markerclusterer.js';
    document.body.appendChild(script2);

  }

  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }
  }

  function loadMarkers(){

      $rootScope.mapCenter = map.getCenter();
      var center = map.getCenter();
      var bounds = map.getBounds();
      var zoom = map.getZoom();

      //Convert objects returned by Google to be more readable
      var centerNorm = {
          lat: center.lat(),
          lng: center.lng()
      };

      var boundsNorm = {
          northeast: {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
          },
          southwest: {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
          }
      };

      var boundingRadius = getBoundingRadius(centerNorm, boundsNorm);

      var params = {
        "centre": centerNorm,
        "bounds": boundsNorm,
        "zoom": zoom,
        "boundingRadius": boundingRadius
      };

      var markers = Markers.getMarkers(params).then(function(markers){
        console.log("Markers: ", markers);

        var records = markers.data.result;

        for (var i = 0; i < records.length; i++) {

          var record = records[i];

          // Check if the marker has already been added
          if (!markerExists(record.lat, record.lng)) {

              var markerPos = new google.maps.LatLng(record.lat, record.lng);
              // add the marker
              var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: markerPos
              });

              markerCluster.push(marker);

              // Add the marker to the markerCache so we know not to add it again later
              var markerData = {
                lat: record.lat,
                lng: record.lng,
                marker: marker
              };

              markerCache.push(markerData);

              var infoWindowContent = "<div><h4>" + record.name + "</h4><div>" + record.endereco + "</div></div>";

              addInfoWindow(marker, infoWindowContent, record);
          }

        }
        // create a Marker Clusterer that clusters markers
        markerClusterer = new MarkerClusterer(map, markerCluster, {imagePath: 'img/markers/m'});

      });

  }

  function markerExists(lat, lng){
      var exists = false;
      var cache = markerCache;
      for(var i = 0; i < cache.length; i++){
        if(cache[i].lat === lat && cache[i].lng === lng){
          exists = true;
        }
      }

      return exists;
  }

  function getBoundingRadius(center, bounds){
    return getDistanceBetweenPoints(center, bounds.northeast, 'km');
  }

  function getDistanceBetweenPoints(pos1, pos2, units){

    var earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    var R = earthRadius[units || 'miles'];
    var lat1 = pos1.lat;
    var lon1 = pos1.lng;
    var lat2 = pos2.lat;
    var lon2 = pos2.lng;

    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;

  }

  function toRad(x){
      return x * Math.PI / 180;
  }

  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });

  }

  function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online,
//if not, load it
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();
      });

      // Disable the map when the user goes offline
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });

    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();
      }, false);

      window.addEventListener("offline", function(e) {
        disableMap();
      }, false);
    }

  }

  return {
    init: function(key, mapIdpar){

      if(typeof key != "undefined"){
        apiKey = key;
      }

      if(typeof mapIdpar != "undefined"){
        mapId = mapIdpar;
      }

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.warn("Google Maps SDK needs to be loaded");

        disableMap();

        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps();
        }
      }
      else {
        if(ConnectivityMonitor.isOnline()){
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }

      addConnectivityListeners();

    }
  }

})

.controller('MapCtrl', function($scope,
          $state,
          $cordovaGeolocation,

          GoogleMaps,

          uiServices,
          appServices,

          $rootScope,

          $ionicNavBarDelegate,
          $ionicScrollDelegate,
          $ionicSideMenuDelegate) {


        appServices.verbose('========== MapaController-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterMapa);
        $scope.$on('$ionicView.enter', onEnterMapa);

        $scope.$on('$destroy', onDestroyMapa);

        // Mostrar o botão voltar
        $ionicNavBarDelegate.showBackButton(true);

        // -------------------------------------------------------------
        // Inicializar o controller (toda vez que apresentamos a View ?????)
        // -------------------------------------------------------------
        function onBeforeEnterMapa() {
            appServices.verbose('===== onBeforeEnterMapa-Init', 3);

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading({
                forcarPrimeiro: false
            });

            // Apresenta o menu(top) ao trocar de tela
            $rootScope.slideHeader = false;

            // Permitir que o usuário abre o sidemenu
            $ionicSideMenuDelegate.canDragContent(true);

            GoogleMaps.init("AIzaSyDoaI19bAhbtMsy_NRgOMKnNFodFD5wA_w");

            appServices.verbose('===== onBeforeEnterMapa-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executar quando a view está 100% carregada
        // -------------------------------------------------------------
        function onEnterMapa() {
            appServices.verbose('===== onEnterMapa-Init');

            // Esconder a mensagen "carregando..."
            uiServices.hideLoading({
                forcarFechamento: false
            });

            // Verificar se precisamos abrir o sidemenu
            if ($state.params.openSideMenu != undefined &&
                $state.params.openSideMenu != null &&
                $state.params.openSideMenu.toUpperCase() == 'TRUE') {
                $ionicSideMenuDelegate.toggleLeft(true);
            }

            // Deixar habilitado a transição do menu(top), enquanto muda de tela
            $rootScope.slideHeaderTransition = true;

            appServices.verbose('===== onEnterMapa-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executado quando a View está 100% descarregada
        // -------------------------------------------------------------
        function onDestroyMapa() {
            appServices.verbose('===== onDestroyMapa-Init', 3);

            appServices.verbose('===== onDestroyMapa-Fim', 3);
        }

})
