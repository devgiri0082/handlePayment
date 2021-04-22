let readline = require("readline-sync");
let express = require("express");
const app = express();
const stripe = require("stripe")("sk_test_51Iit8LLRi6hvLJiXP3nsVlbpPSBQV4OnOG7zHDlzGFkFWrvtvt3dwZrPDyVi3M7OxlV87fWrfqb0sg2HkbgEUMGD00NW8KN56Z");
const fetch = require("node-fetch");
let cardNum = readline.question("Enter your card number: ");
let expiryMonth = readline.question("Enter card expiry month: ");
let expiryYear = readline.question("Enter card expiry year: ");
let cvcNum = readline.question("Enter card CVC code: ");

async function getToken() {
    let token = await stripe.tokens.create({
        card: {
            number: cardNum,
            exp_month: expiryMonth,
            exp_year: expiryYear,
            cvc: cvcNum,
        },
    })
    return token;
}
let token;
getToken()
    .then((e) => acceptPayment(e))
    .catch((e) => console.log(e.raw.code))

async function acceptPayment(e) {
    console.log("Created card token with id: " + e["id"]);
    const charge = await stripe.charges.create({
        amount: 1000,
        currency: 'usd',
        description: 'Example charge',
        source: e["id"],
    });
    console.log("Created charge with id: " + charge["id"]);
}