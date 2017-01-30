import MapDetailCtrl from './detail/map-detail_controller.js';

/**
 * The `MapCtrl` is the lead orchestrator of the component: it wraps the
 * `NgMap` directive's methods and provides its own for interfacing with
 * the map's controls, generating dialogs, and re-rendering the map elements.
 */
class MapCtrl {
	static get $inject() {
		return [
			'$timeout', '$scope', '$window', // angular core
			'NgMap', // external deps
			'$mdToast', '$mdPanel', // md deps
			'MAP_SETTINGS', 'MAP_ICONS' // constants
		];
	}
	/**
	 * Initialize the controller's dependencies.
	 * 
	 * @param  {Object} $timeout     Angular's setTimeout wrapper
	 * @param  {Object} $scope       The current scope
	 * @param  {Object} $window      Angular's window wrapper
	 * @param  {Object} NgMap        Angular Google Maps
	 * @param  {Object} $mdToast     Material toast service
	 * @param  {Object} $mdPanel     Material panel service
	 * @param  {Object} MAP_SETTINGS Constant for map config object
	 * @param  {Object} MAP_ICONS    Constant for map icon definitions
	 */
	constructor($timeout, $scope, $window, NgMap, $mdToast, $mdPanel, MAP_SETTINGS, MAP_ICONS) {
    // attach dependencies
    this._$timeout = $timeout;
    this._$scope = $scope;
    this._$window = $window;
    this._$mdToast = $mdToast;
    this._$mdPanel = $mdPanel;
    // init constants
    this._MAP_SETTINGS = MAP_SETTINGS;
    this._MAP_ICONS = MAP_ICONS;
    /**
     * Function for resolving map instance from promise.
     * @type {Function}
     */
    this.getMap = NgMap.getMap;
    /**
     * Property to store the loaded map instance.
     * @type {null|Object}
     */
    this.map = null;
    /**
     * Helper factory object for deploying simple toasts.
     * @type {Object}
     */
    this.toast = $mdToast.simple();
    /**
     * Token to hold a toast's `$timeout`.
     * @type {null|Promise}
     */
    this.toastCanceler = null;
    /**
     * Flag to determine whether there is already an active toast.
     * @type {Boolean}
     */
    this.toastActive = false;
  }
  $onInit() {
    this.getMap().then(instance => {
    	this.map = instance;

    	/*
    		This is a stupid hack that makes the map fill space by force.
    		Best not used whenever possible.
    	 */
      // angular.element(this._$window).triggerHandler('resize');
      google.maps.event.trigger(instance, 'resize');

      instance.data.setStyle(feature => {
        var category = feature.getProperty('category');
        switch(category) {
        	case '581a2c57d9ff16e787aa1b20': // Services
        		return { icon: this._MAP_ICONS.SERVICE }
        		break;
        	case '581a2c5ed9ff16e787aa1b21': // Emergency services
        		return { icon: this._MAP_ICONS.AED }
        		break;
        	case '581a2c77d9ff16e787aa1b22': // Restaurants and food courts
        		return { 
        			icon: this._MAP_ICONS.FOOD,
		          fillColor: '#5F259F',
		          fillOpacity: 1,
		          strokeWeight: 3,
		          strokeColor: 'white',
		          strokeOpacity: 0.3
		        }
        		break;
        	case '581a2c8ad9ff16e787aa1b24': // Parking
        		return { 
        			icon: this._MAP_ICONS.PARKING,
		          fillColor: '#53565A',
		          fillOpacity: 0.5,
		          strokeWeight: 3,
		          strokeColor: 'white',
		          strokeOpacity: 0.3
		        }
        		break;
        	case '581a2c8fd9ff16e787aa1b25': // Parking
        		return { 
        			icon: this._MAP_ICONS.OUTDOOR,
		          fillColor: '#1a875c',
		          fillOpacity: 0.5,
		          strokeWeight: 3,
		          strokeColor: 'white',
		          strokeOpacity: 0.1
		        }
        		break;
      		default: // other
		        return {
		        	icon: this._MAP_ICONS.DEFAULT,
		          fillColor: '#0077CA',
		          fillOpacity: 1,
		          strokeWeight: 3,
		          strokeColor: '#003C71',
		          strokeOpacity: 0.3
		        }
        }
      });

      instance.data.addListener('mouseover', event => {
        instance.data.overrideStyle(event.feature, {
          fillColor: '#C71566',
          fillOpacity: 0.7,
          strokeWeight: 5,
          strokeColor: 'white',
          strokeOpacity: 0.7
        });
        this.showToast(event.feature);
      });

      instance.data.addListener('mouseout', event => {
        instance.data.revertStyle();
        this.toastCanceler = this.hideToast();
      });

      instance.data.addListener('click', event => {
        this.showDetail(event.feature, this.isolateMouseEvent(event));
      });

	    this._$scope.$watch( () => this.mapControls, (newVal) => {
	    	if (newVal) {
					console.log('map component detected internal changes:', newVal);
			  	this.clearMapData().then(() => this.updateMapData(newVal));
		    	if (newVal.location && this.location !== newVal.location) {
			    	this.location = newVal.location;
			    }
	    	}
	    });

    });
	}

	// $onChanges({ collection: { currentValue: collection} }) {
	// 	console.log('map component detected external changes:', collection);
 //  	this.clearMapData().then(() => this.updateMapData({ collection }));
	// }

	/**
	 * Clean up event listeners that the controller has attached via
	 * the Google Maps API. This is especially important for the map
	 * component in general, whose listeners may not always exist in
	 * a context that Angular is aware of (and therefore will lead to
	 * memory leaks if left attached).
	 */
	$onDestroy() {
		google.maps.event.clearInstanceListeners(this.map.data);
	}

	/**
	 * Handler method for map data `$watch`; watches incoming geoJSON
	 * data for changes and adds it to the map if detected. If the
	 * new data has a `showAll` property (and it is true), all features
	 * all loaded and the map bounds are recalculated.
	 * 
	 * @param  {Object} newVal New incoming map data
	 */
	updateMapData(newVal) {
		console.log('updating map data...', newVal);
		return this.getMap().then(map => {
			if (newVal && newVal.showAll) {
	      map.data.addGeoJson(newVal.collection);
				console.log('map data updated (show all)!');
			} else {
	  		newVal.collection&&map.data.loadGeoJson(`http://localhost:3000/api/v1/feature-collections/${newVal.collection._id}`, null, () => {
				  this.fitBounds(map);
					console.log('map data updated!');
	  		});
			}
		});
	}
	
	/**
	 * Removes all features from the map by looping over feature
	 * data objects and calling their `map.remove()` on them.
	 */
	clearMapData() {
		console.log('clearing map data...');
		return this.getMap().then(map => {
			map.data.forEach(feature => {
				map.data.remove(feature);
			});
			console.log('map data cleared!');
		});
	}

	/**
	 * Shows a detail popup, called by user clicking map feature. This
	 * method uses ng-material's `$mdPanel` service to build a floating
	 * panel config, immediately show it, and manually clean up its scope
	 * listeners on close.
	 * @param  {Object} feature         The feature that was clicked
	 * @param  {Object} options
	 * @param  {Number} options.clientX Horizontal position of user's click
	 * @param  {Number} options.clientY Vertical position of user's click
	 * @return {Promise}                Resolves to panel reference
	 */
	showDetail(feature, { clientX: left, clientY: top }) {

		let panelRef;
	  const position = this._$mdPanel.newPanelPosition()
	    .absolute().center();
	    // .top(`${ top }px`)
	    // .left(`${ left }px`);

	  const animation = this._$mdPanel.newPanelAnimation()
      .openFrom({ top, left })
      .closeTo({ top, left })
			.withAnimation(this._$mdPanel.animation.SCALE);

	  return this._$mdPanel.open({
	    attachTo: angular.element(document.body),
	    controller: MapDetailCtrl,
	    controllerAs: 'ctrl',
	    templateUrl: 'detail/_map-detail.html',
	    hasBackdrop: true,
	    panelClass: 'map-detail',
	    locals: {
	    	callback: this.onGotoBldg(),
	    	location: this.location,
	    	feature
	    },
	    trapFocus: true,
	    zIndex: 150,
	    clickOutsideToClose: true,
	    escapeToClose: true,
	    focusOnOpen: true,
	    onDomRemoved() {
	    	panelRef.destroy();
	    },
	    animation,
	    position
	  }).then(panel => {
	  	panelRef = panel;
	  });
	}

	/**
	 * Shows a simple toast notification containing the name of the 
	 * future being hovered over. If there is already a toast active,
	 * it updates the name in the toast instead of making a new one.
	 * 
	 * @param  {Object} feature The feature being hovered over
	 */
	showToast(feature) {
		let featureName = feature.getProperty('name');
		if (!this.toastActive) {
			this.toast.textContent(featureName).position('bottom left').hideDelay(0);
			this._$mdToast.show(this.toast);
			this.toastActive = true;
		} else {
			this._$timeout.cancel(this.toastCanceler);
			this._$timeout( () => {
				this._$mdToast.updateTextContent(featureName);
			});
		}
	}

	/**
	 * Hides the toast notification after 3 seconds, but provides
	 * a way to cancel the 3 seconds (`toastCanceler`).
	 *
	 * It is meant to be called on mouseout, so that the toast will
	 * remain on screen for a few seconds, and only disappear if
	 * another isn't needed within those seconds.
	 * 
	 * @return {Promise} Resolves to completed timeout
	 */
	hideToast() {
		return this._$timeout( () => {
			this._$mdToast.hide(this.toast);
			this.toastActive = false;
	  }, 3000);
	}

	/**
	 * Direct port of Google Maps `processBounds` example function
	 * for recalculation of map boundaries based on map data.
	 * @param  {Object}   geometry LatLng geometry object
	 * @param  {Function} callback Recursion callback
	 * @param  {*}   			thisArg  Context for `this`
	 */
	processBounds(geometry, callback, thisArg) {
	  if (geometry instanceof google.maps.LatLng) {
	    callback.call(thisArg, geometry);
	  } else if (geometry instanceof google.maps.Data.Point) {
	    callback.call(thisArg, geometry.get());
	  } else {
	    geometry.getArray().forEach(g => {
	      this.processBounds(g, callback, thisArg);
	    });
	  }
	}
	/**
	 * Resizes map view to fit recalculated bounds.
	 */
	fitBounds() {
	  const bounds = new google.maps.LatLngBounds();
	  this.map.data.forEach(feature => {
	    this.processBounds(feature.getGeometry(), bounds.extend, bounds);
	  });
	  this.map.fitBounds(bounds);
	}
	/**
	 * Since Google Map events store private properties under names
	 * that change periodically, it is necessary to manually evaluate
	 * which property is the `MouseEvent` by loop-and-compare. This
	 * method returns a `MouseEvent` from a Map event.
	 * @param  {Event} mapEvent Google map event
	 * @return {Event}          MouseEvent
	 */
	isolateMouseEvent(mapEvent) {
		for (const prop in mapEvent) {
			if (mapEvent[prop] && mapEvent[prop] instanceof MouseEvent) {
				console.log(mapEvent[prop]);
				return mapEvent[prop];
			}
		}
	}
}

export default MapCtrl;