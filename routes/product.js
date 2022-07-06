var express = require("express");
var router = express.Router();
const Products = require("../models/Producto.js");
const Categories = require("../models/Category.js");

const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const { check, checkSchema, validationResult } = require("express-validator");

const pageInfo = require("../helpers/pagination.js");

const Bucket = "air-xpress";

var multer = require("multer");
var upload = multer();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//getst the products in a list, using pagination
router.get("/list", async function (req, res, next) {
  const itemsPerPage = 4;
  const page = +req.query.page || 1;
  let totalItems;
  let categories;

  try {
    categories = await Categories.find({});
    totalItems = await Products.countDocuments({});
    Products.find(
      {},
      {},
      { skip: (page - 1) * itemsPerPage, limit: itemsPerPage },
      (err, list) => {
        if (err) {
          return res.redirect("/");
        } else {
          console.log(totalItems);
          var pagination = pageInfo(page, itemsPerPage, totalItems);
          return res.render("product/productList", {
            title: `Productos`,
            plist: list,
            userInfo: userInfo,
            categories: categories,
            page: pagination,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});
router.post(
  "/modify",
  upload.single("img"),
  check("price").isCurrency(),
  //validation
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "El nombre del producto no puede estar vacio",
      },
    },
    categoryId: {
      notEmpty: {
        errorMessage: "Por favor selecciones una categoria valida",
      },
    },
    price: {
      notEmpty: {
        errorMessage: "El precio del producto no puede estar vacio",
      },

      min: 0,
    },
    description: {
      notEmpty: {
        errorMessage: "La description del producto no puede estar vacia",
      },
    },
  }),

  async function (req, res, next) {
    const errors = validationResult(req);

    console.log(errors.mapped());
    if (!errors.isEmpty()) {
      console.log(errors);
      req.flash("errors", errors.mapped());
      return res.redirect("/product/modify/" + req.body.id);
    }

    try {
      const category = await Categories.findById(req.body.categoryId);
      if (category) {
        const product = await Products.findOne({ _id: req.body.id });
        if (req.file && product) {
          console.log("hoooo");
          console.log(req.file.fieldname);
          let filenameIMG =
            "" + req.file.fieldname + Date.now() + req.file.originalname;
          const Image = {
            Bucket: "air-xpress",
            Key: filenameIMG,
            Body: req.file.buffer,
          };
          const datass = await s3.upload(Image).promise();
          product.img_key = datass.Key;
        }
        if (product) {
          product.name = req.body.name;
          product.description = req.body.description;
          product.price = req.body.price;
          product.category_id = req.body.categoryId;
          product.save();
          return res.redirect("/product/list");
        }
      }
    } catch (err) {}
  }
);

router.get("/modify/:id", async function (req, res, next) {
  productId: req.params.id;
  try {
    const categories = await Categories.find({});
    const product = await Products.findOne({ _id: req.params.id }, {});

    if (product) {
      var img_url = `https://${Bucket}.s3.amazonaws.com/${product.img_key}`;

      return res.render("product/modify", {
        title: `Categoria - ${product.name}`,
        product: product,
        userInfo: userInfo,

        img_url: img_url,

        errormgs: req.flash("errors"),
        categories: categories,
      });
    } else {
      return res.redirect("/product/list");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/product/list");
  }
});

router.get("/add", function (req, res, next) {
  Categories.find()
    .exec()
    .then((categories) => {
      res.render("product/productAdd", {
        title: "Añadir Producto",
        userInfo: userInfo,
        categories: categories,
        errormgs: req.flash("errors"),
      });
    });
});

router.get("/category/add", function (req, res, next) {
  res.render("product/categoryAdd", {
    title: "Añadir Categoria",
    userInfo: userInfo,
  });
});

router.post(
  "/add",
  upload.single("img"),
  check("price").isCurrency(),
  //validation
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "El nombre del producto no puede estar vacio",
      },
    },
    categoryId: {
      notEmpty: {
        errorMessage: "Por favor selecciones una categoria valida",
      },
    },
    price: {
      notEmpty: {
        errorMessage: "El precio del producto no puede estar vacio",
      },

      min: 0,
    },
    description: {
      notEmpty: {
        errorMessage: "La description del producto no puede estar vacia",
      },
    },
  }),

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.mapped());
      return res.redirect("/product/add");
    }
    let category;
    try {
      category = await Categories.findById(req.body.categoryId);
    } catch (err) {
      console.log(err);
      return res.redirect("/product/list");
    }

    if (category) {
      const newProduct = new Products({
        name: req.body.name,
        price: req.body.price,
        category_id: req.body.categoryId,
        description: req.body.description,
      });

      if (req.file) {
        console.log(req.file.fieldname);
        let filenameIMG =
          "" + req.file.fieldname + Date.now() + req.file.originalname;
        const Image = {
          Bucket: "air-xpress",
          Key: filenameIMG,
          Body: req.file.buffer,
        };
        try {
          const datass = await s3.upload(Image).promise();
          newProduct.img_key = datass.Key;
        } catch (err) {
          console.log(err);

          req.flash("imgError", "Error Guardando Imagen");
          return res.redirect("/product/list");
        }
      }

      newProduct
        .save()
        .then((product) => {
          console.log(product);
          return res.redirect("/product/list");
        })
        .catch((err) => {
          console.error(err);

          req.flash("saveError", "Error Guardando Producto");
          return res.redirect("/product/list");
        });
    } else {
      req.flash("saveError", "Categoria no encontrada");

      return res.redirect("/product/list");
    }
  }
);

router.post(
  "/category/add",
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "La description del producto no puede estar vacia",
      },
    },
  }),
  function (req, res, next) {
    const newCategory = new Categories({
      name: req.body.name,
      description: req.body.description,
    });

    newCategory
      .save()
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        console.error(err);
        res.send("Ocurrió un error");
      });
  }
);

module.exports = router;
