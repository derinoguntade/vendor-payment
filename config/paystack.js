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

    const deleteRecipient = (recipient_code_or_id, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transferrecipient/'+recipient_code_or_id,
          headers : {
             authorization: MySecretKey,
             'content-type': 'application/json',
             'cache-control': 'no-cache'
          }
        }
      const callback = (error, response, body)=>{
          return mycallback(error, body);
      }
      
      request.delete(options,callback); //request method to initialize a POST request
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
      request.get(options,callback); //request method to initialize a GET request
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
      request.get(options,callback); //request method to initialize a GET request
  }

  const resolveAccountNo = (acctno,bank_code, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/bank/resolve?account_number='+encodeURIComponent(acctno)+'&bank_code='+encodeURIComponent(bank_code),
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
const resend_otp = (form, mycallback) => {
      const options = {
          url : 'https://api.paystack.co/transfer/resend_otp',
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

  
   return {listBanks, deleteRecipient, resend_otp, createTransferRecipient, resolveAccountNo, listRecipients, initiateTransfer, finalizeTransfer, listTransfers};
}

module.exports = paystack
