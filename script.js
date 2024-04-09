const inputSlider = document.getElementById("lengthSlider");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.getElementById("upperCase");
const lowercaseCheck = document.getElementById("lowerCase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`!@#$%^&*()_+=-{[}]:;"<,>.?/';

let password = "";
let passwordLength = 15;
let checkCount = 0;
handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  // Set color and Shadow
  indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randomNumber = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNumber);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasSym || hasNum) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copymsg.innerText = "Copied Successfully";
  } catch (error) {
    copymsg.innerText = `Error : ${error}`;
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 4000);
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  if (password.length < checkCount) {
    password.length = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  console.log(e.target);
  console.log(e.target.value);
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) {
    return;
  }

  if (password.length < checkCount) {
    password.length = checkCount;
    handleSlider();
  }

  password = "";

  //   if (uppercaseCheck.checked) {
  //     password += generateUpperCase();
  //   }
  //   if (lowercaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (numbersCheck.checked) {
  //     password += generateRandomNumber();
  //   }
  //   if (symbolsCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funArr = [];

  if (uppercaseCheck.checked) {
    funArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funArr.push(generateSymbol);
  }

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRandomInteger(0, funArr.length);
    console.log("randIndex" + randIndex);
    password += funArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;
  calcStrength();
});
