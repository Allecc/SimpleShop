const express = require('express');
const router = express.Router();
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('appbase', 'root', '', {
  dialect: 'mysql',
  host: 'localhost', // nazwa hosta
  port: 3306 // numer portu
});

var title = 'Pani Kusia';

var Product = sequelize.define('Product', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.FLOAT,
  image: Sequelize.STRING,
  show: Sequelize.BOOLEAN
});

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: title
  });
});

router.get('/home')

router.get('/home', function(req, res) {
  res.redirect('/');
});
router.get('/products', function(req, res) {
  res.redirect('/#products');
});
router.get('/about', function(req, res) {
  res.redirect('/#about');
});
router.get('/contact', function(req, res) {
  res.redirect('/#contact');
});

/* Get information from database */
router.get('/load', function(req, res) {
  sequelize.sync()
    .then(() => {
      Product.findAll({
        raw: true
      }).then((product) => {
        res.json(product);
      });
    });
});

router.get('/product/:id', function(req, res) {
  Product.findById(Number(req.params.id))
    .then(function(product) {
      res.render('product_by_id', {
        product: product
      });
    });
});

router.delete('/product/:id', function(req, res) {
  Product.findById(Number(req.params.id))
    .then(function(product) {
      console.log('Destroyed: ' + product.title);
      product.destroy();
      res.redirect('back');
    });
});


/* Add data to database */
router.post('/add', function(req, res) {
  let data = {
    'title': req.body.title,
    'description': req.body.description,
    'price': req.body.price,
    'image': req.body.image
  };

  console.log(data);

  Product
    .build({
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image,
      status: 0
    })
    .save()
    .then(function(returnSaved) {})
    .catch(function(error) {});

  sequelize.sync();

  res.redirect('/admin');
});

router.get('/test', function(req, res) {

  /*  User
      .build({
        username: "admin",
        password: "admin",
        status: 0
      })
      .save()
      .then(function(returnSaved) {})
      .catch(function(error) {});*/
    sequelize.sync()
      .then( () => {
          Product.create({
            title: 'Apple',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '2.99',
            image: 'apple',
            show: 'false'
          });
          Product.create({
            title: 'Cherry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '15.99',
            image: 'cherry',
            show: 'false'
          });
          Product.create({
            title: 'Coco',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '7.99',
            image: 'Coco',
            show: 'false'
          });
          Product.create({
            title: 'Kiwi',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '7.99',
            image: 'kiwi',
            show: 'false'
          });
          Product.create({
            title: 'Orange',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '5.99',
            image: 'orange',
            show: 'false'
          });
          Product.create({
            title: 'Raspberry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '6.99',
            image: 'Raspberry',
            show: 'false'
          });
          Product.create({
            title: 'Strawberry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '9.99',
            image: 'strawberry',
            show: 'false'
          });
      })
      .then( () => {
        User.create({
          username: 'admin',
          password: 'admin'
        })
      });


  res.redirect('/');
});

// LOGIN
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    }).then(function(user, err) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id).then(function(user, err) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/admin'
  }),
  function(req, res) {
    console.log('rage');
    res.render('admin', {
      user: req.user
    });
  });

/* Admin page */
router.get('/admin', function(req, res) {
  res.render('admin', {
    user: req.user
  });
});

module.exports = router;
