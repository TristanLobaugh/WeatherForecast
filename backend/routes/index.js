var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get_weather', function(req, res, next){
	console.log(req.body);
	lat = req.body.lat;
	lng = req.body.lng;
	request("https://api.darksky.net/forecast/8da3b4c5ed73c74d9cecd7db29ace7eb/" + lat + "," + lng, function (error, response, body){
		if(!error && response.statusCode == 200) {
			res.json(body);
		}
	});
});

module.exports = router;

