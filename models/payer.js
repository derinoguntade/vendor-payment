const {mongoose} = require('./../config/mongoose');
const payerSchema = new mongoose.Schema({
full_name: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
},
amount: {
    type: Number,
    required: true,
},
reference: {
    type: String,
    required: true
}
});
const Payer = mongoose.model('Payer', payerSchema);
module.exports = {Payer}