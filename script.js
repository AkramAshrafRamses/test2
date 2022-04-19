'use strict';



// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const popMessage = document.querySelector(".pop");
const exitPop = document.querySelector(".closeBtn")
const nav = document.querySelector(".nav")

const messageText = document.querySelector(".message")
const popTitle = document.querySelector(".title")




const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let currentAccount;



const displayMovements = function (movements) {

  containerMovements.innerHTML = "";


  movements.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const HTML = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type === "deposit" ? "In" : "Out"}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement}€</div>
  </div>
  `
    containerMovements.insertAdjacentHTML("afterbegin", HTML);


  })

}

const getUserNames = function (accounts) {

  accounts.forEach(function (account) {
    account.userName = account.owner.toLowerCase().split(" ").map(n => n[0]).join("");

  })
}

const getLoans = function (accounts) {

  accounts.forEach(function (account) {
    account.loan = [];

  })
}

const calculateDisplayBalance = function (movements) {

  const balance = movements.reduce((acc, movement) => acc + movement, 0);
  labelBalance.textContent = `${balance}${'€'}`;

}

const calculateDisplaySummary = function (movements) {
  const sumIn = movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${sumIn}${'€'}`

  const sumOut = movements
    .filter((movement) => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}${'€'}`

  const sumIntrest = movements
    .filter(movement => movement > 0)
    .map(movement => movement * currentAccount.interestRate / 100) // change rate 
    .filter(movement => movement >= 1)
    .reduce((acc, movement) => acc + movement, 0);

  labelSumInterest.textContent = `${Math.round(sumIntrest, 1)}${'€'}`



}


const searchForAccount = function (username) {

  const userAccount = accounts.find(acc => acc.userName === username);
  return userAccount;

}

const checkCredentials = function (account, inputUserName, inputPin) {
  if (account?.userName === inputUserName && account.pin === Number(inputPin)) {
    return true;
  } else {
    return false;
  }

}


const login = function (e) {
  e.preventDefault();
  let inputUserName = inputLoginUsername.value;
  let inputPin = inputLoginPin.value;
  currentAccount = searchForAccount(inputUserName);
  if (checkCredentials(currentAccount, inputUserName, inputPin)) {
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]}`
    displayMovements(currentAccount.movements);
    calculateDisplayBalance(currentAccount.movements);
    calculateDisplaySummary(currentAccount.movements);
    containerApp.style.opacity = "1";

  } else {

    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = "0";
    popMessageText("Alert", "red", "Wrong Credentials")

  }
  inputLoginUsername.value = inputLoginPin.value = "";
  inputPin.blur;
  inputLoginUsername.blur;




}


const repayLoan = function (amount) {
  if (currentAccount.loan.length > 0 && currentAccount.loan[0] === amount && amount > 0) {
    popMessageText("Success", "green", `${amount}${'€'} has Been Payed Back To The Bank `)
    currentAccount.loan = [];
    currentAccount.movements.push(amount * -1);
    displayMovements(currentAccount.movements);
    calculateDisplayBalance(currentAccount.movements);
    calculateDisplaySummary(currentAccount.movements);


  } else if (amount <= 0) {
    popMessageText("Alert", "red", "Sorry, Invalid Transfer Amount")



  } else if (currentAccount.loan.length === 0) {
    popMessageText("Alert", "red", "Sorry, You Have No Old Loan To pay")


  } else {
    popMessageText("Alert", "red", `Sorry, You Must Repay ${currentAccount.loan[0]}${'€'} Exact`)

  }

  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur;
  inputTransferTo.blur;



}

const transferMoney = function (e) {
  e.preventDefault();

  const receiver = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);


  if (receiver.toLowerCase() !== "bank") {
    const receiverAccount = searchForAccount(receiver);
    const currentUserbalance = currentAccount.movements.reduce((acc, movement) => acc + movement, 0);

    if (receiverAccount && amount <= currentUserbalance && amount > 0 && receiverAccount !== currentAccount) {
      popMessageText("Success", "green", `Transfered ${amount}${'€'} To ${receiverAccount.owner} `)

      currentAccount.movements.push(amount * -1);
      receiverAccount.movements.push(amount);
      displayMovements(currentAccount.movements);
      calculateDisplayBalance(currentAccount.movements);
      calculateDisplaySummary(currentAccount.movements);


    } else if (!receiverAccount) {
      popMessageText("Alert", "red", "Sorry, Reciever Account Not Found")


    } else if (!(amount > 0)) {
      popMessageText("Alert", "red", "Sorry, Invalid Transfer Amount")
    } else if (receiverAccount === currentAccount) {

      popMessageText("Alert", "red", "Sorry, Can't Transfer To Yourself")


    } else {
      popMessageText("Alert", "red", "Sorry, No Enough Money")


    }

    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur;
    inputTransferTo.blur;


  } else {
    repayLoan(amount);
  }


}



const popMessageText = function (title, titleColor, message) {
  messageText.textContent = message;
  popTitle.textContent = title;
  popTitle.style.color = titleColor;
  popMessage.style.display = "block";
  containerApp.style.display = "none"
  nav.style.display = "none"

}



exitPop.addEventListener("click", function () {

  popMessage.style.display = "none";
  containerApp.style.display = "grid"
  nav.style.display = "flex"



})

const deleteAccount = function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const userPin = inputClosePin.value;
  if (checkCredentials(currentAccount, user, userPin)) {
    const accountIndex = accounts.findIndex(acc => acc.userName === user);
    accounts.splice(accountIndex, 1)
    popMessageText("Success", "green", "Your Account Have Been Deleted")
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = "0";


  } else {
    popMessageText("Alert", "red", "Wrong Credentials")
  }

}

const requestLoan = function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const tenPercentOfLoan = Math.round(loanAmount * (10 / 100), 1);
  if (currentAccount.movements.some(mov => mov > tenPercentOfLoan) && loanAmount > 0 && currentAccount.loan.length === 0) {
    currentAccount.movements.push(loanAmount)
    currentAccount.loan.push(loanAmount);
    popMessageText("Success", "green", `${loanAmount}${'€'} has Been Added To Your Account `)
    displayMovements(currentAccount.movements);
    calculateDisplayBalance(currentAccount.movements);
    calculateDisplaySummary(currentAccount.movements);

  } else if ((currentAccount.loan.length > 0)) {
    popMessageText("Alert", "red", `Sorry, You Have To Pay ${currentAccount.loan[0]}${'€'} Before Requesting A New Loan `)


  } else {
    popMessageText("Alert", "red", "Sorry, You Don't Have 10% Of The Loan Amount ")


  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur;


}



getLoans(accounts);
getUserNames(accounts);
btnLogin.addEventListener("click", login);

btnTransfer.addEventListener("click", transferMoney);
btnClose.addEventListener("click", deleteAccount);

btnLoan.addEventListener("click", requestLoan)

