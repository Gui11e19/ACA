var express = require('express');
var router = express.Router();
const Products = require('../models/Producto.js')
const Categories = require('../models/Category.js')
const pageInfo = require('../helpers/pagination.js')
const AWS = require('aws-sdk');

const Bucket = 'air-xpress';
const s3 = new AWS.S3({
	accessKeyId: '',
	secretAccessKey: ''

});

var multer = require('multer')
var upload = multer()


router.get('/producto/show/:id', function(req, res, next) {
	productId: req.params.id

	const product = Products.findOne(
		{
			_id: req.params.id
		}, { _id: 0, name: 1, description: 1,price: 1, img_key: 1 }, function(err, resultp) {

			if (err) {
				return res.redirect('/productos')
			}
			if (resultp) {
				var img_url = `https://${Bucket}.s3.amazonaws.com/${resultp.img_key}`
			
				return res.render('test/product', {
					title: `Categoria - ${resultp.name}`,
					product: resultp,
					userInfo: userInfo,
				
					img_url: img_url
				})

			}

		});

});


router.get('/pagination', (req, res, next) => {

	// start constants
	const ITEMS_PER_PAGE = 4;
	const page = +req.query.page || 1; // pagination
	let totalItems; // pagination
	// end constants

	Products.find()
		.countDocuments()
		.then(numberOfProducts => {
			totalItems = numberOfProducts;
			return Products.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		}).then(products => {
			res.render('test/pagination', {
				title: 'teste',
				products: products,
				currentPage: page,
				hasNextPage: (ITEMS_PER_PAGE * page) < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		}).catch(err => {
			console.log(err);
		});
});

router.get('/find', function(req, res, next) {

	const itemsPerPage = 4;
	const page = +req.query.page || 1; // pagination
	let totalItems; // pagination

	//counts number of products
	Products.countDocuments({}, function(err, count) {
		totalItems = count;
	});
	Products.find({}, {}, { skip: (page - 1) * itemsPerPage, limit: itemsPerPage }, function(err, products) {
		if (err) {
			console.log(err)
			return res.redirect('/');
		}

		var pagination = pageInfo(page, itemsPerPage, totalItems);
		return res.render('test/pagination', {
			title: 'teste',
			products: products,
			page: pagination
		});

	});
});
router.get('/insertMany', function(req, res, next) {

	var arraysuer = [];
	for (var i = 20; i < 40; i++) {
		var product = {
			name: 'aire lg amateur' + i,
			category_id: '6036ed383443b725f06cc6e0',
			price: 200 + i,
			description: 'test desc' + i,
			img_key: 'img1614807715940Screenshot from 2021-01-25 17-33-09.png'
		}
		arraysuer.push(product);

	}
	console.log(arraysuer);
	Products.insertMany(arraysuer).then(function(err, results) {
		if (err) {
			console.log(err);
		}
		console.log("Data inserted")  // Success 
	});

	res.render('nosotros', {
		title: 'Nosotros',
		userInfo: userInfo

	});
});


router.get('/s3up', function(req, res, next) {

	return res.render('test/uploadimg', {
		title: 'test'

	});
});

router.get('/testing', (req,res,next) =>{
	Products.updateMany({}, { img_key: "1.png" },(err,results)=>{

		console.log(err);
		console.log(results);
	});
	
})
router.post('/s3up', upload.single('img'), function(req, res, next) {

	console.log(req.body);
	console.log(req.file);
	let filenameIMG = '' + req.file.fieldname + Date.now() + req.file.originalname;
	const Image = {
		Bucket: 'air-xpress',
		Key: filenameIMG,
		Body: req.file.buffer
	};

	s3.upload(Image, (s3Err, datass) => {
		if (s3Err) throw s3Err

		console.log(datass);
	});
});

router.get('/productos/categoria/:category', function(req, res, next) {
	//return res.send(req.params)	;
	const category = Categories.findOne(
		{
			name: req.params.category
		}, function(err, category) {
			if (err) {
				return res.redirect('/productos')
			}
			if (category) {
				//console.log(category.name);
				console.log(category._id)
				Products.find({
					category_id: category._id
				}, function(err, list) {
					if (err) {
						return res.redirect('/');
					} else {
						return res.render('product/productList', {
							title: `Categoria - ${category.name}`,
							plist: list,
							userInfo: userInfo
						})

					}

				})

			}

		});

});



module.exports = router;
