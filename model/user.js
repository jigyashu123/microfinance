var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        index: true,
        unique: true
    },
    email: {
    type:  String,
      unique: true
    },
    country: String,
    password: String
});
var borrowerSchema = new mongoose.Schema({
    loanid: String,
    date: String,
    name: String,
    wo: String,
    village: String,
    groupname: String,
    address: String,
    mobileno: String,
    Aadharid1: String,
    Aadharid2: String,
    startdate: String,
    enddate: String,
    installment: String,
    per: String,
    loanamount: String,
    noofinstallments: String
});

var User = module.exports = mongoose.model('User', userSchema);
userSchema.plugin(uniqueValidator);
var borrower= mongoose.model('borrower', borrowerSchema);

module.exports.getUserByUsername = function(username, cb){
    query = {username: username};
    User.findOne(query, cb);
}


module.exports.getUserById = function(id, cb){
    User.findById(id, cb)
}
module.exports.validPassword = function (userPassword, hash, cb) {
    bcrypt.compare(userPassword, hash, function (err, isMatch) {
        if (err) throw err;
        cb(null, isMatch);
    });
};


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}
