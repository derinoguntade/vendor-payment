const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');
//const {Payer} = require('./models/payer');
const {listBanks, createTransferRecipient, listRecipients, initiateTransfer, finalizeTransfer, listTransfers} = require('./config/paystack')(request);
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());//uses bodyparser middleware (on this pipeline) to auto convert request body to JS object
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "style/")));//for css, js files
app.set("view engine", pug);

//landing page -> index.pug view
app.get("/",(req, res) => {
	listBanks((error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       //console.log(response);
       const bankData = response.data;
       //console.log(bankData);
       res.render("index.pug", {bankData});
       //res.redirect(response.data.authorization_url)//picks auth url & redirects to paystack
    });
});

app.get("/create",(req, res) => {
	listBanks((error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       //console.log(response);
       const bankData = response.data;
       //console.log(bankData);
       res.render("create.pug", {bankData});
       //res.redirect(response.data.authorization_url)//picks auth url & redirects to paystack
    });
});

//listen for app
app.listen(port, () => {
	console.log(`App running on port ${port}`)
});

app.post("/create-recipient", (req, res) => {
	//pick function selects some fields from the request body
    const form = _.pick(req.body,["account_number","name","bank_code","type","currency"]);
    //form.amount *= 100;
    form.type="nuban";
    form.currency="NGN";

    //form.account_name=form.name;
    
	createTransferRecipient(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
    });res.redirect("/create");
});

app.get("/transfer", (req, res) => {
	listRecipients((error, body)=>{
        	if(error){
            	//handle errors
          		console.log(error);
          		return;
       		}
       		response = JSON.parse(body); //converts response body to JS object
       		const recipientData = response.data;
       		console.log(recipientData);
       		res.render('transfer.pug',{recipientData});
   	});
});

app.post("/transfer/initiate", (req, res) => {
	//pick function selects some fields from the request body
    const form = _.pick(req.body,["source","amount","reason", "currency","recipient"]);
    form.amount *= 100;
    form.currency= "NGN";
    form.source="balance";
    console.log("source: "+form.source+" amount: "+form.amount+" recipient: "+form.recipient);
	initiateTransfer(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       const transfer_code = response.data.transfer_code;
       console.log(response);
       res.render('otp.pug',{transfer_code});//"/transfer/complete/"+transfer_code);
    });//res.redirect("/create");
});

app.post("/transfer/complete/:transfer_code", (req, res) => {
	//pick function selects some fields from the request body
	const transfer_code = req.params.transfer_code;
    const form = _.pick(req.body,["otp","transfer_code"]);
    form.transfer_code=transfer_code;
    //form.account_name=form.name;
    //console.log("source: "+form.source+" amount: "+form.amount+" recipient: "+form.recipient);
	finalizeTransfer(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       console.log(response.status);
       if(response.status==false||!response.status){
       		const message = response.message;
       		res.render('error.pug',{message});
       		return
       }
       console.log(response);
       const amount = response.data.amount;
       res.render("success.pug",{amount});
    });
});

app.get("/AllTransfers",(req, res) => {
	listTransfers((error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       //console.log(response);
       const allTransferData = response.data;
       console.log(allTransferData);
       res.render("alltransfers.pug", {allTransferData});
       //res.redirect(response.data.authorization_url)//picks auth url & redirects to paystack
    });
});

app.get("/error", (req, res)=>{
    res.render('error.pug');
});



/*
app.post("/paystack/pay", (req, res) => {
	//pick function selects some fields from the request body
    const form = _.pick(req.body,["amount","email","full_name"]);
    form.metadata = {
        full_name : form.full_name//form metadata property helps secure name on paystack
    }
    form.amount *= 100;//amount is in kobo
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       res.redirect(response.data.authorization_url)//picks auth url & redirects to paystack
    });
});


app.get("/paystack/callback", (req,res) => {
    const ref = req.query.reference;

    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors 
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);//parse body of the returned response
        console.log(response);
        const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);
        [reference, amount, email, full_name] = data;
        newPayer = {reference, amount, email, full_name}
        const payer = new Payer(newPayer)//payer mongoose model object
        payer.save().then((payer)=>{//persist data in db
            if(payer){
                res.redirect("/receipt/"+payer._id);
            }
        }).catch((e)=>{
            res.redirect("/error");
        })
    })
});

app.get('/receipt/:id', (req, res)=>{
    const id = req.params.id;
    Payer.findById(id).then((payer)=>{
        if(!payer){
            //handle error when the payer is not found
            res.redirect('/error');
        }
        res.render('success.pug',{payer});
    }).catch((e)=>{
        res.redirect('/error');
    })
});*/