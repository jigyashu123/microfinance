var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../model/user');
//var borrower = require('../model/user');
var B= mongoose.model('borrower');
mongoose.Promise = global.Promise;


/* GET home page. */
router.get('/register',function(req, res, next) {
  res.render('register');
});
router.get('/index',function(req, res, next) {
  res.render('index');
});
router.get('/id',function(req, res, next) {
  res.render('id');
});
router.get('/id1',function(req, res, next) {
  res.render('id1');
});
router.get('/groups',function(req, res, next) {
  res.render('groups');
});
router.get('/guarantee',function(req, res, next) {
  res.render('guarantee');
});
router.get('/history',function(req, res, next) {
  res.render('history');
});
router.get('/borrower',function(req, res, next) {
  res.render('borrower');
});
router.get('/registerborrower',function(req, res, next) {
  res.render('registerborrower');
});
router.get('/account',function(req, res, next) {
  res.render('account');
});
router.get('/grantLoan',function(req, res, next) {
  res.render('grantLoan');
});
router.get('/login',function(req, res, next) {
  res.render('login');
});
router.post('/register',function(req, res, next) {
  var name = req.body.name,
  username = req.body.username,
  email = req.body.email,
  country = req.body.country,
  password = req.body.password,
  password2 = req.body.password2;
console.log(name);
console.log(username);
console.log(email);
console.log(country);
console.log(password);
console.log(password2);
//validation
  req.checkBody('name', 'A name is required to register').notEmpty();
  req.checkBody('username', 'Please choose a username').notEmpty();
  req.checkBody('email', 'You have entered an invalid email address').isEmail();
 req.checkBody('email', 'Email is required').notEmpty();
 req.checkBody('country', 'Please choose a country').notEmpty();
req.checkBody('password', 'Password is required').notEmpty();
 req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
   res.render('register',{
     errors: errors,
    });
}else{
  var newUser =new User({
    name:name,
    username:username,
    email:email,
    country:country,
    password:password
  });
   User.createUser(newUser,function(err,user){
    if(err)throw err;
    console.log(user);

  });
  req.flash('success_msg','You are registered can now login');
  res.redirect('/users/login');
}
});
passport.use(new localStrategy(function (username, password, done) {
  // Checking if username exists
  User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        console.log('Username doesnt exist!');
        return done(null, false, {
          message: 'Username not found'
        });
      }

      //Comparing password at login to password in database
      User.validPassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if(isMatch){
          return done(null, user)
        }else{
          console.log('Invalid Password');
          return done(null, false, {message: 'Invalid Password'})
        }
      });
    });
}));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successredirect:'/',
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
  }),
    function(req,res){
      console.log('Authentication Successful')
  req.flash('success', 'You are now logged in');
  res.redirect('/');
});
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success_msg','You are now logged out');
  res.redirect('/users/login');
})


router.post('/registerborrower',function(req, res, next) {
B.find({loanid : B.loanid}, function (err, docs) {
        if (docs.length){
            console.log('loanid exists already',null);
        }else{

  B.create({
    loanid: req.body.loanid,
    date: req.body.date,
    name: req.body.name,
    wo: req.body.wo,
    groupname: req.body.groupname,
    village: req.body.village,
    address: req.body.address,
    mobileno: req.body.mobileno,
    Aadharid1: req.body.Aadharid1,
    Aadharid2: req.body.Aadharid2,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    installment: req.body.installment,
    per:req.body.per,
    loanamount:req.body.loanamount,
    noofinstallments:req.body.noofinstallments

  } ,
  function(err,result){
      if(err){
      //  console.log(err);
      } else {
        res.json(result);
      console.log("data successfully saved");
      }

    });

}
});
});



router.get('/findborrower',function(req, res, next){
   B.find(function (err, person){
     if(err)
     {

       return "handleError(err)";
}
     else{
       var tt = {"pp": person};
       res.render('list', tt);
     }
   });
 });
router.post('/findborrowerbyid',function(req, res, next){
  B.find().where({loanid: req.body.loanid}).exec(function(err, result){
       if(err)
       {

         //res.send("record not Found");
         console.log("record not found")
  }
       else{

         var tt = {"pp": result};
         res.render('list', tt);

       }
     });
   });
   router.post('/findbyid',function(req, res, next){
     B.find().where({loanid: req.body.loanid}).exec(function(err, result){
          if(err)
          {

            //res.send("record not Found");
            console.log("record not found")
     }
          else{

          var tt = {"pp": result};
               res.render('account', tt);
            //res.render('account', {"user": result});

          }
        });
      });

module.exports = router;
