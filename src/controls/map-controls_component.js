import MapControlsCtrl from './map-controls_controller.js'

const campusMapControls = {
  require: {
    $ngModel: 'ngModel'
    // MapCtrl: '^map'
  },
  templateUrl: 'controls/_map-controls.html',
  controller: MapControlsCtrl
}

export default campusMapControls;