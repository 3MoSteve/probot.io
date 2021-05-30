# ProBot.io Package
<h1>
I made this package to make it easier for the people to claim the daily in ProBot.
In the new version i will make the package support capMonster and AntiCaptcha services
To make it more easier :)
All you have to do just add your tokens, proxies and the package will start claiming the daily in all Accounts.
</h1>

# Current Added Features

<table>
  <ul>
    <li>User Details</li>
    <li>Guilds Details</li>
    <li>Transaction Logs</li>
    <li>Claim Daily <strong style="color: lime">Supports Proxies</strong></li>
  </ul>
</table>

# Installation

```
npm install probot.io
```


# Usage

```js
const { ProClient } = require("probot.io");
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
<table>
  <tr>
    <th>Param</th>
    <th>Type</th>
    <th>Required</th>
    <th>Description</th>
    
  </tr>
  <tr>
    <td>Captcha</td>
    <td>String</td>
    <td>Yes</td>
    <td>Google ReCaptcha response code</td>
  </tr>
  <tr>
    <td>Proxy Options</td>
    <td>Object</td>
    <td>False</td>
    <td>Proxy Options</td>
    <td>host: required<br />port: required<br />protocol: Optional(Default: https)<br />username: Optional<br />password: Optional<br /></td>
  </tr>
</table>

## Without Proxy
```js
pro.claimDaily("google reCaptcha Response").then(response => {
  console.log(response);
}).catch(e => {
  console.log(e);
});
```

## With Proxy
```js
pro.claimDaily("google reCaptcha Response", {
  protocol: "https",
  host: "127.0.0.1",
  port: "8080",
  username: "Steve123", //Optional
  password: "MyPassword123$$"
}).then(response => {
  console.log(response);
}).catch(e => {
  console.log(e);
});
```