//. bulkload.js


//. Cloudant REST APIs
//. https://console.bluemix.net/docs/services/Cloudant/api/database.html#databases

//. npm cloudant
//. https://www.npmjs.com/package/cloudant

//. References
//. http://www.atmarkit.co.jp/ait/articles/0910/26/news097.html

var cloudantlib = require( 'cloudant' ),
    fs = require( 'fs' ),
    readline = require( 'readline' );
var settings = require( './settings' );
var cloudant = cloudantlib( { account: settings.cloudant_username, password: settings.cloudant_password } );


//. DB追加
var db = null;
cloudant.db.get( settings.cloudant_db, function( err, body ){
  if( err ){
    if( err.statusCode == 404 ){
      cloudant.db.create( settings.cloudant_db, function( err, body ){
        if( err ){
          db = null;
        }else{
          db = cloudant.db.use( settings.cloudant_db );
          load();
        }
      });
    }else{
      db = null;
    }
  }else{
    db = cloudant.db.use( settings.cloudant_db );
    load();
  }
});


function load(){
  setTimeout( function(){
    var lines = [];
    var stream = fs.createReadStream( './items.json.txt', 'utf8' );
    var reader = readline.createInterface( {input: stream} );
    reader.on( 'line', (line) => {
      lines.push( JSON.parse( line ) );
    });
    reader.on( 'close', () => {
      if( db ){
        var n = lines.length;
        for( var i = 0; i < n; i += 1000 ){
          var docs = [];
          if( i + 1000 > n ){
            docs = lines.slice( i );
          }else{
            docs = lines.slice( i, i + 1000 );
          }

          db.bulk( { docs: docs }, function( err, body ){
            console.log( body );
          });
        }

        //. 検索インデックスを追加
        /* 検索: 
          db.search( 'ftsearch', 'itemsIndex', { q: 'xxxx' }, function( err, result ){
            if( err ){
            }else{
              for( var i = 0; i < result.rows.length; i ++ ){
                console.log( result.rows[i].id );
              }
            }
          } );
         */
        var indexdoc = {
          _id: "_design/ftsearch",
          indexes: {
            itemsIndex: {
              analyzer: "japanese",
              index: "function(doc){ if('name' in doc){ var fields = [doc.name, doc.code, doc.brand, doc.maker]; index('default', fields.join(' ')); index('name', doc.name, {store:'yes'}); index('code', doc.code, {store:'yes'}); index('brand', doc.brand, {store:'yes'}); index('maker', doc.maker, {store:'yes'}); } }"
            }
          }
        };

        db.insert( indexdoc, function( err, result ){ 
        });
      }else{
        //. このメッセージが出るようであれば、settings.js 内の cloudant_db_wait 値を増やす（ミリ秒指定）
        console.log( 'db is not initialized yet' );
      }
    });
  }, settings.cloudant_db_wait );
}




