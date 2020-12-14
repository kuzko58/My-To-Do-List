"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug["default"])('mytodolist');
var app = (0, _express["default"])();
app.set('view engine', 'ejs');
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_express["default"]["static"]('public'));
var password = process.env.SECRET_KEY;

_mongoose["default"].connect("mongodb+srv://admin-chisom:".concat(password, "@cluster0.dkiie.mongodb.net/mytodolistDB"), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var itemsSchema = {
  name: String,
  complete: Boolean
};

var Item = _mongoose["default"].model('Item', itemsSchema);

var item1 = new Item({
  name: 'Welcome!',
  complete: false
});
var item2 = new Item({
  name: 'Add a task to get started',
  complete: false
});
var item3 = new Item({
  name: 'Delete or cross out a task when done',
  complete: false
});
var defaultItems = [item1, item2, item3];
var today = new Date();
var options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
};
var Day = today.toLocaleDateString('en-us', options);
app.get('/', function (req, res) {
  Item.find({}).then(function (foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems).then(function () {
        return res.redirect('/');
      })["catch"](function (e) {
        return debug(e);
      });
    } else {
      res.render('list.ejs', {
        items: foundItems,
        day: Day
      });
    }
  })["catch"](function (e) {
    return debug(e);
  });
});
app.post('/', function (req, res) {
  var item = new Item({
    name: req.body.newItem,
    complete: false
  });
  item.save().then(function () {
    return res.redirect('/');
  })["catch"](function (e) {
    return debug(e);
  });
});
app.post('/update/item/:id/:status', function (req, res) {
  var itemId = req.params.id;
  var itemStatus = req.params.status;
  Item.findByIdAndUpdate(itemId, {
    complete: itemStatus
  }, {
    useFindAndModify: false
  }).then(function () {
    return res.redirect('/');
  })["catch"](function (e) {
    return debug(e);
  });
});
app.post('/delete/item/:id', function (req, res) {
  var itemId = req.params.id;
  Item.findByIdAndRemove(itemId, {
    useFindAndModify: false
  }).then(function () {
    return res.redirect('/');
  })["catch"](function (e) {
    return debug(e);
  });
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
  return debug("Listening on ".concat(port, "..."));
});