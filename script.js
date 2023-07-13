'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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
// for displaying the movements
const displayMove = function (acc, sort = false) {
  const mx = acc.movements;
  containerMovements.innerHTML = '';
  const movs = sort ? mx.slice().sort((a, b) => a - b) : mx;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const htm = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${Math.abs(mov)}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htm);
  });
};
// calculating balance
const calculateBalance = function (acc) {
  const balance = acc.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.textContent = `${balance}€`;
  acc.balance = balance;
};

// calaculating display summary

const calculateDisplaySummary = function (accs) {
  labelSumIn.textContent = ` ${accs.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0)}€ `;

  labelSumOut.textContent = `${Math.abs(
    accs.movements.filter(move => move < 0).reduce((acc, move) => acc + move, 0)
  )}€`;

  labelSumInterest.textContent = `${accs.movements
    .filter(move => move > 0)
    .map(move => (move * accs.interestRate) / 100)
    .filter((move, i, arr) => {
      // console.log(arr);
      return move >= 1;
    })
    .reduce((acc, move) => acc + move, 0)}€`;
};
// displayMove(account1.movements);
// calculateBalance(account1.movements);
// calculateDisplaySummary(account1.movements, account1.interestRate);

// for computing the usernames

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUserNames(accounts);
// event listner
const update = function (acc) {
  // calculate and display movement
  displayMove(acc);
  // calculate and display balance__value
  calculateBalance(acc);
  // calculate and display summary
  calculateDisplaySummary(acc);
};
let currentAcc;
//apply login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // nature of submit button is changed to the normal button

  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // display ui

    labelWelcome.textContent = `Welcome Back ${currentAcc.owner}`;
    containerApp.style.opacity = 1;
    // input to empty string
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    update(currentAcc);
  }
});
//applying transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reci = accounts.find(acc => acc.userName === inputTransferTo.value);
  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    reci.userName !== currentAcc.userName
  ) {
    reci.movements.push(amount);
    currentAcc.movements.push(-amount);

    update(currentAcc);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
//appling loan function
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (currentAcc.movements.some(move => move > loanAmount * 0.1)) {
    currentAcc.movements.push(loanAmount);
    update(currentAcc);
  }
  inputLoanAmount.value = '';
});

// deleting a account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      account => account.userName === currentAcc.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    labelWelcome.textContent = `Login To Get Started`;
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting the movements
let sorted = false; //
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMove(currentAcc, !sorted);
  sorted = !sorted;
});
