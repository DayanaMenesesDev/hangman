const btnLetter = document.querySelectorAll(".btnLetter");
const btnStartGame = document.getElementById("startGame");
const btnHelp = document.getElementById("btnHelp");
const contentWord = document.getElementById("contentWord");
const restartGame = document.getElementById("restart");
const contentWin = document.getElementById("win");
const contentHelps = document.getElementById("helps");
const contentLifes = document.getElementById("lifes");
const helpContainer = document.getElementById("helpContainer");
const words = ["patatas", "fresa", "sala", "vino", "amor", "rosa", "ketchup"];

let wins = 0;
let lifes;
let wordSelect;
let wordSecret;
let wordSecretArray = [];
const revealedLetters = new Set();

const disableLetter = () => {
  btnLetter.forEach((i) => {
    i.addEventListener("click", () => {
      i.setAttribute("disabled", "");
    });
  });
};

const startGame = () => {
  wordSelect = words[Math.floor(Math.random() * words.length)];
  wordSecret = Array(wordSelect.length).fill("_");
  contentWord.textContent = wordSecret.join("");
  wordSecretArray = [...wordSelect];
  return wordSelect;
};

const resetGame = () => {
  contentWord.innerHTML = "";
  lifes = 7;
  for (let i = 0; i < lifes; i++) {
    const item_i = document.createElement("i");
    const fragment = document.createDocumentFragment();
    item_i.setAttribute("class", "fa-solid fa-heart");
    fragment.appendChild(item_i);
    contentLifes.appendChild(fragment);
  }
  btnLetter.forEach((i) => {
    i.removeAttribute("disabled");
    i.style.backgroundColor = "";
    i.style.color = "";
  });
  startGame();
  disableLetter();
};

const win = () => {
  while (contentLifes.firstChild) {
    contentLifes.removeChild(contentLifes.firstChild);
  }
  let currentHelp = parseInt(helpContainer.innerHTML);
  btnLetter.forEach((i) => {
    i.removeAttribute("disabled");
    i.style.color = "black";
  });
  contentWin.innerHTML = parseInt(contentWin.textContent) + 1;
  if (contentWin.innerHTML % 5 === 0) {
    helpContainer.innerHTML = currentHelp + 1;
    btnHelp.removeAttribute("disabled");
  }
  resetGame();
};

const help = () => {
    let currentHelp = parseInt(helpContainer.textContent);
    if (currentHelp > 0) {
      helpContainer.innerHTML = currentHelp - 1;
      if (currentHelp == 1) {
          helpContainer.innerHTML = 0;
          btnHelp.setAttribute("disabled", "");
      }
      let letterToReveal;
      do {
        let randomIndex = Math.floor(Math.random() * wordSecretArray.length);
        letterToReveal = wordSecretArray[randomIndex];
      } while (
        revealedLetters.has(letterToReveal) ||
        contentWord.textContent.includes(letterToReveal)
      );
      if (!letterToReveal) { return; }
      revealedLetters.add(letterToReveal);
      wordSecretArray.forEach((letter, index) => {
        if (letter === letterToReveal) {
          wordSecret[index] = letterToReveal;
        }
      });
      
     btnLetter.forEach(btn => {/* 
      console.log(btn.textContent); */
      if (btn.textContent.toLocaleLowerCase() == letterToReveal) {
        btn.style.backgroundColor = "green";
        btn.style.color = "white";
        btn.setAttribute('disabled', '')
        console.log(letterToReveal);
      }
     })
     
      contentWord.textContent = wordSecret.join("");
    }
};

const handleLetterClick = (e) => {
  if (
    e.target.classList.contains("btnLetter") &&
    e.target.textContent.length === 1
  ) {
    const guessedLetter = e.target.textContent.toLowerCase();

    e.target.style.color = "white";
    if (!wordSelect.includes(guessedLetter)) {
      e.target.style.backgroundColor = "red";
      lifes--;
      contentLifes.removeChild(contentLifes.children[0]);
      if (lifes <= 0) {
        setTimeout(() => {
          alert("¡Has perdido! La palabra era: " + wordSelect);
          wins = 0;
          contentWin.innerHTML = wins;
          resetGame();
        }, 100);
      }
    } else {
      e.target.style.backgroundColor = "green";
      wordSecretArray.forEach((letter, index) => {
        if (letter === guessedLetter) {
          wordSecret[index] = guessedLetter;
        }
      });
      contentWord.innerHTML = wordSecret.join("");
      setTimeout(() => {
        if (wordSelect === contentWord.textContent) {
          win();
        }
      }, 100);
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  contentWin.innerHTML = wins;
  resetGame();
  restartGame.removeAttribute("disabled");
});

restartGame.addEventListener("click", () => {
  wins = 0;
  contentWin.innerHTML = wins;
  while (contentLifes.firstChild) {
    contentLifes.removeChild(contentLifes.firstChild);
  }
  resetGame();
});

btnLetter.forEach((i) => {
  i.addEventListener("click", handleLetterClick);
});


btnHelp.addEventListener('click', ()=> {
  help()
  if (wordSelect == contentWord.textContent) {
    console.log(wordSelect);
    setTimeout(() => {
        win();
    }, 200);
  }
})