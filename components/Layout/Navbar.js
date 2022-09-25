import React, { useState, useEffect } from 'react';
import Link from '../../utils/ActiveLink';
import {metamask} from '../Metamask/Metamask';

const Navbar = () => {
  const [showMenu, setshowMenu] = useState(false);
  const [showInstallMetaMask, setInstallMetaMask] = useState(false);
  const [showBalance, setshowBalance] = useState(false);
  const [balanceCoin, setBalanceCoin] = useState(false);
  const [symbol, setSymbol]= useState('');

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  useEffect(() => {
   
    // check to show Install MetaMask or Connect MetaMask Button
    setInstallMetaMask(metamask.checkMM());

    async function addEthereumChain() {
      var isConnected = await metamask.isMetaMaskConnected();
      if (metamask.checkMM() && isConnected == false) {
        await metamask.wallet_addEthereumChain();
      }
    }
    addEthereumChain();
    
    // check to show Balance of Coin
    async function showBalanceCoin() {
      setshowBalance(await metamask.isMetaMaskConnected());
      setBalanceCoin(await metamask.getBalance());
      setSymbol(await metamask.getDefaultCoin());
    }
    showBalanceCoin();

    // share this method to another component can call it.
    //Ex: ([buy now] button will call this method)
    window.showBalanceCoin = showBalanceCoin.bind(window);

    // when changed MetaMask Address
    if (metamask.checkMM()) {
      window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload(false);
      });
    }

    let elementId = document.getElementById('navbar');
    document.addEventListener('scroll', () => {
      if (window.scrollY > 170) {
        elementId.classList.add('is-sticky');
      } else {
        elementId.classList.remove('is-sticky');
      }
    });
    window.scrollTo(0, 0);
  }, []);

  //Connect MetaMask / Install MetaMask Button clicked
  const connectMetamask = async (e) => {
    e.preventDefault();
    if(showInstallMetaMask != true){
      window.open('https://metamask.io/', '_blank');
    }else{
      var isConnected = await metamask.isMetaMaskConnected();
      if (metamask.checkMM() && isConnected == false) {
        await metamask.wallet_addEthereumChain();
      } else {
        var cnMM = await metamask.connectMetamask();
        if (cnMM === true) {
          setshowBalance(true);
        }
      }
    }
  }
 
  return (
    <>
      <div id='navbar' className='navbar-area'>
        <div className='raimo-responsive-nav'>
          <div className='container'>
            <div className='raimo-responsive-menu'>
              <div onClick={() => toggleMenu()} className='hamburger-menu'>
                {showMenu ? (
                  <i className='bx bx-x'></i>
                ) : (
                  <i className='bx bx-menu'></i>
                )}
              </div>
              <div className='logo'>
                <Link href='/'>
                  <a>
                    <img src='/images/logo.png' alt='logo' />
                  </a>
                </Link>
              </div>

              <div className='responsive-others-option'>
                <div className='d-flex align-items-center'>
                  <div className='option-item'>
                    {/* <Link href='/' activeClassName='active'>
                      <a className='login-btn'>
                        <i className='bx bx-log-in'></i> Connect Metamask
                      </a>
                    </Link> */}
                    <Link href='/' activeClassName='active'>
                      <a className='login-btn mobile-connect-metamask'onClick={(e) => connectMetamask(e)}>
                        {showBalance ? (<span>Balance: {balanceCoin} {symbol}</span>) : (<i className='bx bx-log-in'>{showInstallMetaMask ? "MetaMask" : "Install MetaMask"}</i>)  }

                      </a>
                    </Link>
                  </div>

                  {/* <div className='option-item'>
                    <select className='form-select'>
                      <option value='0'>English</option>
                      <option value='1'>Türkçe</option>
                      <option value='2'>Español</option>
                      <option value='3'>한국어</option>
                      <option value='4'>Italiano</option>
                      <option value='5'>Polski</option>
                    </select>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav
          className={
            showMenu
              ? 'show navbar navbar-expand-md navbar-light'
              : 'navbar navbar-expand-md navbar-light hide-menu'
          }
        >
          <div className='container'>
            <Link href='/'>
              <a className='navbar-brand'>
                <img src='/images/logo.png' alt='logo' />
              </a>
            </Link>
            <div className='collapse navbar-collapse mean-menu'>
              <ul className='navbar-nav'>
                <li className='nav-item'>
                  <Link href='/' activeClassName='active'>
                    <a className='nav-link'>Home</a>
                  </Link>
                </li>
                {/* <li className='nav-item megamenu'>
                  <Link href='/buy' activeClassName='active'>
                    <a className='nav-link'>Buy</a>
                  </Link>
                </li>
                <li className='nav-item megamenu'>
                  <Link href='/sell' activeClassName='active'>
                    <a className='nav-link'>Sell</a>
                  </Link>
                </li>
                <li className='nav-item megamenu'>
                  <Link href='/prices' activeClassName='active'>
                    <a className='nav-link'>Info</a>
                  </Link>
                </li> */}
              </ul>
              <div className='others-option'>
                <div className='d-flex align-items-center'>
                  <div className='option-item'>
                    <Link href='/' activeClassName='active'>
                      <a className='login-btn'onClick={(e) => connectMetamask(e)}>
                        {showBalance ?  (<span>Balance: {balanceCoin} {symbol}</span>) :
                          <span><i className='bx bx-log-in'></i> {showInstallMetaMask ? "Connect Metamask" : "Install MetaMask"}  </span>
                        }
                      </a>
                    </Link>
                  </div>
                  {/* <div className='option-item'>
                    <Link href='/contact' activeClassName='active'>
                      <a className='default-btn'>
                      <i className='bx bxs-contact' ></i> Contact Us
                      </a>
                    </Link>
                  </div> */}
                  {/* <div className='option-item'>
                    <select className='form-select'>
                      <option value='0'>English</option>
                      <option value='1'>日本語</option>
                      <option value='2'>Việt Nam</option>
                    </select>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
