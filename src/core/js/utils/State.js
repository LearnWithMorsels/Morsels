import SCORM from 'resources/SCORM';
import Offline from 'resources/Offline';

class StateHandler {
  constructor() {
    if( SCORM.isAvailable() ) {
      console.log( '================= SCORM =================' );
      return SCORM;
    } else {
      console.warn( '================= NO SCORM =================' );
      return Offline;
    }
  }
}

let State = new StateHandler;
export default State;
