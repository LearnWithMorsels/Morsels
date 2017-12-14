export default function( raw, maxLength, ellipsis = '&hellip;' ) {
  var frag = document.createDocumentFragment();
  var innerEl = document.createElement( 'div' );
  frag.appendChild( innerEl );
  innerEl.innerHTML = raw;
  let text = frag.firstChild.innerText.replace( /^ +/, '' );

  if( text.length < maxLength ) {
    return text;
  } else {
    let words = text.split( ' ' ),
      out = '';
    while( out.length + words[0].length < maxLength && words.length ) {
      out += ' ' + words.shift();
    }
    return out + ellipsis;
  }
}
