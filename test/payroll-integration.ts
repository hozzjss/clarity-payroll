const BigNum = require("bn.js");
import * as fs from "fs";
import {
  makeSmartContractDeploy,
  makeContractCall,
  StacksTestnet,
  broadcastTransaction,
  standardPrincipalCV,
  uintCV,
} from "@blockstack/stacks-transactions";
import {} from "@blockstack/clarity";

import { assert } from "chai";
import { before } from "mocha";
const STACKS_API_URL = "http://127.0.0.1:20443";
let managerKeys = JSON.parse(fs.readFileSync("./keys.json").toString());
let worker1Keys = JSON.parse(fs.readFileSync("./keys2.json").toString());
let contractName = "payroll";
let codeBody = fs.readFileSync("./contracts/payroll.clar").toString();
let fee = new BigNum(1359);
let managerSecret = managerKeys.secretKey;
let worker1Secret = worker1Keys.secretKey;
const contractAddress = managerKeys.stacksAddress;

describe("payroll contract integration test suite", () => {
  let network: StacksTestnet;
  before(async () => {
    network = new StacksTestnet();
    network.coreApiUrl = STACKS_API_URL;
  });

  describe("deploying an instance of the contract", () => {
    before(async () => {
      console.log("I ran now");
      let transaction = await makeSmartContractDeploy({
        contractName,
        codeBody,
        fee,
        senderKey: managerSecret,
        nonce: new BigNum(0),
        network,
      });

      var result = await broadcastTransaction(transaction, network);
      console.log(result);
    });
    it("should register worker but only through manager account", async () => {
      await new Promise((r) => setTimeout(r, 10000));
      const fee = new BigNum(256);
      const transaction = await makeContractCall({
        contractName,
        contractAddress,
        functionArgs: [
          standardPrincipalCV("ST3Y1RF1BS8BQA7CDHSQBHHGXBXV3BZX7ES5G1R5E"),
          uintCV(2000),
        ],
        functionName: "add-worker",
        senderKey: managerSecret,
        nonce: new BigNum(1),
        network,
        fee,
      });

      var result = await broadcastTransaction(transaction, network);

      console.log(result);
    });
    it("should stop worker registration if someone other than manager sends that transaction", async () => {
      await new Promise((r) => setTimeout(r, 10000));
      const transaction = await makeContractCall({
        contractName,
        contractAddress,
        functionArgs: [
          standardPrincipalCV("ST3Y1RF1BS8BQA7CDHSQBHHGXBXV3BZX7ES5G1R5E"),
          uintCV(2000),
        ],
        functionName: "add-worker",
        senderKey: worker1Secret,
        nonce: new BigNum(0),
        network,
      });

      var result = await broadcastTransaction(transaction, network);

      console.log(result);
    });
  });
});
