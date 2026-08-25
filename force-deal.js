const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.model('Product', ProductSchema);
  await Product.updateOne({_id: '6a8d4267d53253bc77fd24b7'}, {$set: {isTopDeal: true}});
  console.log('Updated isTopDeal!');
  process.exit(0);
});
