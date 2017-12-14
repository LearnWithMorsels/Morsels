import pipwerks from '../../../../node_modules/pipwerks-scorm-api-wrapper';

let instance = null;

class SCORMWrapper {
  constructor( version ) {
    if( !instance ) {
      instance = this;
      this.scorm = pipwerks.SCORM;
    }

    this.scorm.version = version;
    this.time = new Date(); //TODO: Only to test that this is a unique instance
    this.connected = this.scorm.init();
    this.suspendData = JSON.parse( this.get( 'cmi.suspend_data' ) || '{}' ) || {};

    window.onunload = () => {
      this.scorm.quit();
    };

    return instance;
  }

  isAvailable() {
    return this.connected;
  }

  getSuspend( key = null ) {
    return key === null ? this.suspendData : ( this.suspendData[key] || null );
  }

  setSuspend( key, value ) {
    this.suspendData[key] = value;
    this.set( 'cmi.suspend_data', JSON.stringify( this.suspendData ) );
    this.scorm.save();
  }

  set( param, value ) {
    this.scorm.set( param, value );
  }

  get( param ) {
    return this.scorm.get( param );
  }

  complete() {
    this.scorm.set( 'cmi.core.lesson_status', 'completed' )
    this.scorm.save();
  }

  score( score ) {
    this.set( 'cmi.core.score.raw', score );
    this.scorm.save();
  }

  save() {
    this.scorm.save();
  }

  trace( msg ) {
    console.log( msg );
    //pipwerks.UTILS.trace( msg );
  }
}

let SCORM = new SCORMWrapper( '1.2' );
export default SCORM;
