const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const { text } = require("body-parser"); 

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  });
app.post('/clicked', (req,res)=>{
  
  res.send(boldify(req.body.text));
})
app.listen(port, () => {
console.log(`listening on port ${port}`)
});

function boldify (_text) {
  //boldpctg determines the extent of processing, somewhere from 0.58 to 0.83 is recommended
  var boldpctg = 0.58;
  //create character banks for iteration
  var dashes = ["-","—"];
  var punctuation = [",",".","-",":",";","*","'",'"',"!","/","(",")","[","]","—"];
  var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  //create array of words from the text recieved from client by splitting at spaces
  var array1 = _text.split(" ");
  //declare master string which will be added to many times then sent to client
  finalString = "";
  //add spaces back in that were removed from splitting
  array1.forEach(function(l_value,l_index,l_array){
    array1[l_index] = l_value + " ";
  })
  //check each word for punctuation that exists in between two letters (i.e. hyphens) and split word if present
  array1.forEach(function(l_value,l_index,l_array){
    //split current word into separate letters for iteration
    wordArray = l_value.split("");
    //start iterating
    wordArray.forEach(function(w_value,w_index,w_array){
      //check every letter against punctuation characters we want to identify here
      dashes.forEach(function(p_value,p_index,p_array){
        if (w_value == p_value){
          //see if there's a letter after the hyphen
          alphabet.forEach(function(a_value,a_index){
            if(wordArray[w_index + 1] == a_value){
              //see if there's a letter before the hyphen as well
              alphabet.forEach(function(aa_value,aa_index){
                  if(wordArray[w_index - 1] == aa_value){
                    //create two new arrays splitting the word from where we are in the current word's array
                    var firsthalf = wordArray.slice(0,w_index + 1);
                    var secondhalf = wordArray.slice(w_index + 1, wordArray.length);
                    //reduce new arrays to strings
                    var fhString = firsthalf.reduce(function(a,b){
                      return a + b;
                    });
                    var shString = secondhalf.reduce(function(_a,_b){
                      return _a + _b;
                    });
                    //delete hyphenated word, place the two new words in the correct index where it used to be
                    array1.splice(l_index,1,fhString,shString);
                }
              })
            }
          })
        }
      })
    })
  })
  //main processing
  array1.forEach(function(l_value,l_index,l_array){

    //remove starting/ending punctuation like parentheses, quotes, etc
    wordArrayOrig = l_value.split("");
    wordArray = l_value.split("");
    var space = " ";
    var p1 = "";
    var p2 = "";
    //remove spaces again so as not to inflate letter count and bold percentage
    if(wordArray.length > 1 && wordArray[wordArray.length -1] == " "){
      wordArray.pop();
      console.log("space popped");
    }else{
      space = "";
    }
    punctuation.forEach(function(p_value,p_index,p_array){
      //remove beginning punctuation
      if(wordArray[0] == p_value){
        p1 = p_value;
        wordArray.splice(0,1);
      }
      //remove end punctuation
      if(wordArray[wordArray.length -1] == p_value){
        p2 = p_value;
        wordArray.splice(wordArray.length -1,1);
      }
    })
    //choose number of characters to make bold, check to make sure it's not 0 as we do want single-letter words to be bold
    var boldchars = Math.floor(wordArray.length * boldpctg);
    if (boldchars < 1){
      boldchars += 1;
    }
    //create two new arrays dividing the current word, depending on where bold formatting ends
    console.log(l_value, boldchars);
    var boldarray = wordArray.slice(0,boldchars);
    var nonboldarray = wordArray.slice(boldchars,wordArray.length);
    var boldString = "";
    var nonboldString = "";
    //reduce arrays to strings
    var boldString = boldarray.reduce(function(a,b){
      return a + b
    });
    //some words won't have a populated nonboldarray so make sure it's reducible before trying to reduce
    if(nonboldarray[0] ){
      nonboldString = nonboldarray.reduce(function(a,b){
        return a + b
      });
    };
    
    //add strings to master string with formatting around section intended to be bold, add in punctuation that was removed earlier

    finalString = finalString + p1 + "<b>" + boldString + "</b>" + nonboldString + p2 + space;
    
  })
  //return master string for client
  return finalString;
}