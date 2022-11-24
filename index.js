const Express = require( 'express' );
const Os = require( 'os' );

const Path = require( 'path' );
const FS = require( 'fs/promises' );

const ROOT_PATH = __dirname;
const MODULES_PATH = Path.join( ROOT_PATH, 'node_modules' );
const STATIC_PATH = Path.join( ROOT_PATH, 'static' );

const App = Express( );
var Dirty = Date.now( );
var Config = {
    autoSave: false,
    autoSaveSeconds: 300, // 5 minutes.
    autoOpenLastFile: true,
    lastFile: false
};
var Data = [ ];

function AutoSave( ) {

}

function ParseArgs( args = process.argv ) {
    var browser = ( Os.platform == 'linux' ) ? 'xdg-open' : '';

    args.forEach( function( item, index ) {
        if( index < 2 ) {
            return;
        }

        if( item == '-s' ) {
            browser = false;
        }

        if( item.startsWith( '-' ) ) {
            return;
        }

        if( browser !== false ) {
            browser = item;
        }
    } );

    return browser;
}

function indexChilds( index, item ) {
    index[item[0]] = item;
    const childs = item[3];
    if( Array.isArray( childs ) ) {
        childs.forEach( function( e ) { indexChilds( index, e ); } );
    }
}

async function loadJSONFile( fileName ) {
    const data = await FS.readFile( fileName, { encoding: 'utf-8' } ).then( function( data ) {
        return JSON.parse( data. );
    } )
}

// Init.
( function( app ) {
    try {
        Config = JSON.parse( FS.readFileSync( 'config.json', { encoding: 'utf-8' } ) );
    } catch( err ) {

    }

    Config.autoSaveSeconds *= 1000;

    if( ( Config.autoOpenLastFile === true ) && ( typeof( Config.lastFile ) == 'string' ) && ( Config.lastFile.length ) ) {
        try {

        } catch( err ) {
            
        }
    }

    app.set( 'tree', tree )
    tree.forEach( function( item ) { indexChilds( index, item ); } );
    app.set( 'index', index );
} )( App );

App.post( '/rest/loadall', function( req, res ) {
    res.json( req.app.get( 'tree' ) ).end( );
} );

App.use( '/webix', Express.static( Path.join( MODULES_PATH, 'webix' ) ) );
App.use( Express.static( STATIC_PATH ) );

// App.listen( 0, '127.0.0.1', 15, function( ) {
App.listen( 8000, '127.0.0.1', 15, function( ) {
    const browser = ParseArgs( );
    const port = this.address( ).port;
    const url = `http://127.0.0.1:${port}/`;

    if( browser === false ) {
        console.log( 'Server-only mode, URL', url );
    } else {
        console.log( browser, url );
    }
} );
