var express = require("express");
var router = express.Router();
const Products = require("../models/Producto.js");
const Categories = require("../models/Category.js");

const Bucket = "air-xpress";
const pageInfo = require("../helpers/pagination.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Air Xpress",
    userInfo: userInfo,
  });
});

router.get("/welcome", function (req, res, next) {
  res.render("welcome", {
    title: "Bienvenidos",
    userInfo: userInfo,
  });
});
//renders about us page
router.get("/nosotros", function (req, res, next) {
  res.render("nosotros", {
    title: "Nosotros",
    userInfo: userInfo,
  });
});
//renders products pages
router.get("/productos/show/:id", function (req, res, next) {
  productId: req.params.id;

  const product = Products.findOne(
    {
      _id: req.params.id,
    },
    { _id: 0, name: 1, description: 1, price: 1, img_key: 1 },
    function (err, resultp) {
      if (err) {
        return res.redirect("/productos");
      }
      if (resultp) {
        var img_url = `https://${Bucket}.s3.amazonaws.com/${resultp.img_key}`;

        return res.render("test/product", {
          title: `Categoria - ${resultp.name}`,
          product: resultp,
          userInfo: userInfo,

          img_url: img_url,
        });
      } else {
        return res.redirect("/productos");
      }
    }
  );
});

//products by category
router.get("/productos/categoria/:category", async function (req, res, next) {
  //pagination
  const itemsPerPage = 4;
  const page = +req.query.page || 1;
  let totalItems;

  let categories;

  try {
    const category = await Categories.findOne({ name: req.params.category });
    categories = await Categories.find({});

    if (category) {
      totalItems = await Products.countDocuments({ category_id: category._id });

      var productList = await Products.find(
        { category_id: category._id },
        { _id: 1, name: 1, price: 1, img_key: 1 },
        { skip: (page - 1) * itemsPerPage, limit: itemsPerPage }
      );

      var pagination = pageInfo(page, itemsPerPage, totalItems);
      return res.render("test/pagination", {
        title: `Categoria - ${category.name}`,
        plist: productList,
        userInfo: userInfo,
        page: pagination,
        categories: categories,
      });
    } else {
      return res.redirect("/productos");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/productos");
  }
});

//products page
router.get("/productos", async function (req, res, next) {
  const itemsPerPage = 4;
  const page = +req.query.page || 1;
  let totalItems;
  let categories;

  try {
    categories = await Categories.find({});
    totalItems = await Products.countDocuments({});
    console.log(categories);
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
          return res.render("test/pagination", {
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

module.exports = router;
