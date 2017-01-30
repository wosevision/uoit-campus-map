const templates = ['$templateCache', function($templateCache) {$templateCache.put('_map.html','<ng-map\n  center="43.9443802,-78.8975857"\n  zoom="17"\n  styles="{{ ::$ctrl._MAP_SETTINGS.styles }}"\n  map-type-id="{{ ::$ctrl._MAP_SETTINGS.type }}"\n  disable-default-u-i="true"\n  tilt="45"\n  heading="0"\n  layout\n  layout-fill>\n  <custom-control id="map-controls" position="TOP_LEFT" index="1">\n\t\t<campus-map-controls ng-model="$ctrl.mapControls"></campus-map-controls>\n  </custom-control>\n</ng-map>')
$templateCache.put('controls/_map-controls.html','<md-whiteframe\n  class="md-whiteframe-16dp map-controls"\n  layout="column"\n  layout-align="center center"\n  layout-fill>\n  <div layout="row">\n    <md-input-container>\n      <label>Location</label>\n      <md-select ng-model="$ctrl.location" md-on-open="$ctrl.loadLocations()" ng-change="$ctrl.updateLocation()" ng-model-options="{trackBy: \'$value._id\'}">\n        <md-option ng-repeat="location in ::$ctrl.locations" ng-value="::location" ng-disabled="$ctrl.location === location">\n          {{ ::location.label}}\n        </md-option>\n      </md-select>\n    </md-input-container>\n    <md-input-container>\n      <label>Feature category</label>\n      <md-select ng-model="$ctrl.category" md-on-open="$ctrl.loadCategories()" ng-change="$ctrl.updateCategory()" ng-model-options="{trackBy: \'$value._id\'}" ng-disabled="!$ctrl.location" multiple>\n        <md-option ng-repeat="category in $ctrl.categories" ng-value="::category" ng-disabled="$ctrl.category === category">\n          {{ ::category.name }}\n        </md-option>\n      </md-select>\n    </md-input-container>\n    <md-input-container>\n      <label>Feature collection</label>\n      <md-select ng-model="$ctrl.collection" md-on-open="$ctrl.loadCollections()" ng-change="$ctrl.updateCollection()" ng-model-options="{trackBy: \'$value._id\'}" ng-disabled="!$ctrl.category">\n        <md-optgroup ng-repeat="group in $ctrl.category" label="{{ ::group.name }}">\n\t        <md-option ng-repeat="collection in $ctrl.collections | filter: { category: group._id }" ng-value="::collection" ng-disabled="$ctrl.collection === collection">\n\t          {{ ::collection.name }}\n\t        </md-option>\n        </md-optgroup>\n      </md-select>\n    </md-input-container>\n  </div>\n  <div layout="row">\n    <md-button class="md-primary" ng-click="$ctrl.showAll()">\n    \tShow all\n      <md-tooltip md-direction="bottom">\n        Turn on visibility for all available map features\n      </md-tooltip>\n    </md-button>\n  </div>\n</md-whiteframe>')
$templateCache.put('detail/_map-detail.html','<md-whiteframe\n  class="md-whiteframe-16dp"\n  layout="column">\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>\n        <span>{{ ::ctrl.name }}</span>\n      </h2>\n      <span flex></span>\n      <md-button class="md-icon-button" aria-label="Close info" ng-click="ctrl.close()">\n        <span>&times;</span>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <div\n  \tlayout="column"\n  \tlayout-margin\n  \tlayout-align="center center">\n    <md-button ng-click="ctrl.showDetails()">{{ ctrl.detailsShowing ? \'Hide\' : \'Show\'}} details <span class="detail-arrow" ng-class="{ \'arrow-up\' : ctrl.detailsShowing }"></span></md-button>\n  \t<md-content layout-padding layout-margin class="details-text" ng-bind-html="::ctrl.description" ng-show="ctrl.detailsShowing"></md-content>\n  \t<md-button layout-padding class="md-raised md-primary" aria-label="Tour this building" ng-if="::ctrl.building" ng-click="ctrl.gotoBldg(ctrl.callback)">\n  \t\tTake a tour &raquo;\n  \t</md-button>\n  </div>\n</md-whiteframe>')}]; export default templates;