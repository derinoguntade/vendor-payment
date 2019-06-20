const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
const _ = require('lodash');
const path = require('path');
const moment = require('moment')
//const {Payer} = require('./models/payer');
const {listBanks, resend_otp, createTransferRecipient, deleteRecipient, resolveAccountNo, listRecipients, initiateTransfer, finalizeTransfer, listTransfers} = require('./config/paystack')(request);
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());//uses bodyparser middleware (on this pipeline) to auto convert request body to JS object
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "style/")));//for css, js files
app.set("view engine", pug);

//landing page -> index.pug view
app.get("/",(req, res) => {
		listRecipients((error, body)=>{
        	if(error){
            	//handle errors
          		console.log(error);
            	res.redirect("/error");
          		return;
       		}
       		response = JSON.parse(body); //converts response body to JS object
       		const recipientData = response.data;
       		//console.log(recipientData);
       		const message1 = "Welcome to VenPay";
       		const message2 = "Add CakeHaven's vendor accounts & pay vendors on the go!";
       		//res.send();
       		res.render('transfer.pug',{recipientData, message1, message2});
   	});
});

app.get("/AllRecipients",(req, res) => {
		listRecipients((error, body)=>{
        	if(error){
            	//handle errors
          		console.log(error);
            	res.redirect("/error");
          		return;
       		}
       		response = JSON.parse(body); //converts response body to JS object
       		const recipientData = response.data;
       		res.render('AllRecipients.pug',{recipientData});
   	});
});

app.delete("/delete/:recipient_code_or_id",(req, res) => {
	const recipient_code_or_id = req.params.recipient_code_or_id;
	//const form = _.pick(req.body,["recipient_code"]);
	form=[recipient_code_or_id];
		deleteRecipients(form,(error, body)=>{
        	if(error){
            	//handle errors
          		console.log(error);
            	res.redirect("/error");
          		return;
       		}
       		response = JSON.parse(body); //converts response body to JS object
       		console.log(response.status);
       		if(response.status==false||!response.status){
       			const message = response.message;
       			res.render('error.pug',{message});
       			return
       }
       		const message = response.message;
       		res.redirect('/AllRecipients',{message});
   	});//a(href="/delete/" + t.recipient_code) Delete
});

app.get("/create",(req, res) => {
	listBanks((error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            res.redirect("/error");
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       const bankData = response.data;
       res.render("create.pug", {bankData}); 
    });
});

//listen for app
app.listen(port, () => {
	console.log(`App running on port ${port}`)
});

app.get("/confirm-recipient", (req, res) => {
   	account_number=req.query.account_number;
    bank_code=req.query.bank_code; 
    resolveAccountNo(account_number,bank_code, (error, body)=>{
    	if(error){
          	//handle errors
           	console.log(error);
           	res.redirect("/error");
           	return;
       	}
       	response = JSON.parse(body);

       	console.log(response); 
       	if(!response.status){
       		console.log("false "+response.status);
       		const message = response.message;
       		res.render('error.pug',{message});
       		return;
       	}
       	var confirmedrecipient = response.data;
       	//confirmedrecipient.name = form.name;
       	confirmedrecipient.bank_code=bank_code;
       	res.render("confirm.pug", {confirmedrecipient})
      });
});

app.post("/create-recipient", (req, res) => {
	//pick function selects some fields from the request body
    const form = _.pick(req.body,["account_name","account_number","name","bank_code","type","currency"]);
    //form.amount *= 100;
    form.type="nuban";
    form.currency="NGN";
    createTransferRecipient(form, (error, body)=>{
        		if(error){
           			//handle errors
           			console.log(error);
            		res.redirect("/error");
            		return;
       			}
   	});res.redirect("/create");

});

app.get("/transfer", (req, res) => {
	listRecipients((error, body)=>{
        	if(error){
            	//handle errors
          		console.log(error);
            	res.redirect("/error");
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
            res.redirect("/error");
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       const transfer_code = response.data.transfer_code;
       console.log(response);
       res.render('otp.pug',{transfer_code});//"/transfer/complete/"+transfer_code);
    });
});

app.post("/resend_otp/:transfer_code", (req, res) => {
	//pick function selects some fields from the request body
  	const transfer_code = req.params.transfer_code;
  	const reason = "resend_otp";
  	form=[transfer_code,reason]
  	resend_otp(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            res.redirect("/error");
            return;
       }
       response = JSON.parse(body); //converts response body to JS object
       console.log(response.status);
       if(response.status==false||!response.status){
       		const message = response.message;
       		res.render('error.pug',{message});
       		return
       }
       message=response.message;
       res.render('otp.pug',{transfer_code,message});//"/transfer/complete/"+transfer_code);
    });
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
            res.redirect("/error");
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
            res.redirect("/error");
            return;
       }
       var allTransferData=[];
       response = JSON.parse(body); //converts response body to JS object
       const temp = response.data;
       for (val in temp){
       		if(temp[val].status=='success'){
       			allTransferData.push(temp[val]);

       		}
       }
       //const  allTransferData= response.data;
       for (val in allTransferData) { 
      		allTransferData[val].updatedAt = moment(allTransferData[val].updatedAt).format('LLL').toString();
		}
       
       res.render("alltransfers.pug", {allTransferData});
    });
});

app.get("/error", (req, res)=>{
    res.render('error.pug');
});