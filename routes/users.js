var express = require('express');
var router = express.Router();
const Products = require('../models/Producto.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/list', function(req, res, next) {
	Products.find(function(err,list){

			if(err){
				
				return res.redirect('/');
			}else{
				return res.send(list);

			}

	})	
});


module.exports = router;
