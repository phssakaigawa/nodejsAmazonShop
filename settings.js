//. settings.js

//. settings for Cloudant
exports.cloudant_username = 'cloudant_username';
exports.cloudant_password = 'cloudant_password';
exports.cloudant_db = 'items';
exports.cloudant_db_wait = 10000;

//. settings for app
exports.basic_username = '';
exports.basic_password = '';

//. settings for amazon associate
exports.aws_tag = '';
exports.aws_key = 'aws_key';
exports.aws_secret = 'aws_secret';

exports.nodes = [
  //. https://affiliate.amazon.co.jp/gp/associates/help/t100
//  '52905051', //. ビューティー/スキンケア
//  '52908051', //. ビューティー/ヘアケア
//  '52907051', //. ビューティー/ボディケア
  '52912051'  //. ビューティー/男性化粧品
];

if( process.env.VCAP_SERVICES ){
  var VCAP_SERVICES = JSON.parse( process.env.VCAP_SERVICES );
  if( VCAP_SERVICES && VCAP_SERVICES.cloudantNoSQLDB ){
    exports.cloudant_username = VCAP_SERVICES.cloudantNoSQLDB[0].credentials.username;
    exports.cloudant_password = VCAP_SERVICES.cloudantNoSQLDB[0].credentials.password;
  }
}
