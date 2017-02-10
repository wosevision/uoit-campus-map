const templates = ['$templateCache', function($templateCache) {$templateCache.put('_map.html','<ng-map\n  center="43.9443802,-78.8975857"\n  zoom="17"\n  styles="{{ ::$ctrl._MAP_SETTINGS.styles }}"\n  map-type-id="{{ ::$ctrl._MAP_SETTINGS.type }}"\n  disable-default-u-i="true"\n  tilt="45"\n  heading="0"\n  layout\n  layout-fill>\n</ng-map>\n<div ng-transclude="controls" class="map-controls"></div>')
$templateCache.put('controls/_map-controls.html','<div class="map-controls-handle" layout="row" ng-class="{ \'map-controls-open\': $ctrl.mapControlsOpen }">\n\t<md-button ng-click="$ctrl.mapControlsOpen = !$ctrl.mapControlsOpen">\n\t  <svg style="width:32px;height:32px" viewBox="0 0 24 24">\n\t    <path fill="#FFFFFF" d="M20,10V14H11L14.5,17.5L12.08,19.92L4.16,12L12.08,4.08L14.5,6.5L11,10H20Z" />\n\t\t</svg>\n\t</md-button>\n\n\t<md-sidenav\n\t    class="md-sidenav-right map-controls-sidenav"\n\t    md-component-id="uoit-campus-map:right"\n\t    md-disable-backdrop\n\t    md-whiteframe="4"\n\t    md-is-locked-open="$ctrl.mapControlsOpen" \n\t    md-is-open="$ctrl.mapControlsOpen"\n\t    layout="column">\n\t  <md-toolbar class="md-primary" layout>\n\t    <div class="md-toolbar-tools">\n\t\t  \t<h1>Map filtering</h1>\n\t  \t</div>\n\t  </md-toolbar>\n\n\t  <md-content\n\t\t  flex="grow"\n\t\t  layout="column">\n\t\t\t<filter-builder ng-model="$ctrl.filter" on-update="$ctrl.loadFeatures($ctrl.filter)" layout="column" layout-padding flex="grow">\n\t\t\t  <md-input-container>\n\t\t\t    <label>Location</label>\n\t\t\t    <md-select ng-model="$ctrl.location" md-on-open="$ctrl.loadLocations()" filter-input name="location" md-on-close="$ctrl.loadFeatures($ctrl.filter)">\n\t\t\t      <md-option ng-repeat="location in ::$ctrl.locations" ng-value="::location._id" ng-disabled="$ctrl.location === location">\n\t\t\t        {{ ::location.label}}\n\t\t\t      </md-option>\n\t\t\t    </md-select>\n\t\t\t  </md-input-container>\n\n\t\t\t  <md-input-container>\n\t\t\t    <label>Feature category</label>\n\t\t\t    <md-select ng-model="$ctrl.category" md-on-open="$ctrl.loadCategories()" ng-disabled="!$ctrl.location.length" multiple filter-input name="properties.category" md-on-close="$ctrl.loadFeatures($ctrl.filter)">\n\t\t\t      <md-option ng-repeat="category in $ctrl.categories" ng-value="::category._id" ng-disabled="$ctrl.category === category">\n\t\t\t        {{ ::category.name }}\n\t\t\t      </md-option>\n\t\t\t    </md-select>\n\t\t\t  </md-input-container>\n\t\t\t  <div layout-padding>\n\t        <md-checkbox aria-label="Select All"\n\t\t\t\t\t\tng-checked="$ctrl.isChecked(\'category\', \'categories\')"\n\t\t\t\t\t\tmd-indeterminate="$ctrl.isIndeterminate(\'category\', \'categories\')"\n\t\t\t\t\t\tng-click="$ctrl.toggleAll(\'category\', \'categories\')">\n\t\t\t\t\t\tSelect all categories\n\t        </md-checkbox>\n        </div>\n<!-- \t\t\t\t<div>\n\t\t\t    <md-chips>\n\t\t\t      <md-chip ng-repeat="category in $ctrl.getItemsInListByProp($ctrl.category, $ctrl.categories, \'_id\') track by $index">\n\t\t\t      \t{{ category.name }}\n\t\t\t\t\t\t  <button class="md-chip-remove" ng-click="$ctrl.removeItemFromList(category._id, $ctrl.category)">&times;</button>\n\t\t\t      </md-chip>\n\t\t\t\t\t</md-chips>\n\t\t\t\t</div> -->\n\n\t\t\t  <md-input-container>\n\t\t\t    <label>Feature collection</label>\n\t\t\t    <md-select ng-model="$ctrl.collection" md-on-open="$ctrl.loadCollections()" ng-disabled="!$ctrl.category.length" multiple filter-input="filters.collection" name="group" md-on-close="$ctrl.loadFeatures($ctrl.filter)">\n\t\t\t      <md-optgroup ng-repeat="group in $ctrl.getItemsInListByProp($ctrl.category, $ctrl.categories, \'_id\')" label="{{ ::group.name }}">\n\t\t\t        <md-option ng-repeat="collection in $ctrl.collections | filter: { category: group._id }" ng-value="::collection._id" ng-disabled="$ctrl.collection === collection">\n\t\t\t          {{ ::collection.name }}\n\t\t\t        </md-option>\n\t\t\t      </md-optgroup>\n\t\t\t    </md-select>\n\t\t\t  </md-input-container>\n\t\t\t  <div layout-padding>\n\t        <md-checkbox aria-label="Select All"\n\t\t\t\t\t\tng-checked="$ctrl.isChecked(\'collection\', \'collections\')"\n\t\t\t\t\t\tmd-indeterminate="$ctrl.isIndeterminate(\'collection\', \'collections\')"\n\t\t\t\t\t\tng-click="$ctrl.toggleAll(\'collection\', \'collections\')">\n\t\t\t\t\t\tSelect all collections\n\t        </md-checkbox>\n        </div>\n\t\t\t\t<small><pre>{{ $ctrl.filter | json }}</pre></small>\n\t\t\t</filter-builder>\n\t<!--   <div layout="column">\n\n\t    <md-button class="md-primary" ng-click="$ctrl.showAll()">\n\t    \tShow all\n\t      <md-tooltip md-direction="bottom">\n\t        Turn on visibility for all available map features\n\t      </md-tooltip>\n\t    </md-button>\n\t  </div> -->\n\t  </md-content>\n\t</md-sidenav>\n</div>')
$templateCache.put('detail/_map-detail.html','<md-whiteframe\n  class="md-whiteframe-16dp"\n  layout="column">\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>\n        <span>{{ ::ctrl.name }}</span>\n      </h2>\n      <span flex></span>\n      <md-button class="md-icon-button" aria-label="Close info" ng-click="ctrl.close()">\n        <span>&times;</span>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <div\n  \tlayout="column"\n  \tlayout-margin\n  \tlayout-align="center center">\n    <md-button ng-click="ctrl.showDetails()">{{ ctrl.detailsShowing ? \'Hide\' : \'Show\'}} details <span class="detail-arrow" ng-class="{ \'arrow-up\' : ctrl.detailsShowing }"></span></md-button>\n  \t<md-content layout-padding layout-margin class="details-text" ng-bind-html="::ctrl.description" ng-show="ctrl.detailsShowing"></md-content>\n  \t<md-button layout-padding class="md-raised md-primary" aria-label="Tour this building" ng-if="::ctrl.building" ng-click="ctrl.gotoBldg(ctrl.callback)">\n  \t\tTake a tour &raquo;\n  \t</md-button>\n  </div>\n</md-whiteframe>')}]; export default templates;