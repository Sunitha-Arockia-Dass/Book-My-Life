window.addEventListener('beforeunload', function (e) {
    console.log(document.location)
   
    e.preventDefault();
    e.returnValue = 'Do you want to leave the page?';
    setTimeout(function () { // Timeout to wait for user response
        setTimeout(function () { // Timeout to wait onunload, if not fired then this will be executed
            console.log('User stayed on the page.');
    }, 50)}, 50);
    return 'Do you want to leave the page?';
  });