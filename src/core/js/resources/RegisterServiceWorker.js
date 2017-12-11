if( 'serviceWorker' in navigator &&
    window.location.hostname !== 'localhost' ) {
  navigator
      .serviceWorker
      .register( './sw.js' )
      .then( swReg => {
        console.log( 'Service worker registered', swReg );
      } )
      .catch( e => {
        console.error( 'Service worker registration error', e );
      } );
}
