var fs = require('fs');
var path = require('path');
var configJSON = fs.readFileSync(path.resolve(__dirname+"../../config/config.json"));
var config = JSON.parse(configJSON.toString());
var stripe = require('stripe')(config.stripeScreatKey);


exports.index = function (req, res) {
    res.render('index',{title:'stripe'});
};
exports.subscription = function (req, res) {
    res.render('subscription', {title:'stripe'});
};

/*
 * SDK configuration
 */



exports.singlePayment = function (req, res) {
    return stripe.charges
        .create({ 
            source: req.body.token,
            amount: req.body.price * 100,
            currency: "usd",
            description: "Charge for single payment"
        })
        .then(function(charge) {
            console.log(charge);
           return res.status(200).json({status:'success',message:'payment sucessful....'});
        });

   
}

exports.subscriptionPayment = function (req, res) {
    var email;
    var token;
    var planId;

    console.log(req.body);

    email =req.body.email,
    token = req.body.token,
    planId =config.planId;

   

   return stripe.customers
        .create({  //CREATE CUSTOMER WITH STRIPE
            card: token,
            email: email,
            // customer's email (get it from db or session)
        })
        .then((customer) => {  //CREATE SUBSCRIPTIONN WITH STRIPE
            console.log(customer);
            return stripe.subscriptions.create({
                customer: customer.id,
                items: [{plan: planId}],
                coupon:undefined//or give a couprn like OFF20 need to create in stripe account
            });
        })
        .then(function (subscription) {

            console.log(subscription);
           return res.status(200).json({status:'success',message:'subscription sucessful....'});

        });

   
}

