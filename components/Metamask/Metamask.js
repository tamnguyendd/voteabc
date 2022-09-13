import sm_contract_bnb from '../smart_contract/vote_contract_bnb';
import Web3 from 'web3';

const MultiTokenPurchase_ABI = sm_contract_bnb.VOTE.ABI;
//const ERC20_ABI = MetamaskAddress.ERC20_ABI;
const MultiTokenPurchase_ADDRESS = sm_contract_bnb.VOTE.Address;

export const metamask = {
  getTokenContract: function (tokenAddress) {
    return new web3.eth.Contract(ERC20_ABI, tokenAddress);
  },

  getWeb3: function () {
    return new Web3(window.ethereum);
  },

  getContractMM: function () {
    var web3 = new Web3(window.ethereum);
    var ContractMM = new web3.eth.Contract(MultiTokenPurchase_ABI, MultiTokenPurchase_ADDRESS);
    return ContractMM;
    //return new this.getWeb3().eth.Contract(MultiTokenPurchase_ABI, MultiTokenPurchase_ADDRESS);
  },

  getBalance: async function () {
    var crAddress = await this.getCurrentMM_Address();
    if (crAddress) {
      var balance = await this.getDefaultBalance(crAddress);
      console.log(balance);
      return balance;
    }

    return 0;
  },

  getDefaultBalance: async function (address) {
    const ethBalance = await this.getWeb3().eth.getBalance(address);
    return this.getWeb3().utils.fromWei(ethBalance, "ether");
  },

  getCurrentMM_Address: async function () {
    var isConnected = await this.isMetaMaskConnected();
    if (isConnected === true) {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      var account = accounts[0];
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        account = accounts[0];
      });

      return account;
    }

    return null;
  },

  getTransactionDetail: async function (txnHash) {
    return await this.getWeb3().eth.getTransaction(txnHash);
    //return await web3.eth.getTransactionReceipt(txnHash);
  },


  getToWei: function (amount) {
    return this.getWeb3().utils.toWei(amount, 'ether');
  },

  getToEth: function (balance) {
    return this.getWeb3().utils.fromWei(balance, "ether");
  },

  getChainId: async function () {
    return await this.getWeb3().eth.getChainId();
  },

  getDefaultCoin: async function () {
    var changeId = await this.getChainId();
    switch (changeId) {
      case 1: //mainnet
      case 3: //ropsten test 
      case 4: //rinkeby test 
      case 5: //goerli test
        return "ETH";
      case 56: // Smart Chain
      case 97: // Smart Chain - Testnet
        return "BNB";
    }
  },

  //#region Connect MetaMask
  checkMM: function () {
    if (typeof window.ethereum !== 'undefined') {
      return true;
    } else {
      return false;
    }
  },

  loginMetaMask: async function () {
    if (this.checkMM()) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts;
    } else {
      return null;
    }
  },

  connectMetamask: async function () {
    if (this.checkMM()) {
      try {
        var accounts = await this.loginMetaMask();
        if (accounts)
          return true;
      } catch (err) {
        alert("MetaMask already pending. Please check Metamask.");
      }
    } else {
      alert("Please Install MetaMask!");
    }
    return false;
  },
  isMetaMaskConnected: async function () {
    if (this.checkMM()) {
      var accounts = await this.getWeb3().eth.getAccounts();
      if (accounts.length > 0)
        return true;
    }

    return false;
  },
  //#endregion end Connect MeTaMask

  //#region verify
  signMM: async function () {
    var isConnected = await this.isMetaMaskConnected();
    if (isConnected === true) {
      var passwordString = "TAM PASSWORD";
      var currentAccount = await this.GetCurrentMM_Address();
      var hash = await this.getWeb3().eth.personal.sign(passwordString, currentAccount);
      return hash;
    } else {
      alert("Please Connect MetaMask!")
    }
  },
  //#endregion END verify

  getBlockNumber: async function(){
    const web3 = new Web3(window.ethereum);
    const lastnum = await web3.eth.getBlockNumber();

    return lastnum;
  },

  get_vote_log: async function (item_ids) {

    //https://github.com/bnb-chain/bsc/issues/113
    const chunkLimit = 2000;
    const fromBlockNumber = 22739312;
    const toBlockNumber = await this.getBlockNumber();
    const totalBlocks = toBlockNumber - fromBlockNumber
    const chunks = []

    if (chunkLimit > 0 && totalBlocks > chunkLimit) {
        const count = Math.ceil(totalBlocks / chunkLimit)
        let startingBlock = fromBlockNumber

        for (let index = 0; index < count; index++) {
            const fromRangeBlock = startingBlock;
            const toRangeBlock =
                index === count - 1 ? toBlockNumber : startingBlock + chunkLimit;
            startingBlock = toRangeBlock + 1;

            chunks.push({ fromBlock: fromRangeBlock, toBlock: toRangeBlock })
        }
    } else {
        chunks.push({ fromBlock: fromBlockNumber, toBlock: toBlockNumber })
    }

    const votes = [];
    for (const chunk of chunks) {
      //console.log(`from: ${chunk.fromBlock}  -- to: ${chunk.toBlock}`);
      //await this.getContractMM().events.vote_log(
        await this.getContractMM().getPastEvents('vote_log', {
          filter: { item_id: item_ids },
          fromBlock: chunk.fromBlock,
          toBlock: chunk.toBlock
          // fromBlock: `${22743743}`, //"22743743"//"22739584"//,//"20903300"
          // toBlock: `${toBlockNum}`
          //toBlock: "latest"
        }, 
        async (error, chunkEvents) => {

          //console.log(error);
          if (chunkEvents?.length > 0) {
            chunkEvents.forEach(element => {
              //console.log(element.returnValues);
              votes.push(
                {
                  item_id: element.returnValues.item_id,
                  vote_by: element.returnValues.sender
                }
              )
            });
          }
        });
    }

    return votes;

  },

}