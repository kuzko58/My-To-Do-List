import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Debug from 'debug';
import 'dotenv/config';

const debug = Debug('mytodolist');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const password = process.env.SECRET_KEY;

mongoose.connect(`mongodb+srv://admin-chisom:${password}@cluster0.dkiie.mongodb.net/mytodolistDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
  complete: Boolean,
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome!',
  complete: false,
});

const item2 = new Item({
  name: 'Add a task to get started',
  complete: false,
});

const item3 = new Item({
  name: 'Delete or cross out a task when done',
  complete: false,
});

const defaultItems = [item1, item2, item3];

const today = new Date();
const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
};

const Day = today.toLocaleDateString('en-us', options);

app.get('/', (req, res) => {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems).then(() => res.redirect('/')).catch((e) => debug(e));
      } else {
        res.render('list.ejs', {
          items: foundItems,
          day: Day,
        });
      }
    }).catch((e) => debug(e));
});

app.post('/', (req, res) => {
  const item = new Item({
    name: req.body.newItem,
    complete: false,
  });
  item.save().then(() => res.redirect('/')).catch((e) => debug(e));
});

app.post('/update/item/:id/:status', (req, res) => {
  const itemId = req.params.id;
  const itemStatus = req.params.status;
  Item.findByIdAndUpdate(itemId, { complete: itemStatus }, { useFindAndModify: false })
    .then(() => res.redirect('/'))
    .catch((e) => debug(e));
});

app.post('/delete/item/:id', (req, res) => {
  const itemId = req.params.id;
  Item.findByIdAndRemove(itemId, { useFindAndModify: false })
    .then(() => res.redirect('/'))
    .catch((e) => debug(e));
});

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on ${port}...`));
