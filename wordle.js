  
  var height = 6; //number of guesses
  var width = 5; //length of the word

  var row = 0; //current guess
  var col = 0; //current letter

  var gameOver = false;

  const words = ["DEMON", "JENGA", "MACHO", "TABOO", "ICING"]
  const word = words[Math.floor(Math.random() * words.length)];

  console.log(word, words[word]);

  window.onload = function(){
    initialise();
  }

  function initialise() {

    //Create the game board
    for (let r=0; r<height; r++) {
      for (let c=0; c<width; c++) {
        //<span id ="0-0" class="tile">P</span>
        let tile =  document.createElement("span");
        tile.id=r.toString() + "-" + c.toString();
        tile.classList.add("tile");
        tile.innerText="";
        document.getElementById("board").appendChild(tile);

      }
    }

    //create the key board
    let keyboard = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], 
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
      ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Back"]

    ]

    for(let i=0; i<keyboard.length; i++) {
      let currRow=keyboard[i];
      let keyboardRow=document.createElement("div");
      keyboardRow.classList.add("keyboard-row");

      for(let j=0;j<currRow.length;j++) {
        let keyTile = document.createElement("div");

        let key=currRow[j];
        keyTile.innerText=key;
        if(key=="Enter") {
          keyTile.id="Enter";
        }
        else if(key=="Back") {
          keyTile.id="Backspace";
        }
        else if("A"<=key && key<="Z") {
          keyTile.id="Key"+key;//"Key"+"A"
        }

        keyTile.addEventListener("click", processKey);

        if(key=="Enter") {
          keyTile.classList.add("enter-key-tile");
        }else{
          keyTile.classList.add("key-tile");
        }keyboardRow.appendChild(keyTile);
      }
      document.getElementById("keyboard").appendChild(keyboardRow);

    }

    //listen for key press
    document.addEventListener("keyup", (e) => {
      processinput(e);
    })
  }

  function processKey() {
    let e={"code": this.id};
    processinput(e);
  }
  function processinput(e) {
    if(gameOver) return; 

      //alert(e.code);
      if("KeyA" <= e.code && e.code <= "KeyZ") {
        if(col < width) {
          let currTile = document.getElementById(row.toString()+ '-' + col.toString());
          if (currTile.innerText == "") {
            currTile.innerText=e.code[3];
            col+=1;
          }
        }
      }
      else if (e.code == "Backspace") {
        if(0<col && col<=width) {
          col-=1;
        }
        let currTile = document.getElementById(row.toString()+ '-' + col.toString());
        currTile.innerText = "";
      }
      else if (e.code == "Enter") {
        update();
        row+=1; //start new row
        col=0; //start at 0 for new row
      }

      if(!gameOver && row==height) {
        gameOver=true;
        document.getElementById("answer").innerText=word;
      }
  }


  function update() {
    let correct=0;
    let letterCount={}; //APPLE ->{A:1, P:2, L:1, E:1}
    for(let i=0;i<word.length;i++) {
      letter=word[i];
      if(letterCount[letter]) {
        letterCount[letter]+=1;
      }
      else {
        letterCount[letter]=1;
      }
    }

    //first iteration, check all the correct ones
    for(let c=0; c<width; c++) {
      let currTile = document.getElementById(row.toString()+ '-' + c.toString());
      let letter=currTile.innerText;

      //is it in the correct position?
      if(word[c]==letter){
        currTile.classList.add("correct");

        let keyTile=document.getElementById("Key"+letter);
        keyTile.classList.remove("present");
        keyTile.classList.add("correct");
        correct+=1;
        letterCount[letter]-=1;
      }

      if(correct == width) {
        gameOver=true;
        celebrateWin();
      }
    }
    //go again and mark which ones are present but in wrong position
    for(let c=0; c<width; c++) {
      let currTile = document.getElementById(row.toString()+ '-' + c.toString());
      let letter=currTile.innerText;

      if(!currTile.classList.contains("correct")) {
        //is it in the word?
        if (word.includes(letter) && letterCount[letter]>0) {
          currTile.classList.add("present");
          let keyTile=document.getElementById("Key"+letter);
          if(!keyTile.classList.contains("correct")) {
            keyTile.classList.add("present");
          }
          letterCount[letter]-=1;
        }//not in the word
        else {
          currTile.classList.add("absent");
        }
      }
    }
  }

  function celebrateWin() {
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  
    // Balloons (simulate with repeated confetti)
    let duration = 3 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
  
    let interval = setInterval(function() {
      let timeLeft = animationEnd - Date.now();
  
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
  
      let particleCount = 5 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() * 0.5 } }));
    }, 250);
  }
  