const {mongoose} = require('./../config/mongoose');
const recipientSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
account_number: {
    type: String,
    required: false,
},
type: {
    type: Number,
    required: true,
},
rec_code: {
    type: String,
    required: true
},
bank_code: {
    type: String,
    required: true
}
});
const Recipient = mongoose.model('Recipient', recipientSchema);
module.exports = {Recipient}