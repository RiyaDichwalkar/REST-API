const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
router.get("/", (req, res, next) => {
  Product.find()
    .select("prod_name prod_price _id prod_image prod_desc")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            prod_name: doc.prod_name,
            prod_price: doc.prod_price,
            prod_desc:doc.prod_desc,
            prod_image:doc.prod_image,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    prod_name: req.body.prod_name,
    prod_desc:req.body.prod_desc,
    prod_price: req.body.prod_price,
    prod_image:req.body.prod_image
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            prod_name: result.prod_name,
            prod_price: result.prod_price,
            prod_desc:result.prod_desc,
           prod_image:result.prod_image,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message:"error occured",
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('prod_name prod_price prod_desc prod_image _id ')
    .exec()
    .then(doc => {
      //console.log(doc);
      if (doc) {
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.update({ _id: id }, { $set: {prod_name:req.body.product.prod_name,
                      prod_desc:req.body.product.prod_desc,
                    prod_price:req.body.product.prod_price,
                    prod_image:req.body.product.prod_image
                  } })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          id:id,
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/products',
              body: { prod_name: 'String',prod_desc:'String', prod_price: 'Number' ,prod_image:'base64' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;