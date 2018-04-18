var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',ensureAuthenticated,function(req, res, next) {
  res.render('index');
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
    //req.flash('success_msg','You are not logged in');
	res.redirect('/users/login');
  }
};
module.exports = router;
