# ProBot.io Package

# Current Available Features

<table>
  <ul>
    <li>User Details</li>
    <li>Guilds Details</li>
    <li>Transaction Logs</li>
    <li>Logout</li>
    <li>Get All available Profile backgrounds on the store</li>
    <li>Get All available Badges on the store</li>
    <li>Buy A new Profile backgrounds by ID</li>
    <li>Buy A new Badge By ID</li>
    <li>Tax Calculator</li>
    <li>Get the top 100 by XP</li>
    <li>Get the top 100 by credits</li>
    
  </ul>
</table>

# Installation

```
npm install probot.io
```

# Usage

```js
const { ProClient, tax } = require("probot.io");
const pro = new ProClient("0IxW0YE5Z7cg8Hw", "probot");
// Or Login with your Discord Token
 const pro = new ProClient("Your Discord Account Token", "discord");

pro.on("ready", () => { // When the Client is ready.
  console.log(`Logged in as [ ${pro.user.tag} ]`);
  console.log(`Amount of guilds: ${pro.guilds.length}`);
  console.log(`The amount of all Transactions: ${pro.transactions.reduce((a, b) => a + b.transactions.length, 0)}`);
});

```

# Claim The Daily
<span>Removed</span>

# Get all available badges or profile backgrounds
```js
client.getProfileBackgrounds().then(profiles => {
  console.log(profiles)
}).catch(e => {
  console.error(e);
}); //Get all available profile backgrounds

client.getBadges().then(badges => {
  console.log(badges);
}).catch(e => {
  cosnole.error(e);
}); //get All available badges

```

# Buy a badge or profile background
```js
client.buyProfilebackground(Number, Boolean).then(msg => {
  console.log(msg);
}).catch(e => {
  console.error(e);
}); //Buy a profile background By ID.

client.buyBadge(Number, Boolean).then(msg => {
  console.log(msg);
}).catch(e => {
  console.error(e);
}); //Buy a badge By ID.

```

# Tax Calculator
```js
const { tax } = require("probot.io");

tax.calculate(1000);
/*
{
  amount: 1000,
  tax: 950
}
*/
```

# Get Top 100 by credits & xp
```js
client.getTop100XP().then(users => {
  console.log(users);
}); //TOP 100 By XP

client.getTopBillionaires().then(users => {
  console.log(users);
}); //Top 100 by credits
```
