function log(req,res,next){
    console.log('autenticando');
    next();
  }

  module.exports = log;