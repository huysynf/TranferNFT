import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import React, {useEffect, useState} from 'react';
import KryptoBird from './abis/KryptoBird.json';

function App() {
    const [web3Api, setWeb3Api] = useState({});
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState();
    const [contractAddress, setContractAddress] = useState('0xbDA937431b65C69CAc4FAa67E6Db693144E8C83B');
    const [contractName, setContractName] = useState('');
    const [contractAddressAdd, setContractAddressAdd] = useState('');
    const [netWork, setNetWork] = useState({});

    useEffect(() => {
        async function loadWeb3() {
            const provider = await detectEthereumProvider();
            if (provider) {
                provider.request({method: "eth_requestAccounts"});
                const web3Obj = new Web3(provider);
                setWeb3Api({
                    web3: web3Obj,
                    provider: provider
                })
                const accounts = await web3Obj.eth.getAccounts()
                const netWorkType = await web3Obj.eth.net.getNetworkType();
                const networkId = await web3Obj.eth.net.getId()
                console.log('ethereum wallet is connected', networkId)
                provider.on('accountsChanged', function (accounts) {
                    setAccount(accounts[0]);
                    console.log(`Selected account changed to ${accounts[0]}`);
                });

                let abi = getAbi(contractAddress);
              let myContract = new web3Obj.eth.Contract(abi, contractAddress, {
                    from: accounts[0], // default from address
                });
                setContract(myContract)
                let contractName = await myContract.methods.name().call();
                setContractName(contractName)
                setNetWork({
                    type: netWorkType === 'private' ? 'Local' : netWorkType,
                    id: networkId
                })
                setAccount(accounts[0])


            } else {
                console.log('no ethereum wallet detected')
            }
        }

        loadWeb3()
    }, []);

    function isAddressWallet(code) {
      return code === '0x';
    }

    const addSmartContract =  async (address) => {
        const code = await web3Api.web3.eth.getCode(address)
        if (isAddressWallet(code)) {
            console.log('it not is a contract')
        } else {
            setContractAddressAdd(address)
        }
    }

    function getAbi (address)
    {
        let APIKey = 'VR1MV3H2E35QIGSGZU2VFXJWZAQG39HEK4';
        let urlAbi;
        let abi = ""
        if (netWork.type !=="Local")
        {
            let urlAbi = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${APIKey}`
        }
        abi = KryptoBird.abi;
        return abi;
    }

    async function send (address)
    {
       if (contract)
       {
           console.log(contract)
           await contract.methods.transferFrom(account, '0x46a211513D2270e62536c88A77A18fdFdE020fDf', 0).call()
       }
    }


    async function loadBlockchainData() {
        // create a constant js variable networkId which
        //is set to blockchain network id
        const networkId = await web3Api.web3.eth.net.getId()
        // const networkData = KryptoBird.networks[networkId]
        // if(networkData) {
        // EXERCISE TIME!!!! :)
        // 1. create a var abi set to the Kryptobird abi
        // 2. create a var address set to networkData address
        // 3. create a var contract which grabs a
        //new instance of web3 eth Contract
        // 4. log in the console the var contract successfully - GOOD LUCK!!!!

        // const abi = KryptoBird.abi;
        // const address = network.address;
        // const contract = new web3Api.web3.eth.Contract(abi, address)
        // this.setState({contract})

        // call the total supply of our Krypto Birdz
        // grab the total supply on the front end and log the results
        // go to web3 doc and read up on methods and call
        // const totalSupply = await contract.methods.totalSupply().call()
        // this.setState({totalSupply})
        // set up an array to keep track of tokens
        // load KryptoBirdz
        // for(let i = 1; i <= totalSupply; i++) {
        //   const KryptoBird = await contract.methods.kryptoBirdz(i - 1).call()
        //   // how should we handle the state on the front end?
        //   this.setState({
        //     kryptoBirdz:[...this.state.kryptoBirdz, KryptoBird]
        //   })
        // }
        // } else {
        //   window.alert('Smart contract not deployed')
        // }
    }


    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <p>{account} ---------------------- {netWork.type} </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h1> NFT tranfer</h1>
            <div className="d-flex justify-content-center">
                <div>
                    <h1>NFT ERC721</h1>
                    <p>NFT text include</p>
                    <p>NFT Smart contract address</p>
                    <textarea className={'form-control'}
                              value={contractAddressAdd}
                              cols="20" rows="5">
                        {contractAddressAdd}
                    </textarea>
                </div>
                <div>
                    <h1>Text will be included</h1>
                    <p>Receivers, NFT Ids</p>
                    <textarea
                        placeholder="0x5ee8c161aD276F7DcD98f07D393bdB96240319F4, 12"
                        cols="20"

                        rows="5"
                        className={'form-control'}
                    >

                    </textarea>
                </div>
            </div>
            <div className="form-group f-flex flex-column">
                <div className="col-8">
                    <input
                        value={contractAddress}
                        className="form-control"
                        onChange={e => setContractAddress(e.target.value)}
                        placeholder="0xF0459809D32D1CDB0e6279509Faef0dd69948fFa"
                    />
                </div>
                <div className="col-5">
                    <button className="btn btn-primary" onClick={() => {
                        addSmartContract(contractAddress)
                    }}> Add
                    </button>
                    <button className="btn btn-primary" nClick={() => {
                        setContractAddressAdd("")
                    }}> Remove</button>

                    <button className="btn btn-primary" onClick={() => {
                        send()
                    }}> Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
