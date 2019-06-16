const paystack = (request) => {
    const MySecretKey = 'Bearer sk_test_bb96935630fc24e527e8aad0e14a2e9165018894';

  const createTransferRecipient = (form, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transferrecipient',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          },
          form //contains name, account number, bankcode, etc
        }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.post(options,callback); //request method to initialize a POST request
  }

  const listRecipients = (mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transferrecipient',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          }
        }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.get(options,callback); //request method to initialize a GET request
  }

  const initiateTransfer = (form, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transfer',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          },
          form
        }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.post(options,callback); //request method to initialize a POST request
  }

  const finalizeTransfer = (form, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transfer/finalize_transfer',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          },
          form
        }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.post(options,callback); //request method to initialize a POST request
  }
    const listTransfers = (mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transfer',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          }
      }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      request.get(options,callback); //request method to initialize a POST request
  }

    const listBanks = (mycallback) => {
      const options = {
          url : 'https://api.paystack.co/bank',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          }
      }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      request.get(options,callback); //request method to initialize a POST request
  }
//initializePayment initializes a paystack transaction and returns request response (an auth url or error)
    /*const initializePayment = (form, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transaction/initialize',
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          },
          form//contains the full name, email, amount, etc for transaction//this data is being captured by the endpoint
       }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.post(options,callback); //request method to initialize a POST request
  }

  	const verifyPayment = (ref,mycallback) => {
  		const options = {
            url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
      	    headers : {
            	authorization: MySecretKey,
            	'content-type': 'application/json',
            	'cache-control': 'no-cache'
      	 	}
    	}
    	const callback = (error, response, body)=>{
        	return mycallback(error, body);
    	}
    	//get method by default
    	request(options,callback);
   }*/
   return {listBanks, createTransferRecipient, listRecipients, initiateTransfer, finalizeTransfer, listTransfers};
}

module.exports = paystack
