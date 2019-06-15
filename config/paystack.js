const paystack = (request) => {
    const MySecretKey = 'Bearer sk_test_bb96935630fc24e527e8aad0e14a2e9165018894';
    
    //initializePayment initializes a paystack transaction and returns request response (an auth url or error)
    const initializePayment = (form, mycallback) => {
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
   }
   return {initializePayment, verifyPayment, listBanks};
}

module.exports = paystack
