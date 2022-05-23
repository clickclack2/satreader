const el = document.querySelector("#submitform");
const textfield = document.querySelector("#textfield");
el.addEventListener("submit", (event)=> {
    var request = new Request('/clicked', {
        method: 'POST',
        body: 'text=' + textfield.value,
        headers: {
            'content-type': 'application/x-www-form-urlencoded ',
          },
      });
    fetch(request).then(function(res){
        return res.text().then(function(text){
            console.log(text);
            document.querySelector("#textdiv").innerHTML = text;
        });
    });
});