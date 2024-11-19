const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true, default: 10 },
});

const Domain = mongoose.model('Domain', domainSchema);


module.exports = Domain;
