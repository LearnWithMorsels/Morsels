let instance = null;

class OfflineHandler {
  constructor() {
    if( !instance ) {
      instance = this;
    }

    this.time = new Date(); //TODO: Only to test that this is a unique instance

    return instance;
  }

  isAvailable() {
    return true;
  }

  getSuspend( key = null ) {
  }

  setSuspend( key, value ) {
  }

  set( param, value ) {
  }

  get( param ) {
  }

  complete() {
  }

  score( score ) {
  }

  save() {
  }

  trace( msg ) {
    console.log( msg );
  }
}

let Offline = new OfflineHandler();
export default Offline;
