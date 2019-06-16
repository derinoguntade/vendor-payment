script.
  function onButtonClick(){
    $.ajax({
      "url": "/AllTransfers",
      "method": "GET"
    }); 
  }