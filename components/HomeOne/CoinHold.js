import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { constant_value } from '../constant';

import { metamask } from "../Metamask/Metamask";
import { errorMsg } from '../errorMessage';

//pt70 padding top
const CoinHold = ({ pt70 }) => {
  const [items, setItems] = useState([]);

  const list = [];
  useEffect(() => {
    const getItems = async () => {

      list.push({ id: 1, name: 'CHESS', bought_price: 0.284, cr_price: 0, qty: 262.7, symbol: 'CHESSUSDT' });
      list.push({ id: 2, name: 'FLM', bought_price: 0.1211, cr_price: 0, qty: 83, symbol: 'FLMUSDT' });
      list.push({ id: 3, name: 'FLM', bought_price: 0.106, cr_price: 0, qty: 99, symbol: 'FLMUSDT' });
      list.push({ id: 4, name: 'BTC', bought_price: 19525, cr_price: 0, qty: 0.02559, symbol: 'BTCUSDT' });
      list.push({ id: 4, name: 'BTC', bought_price: 19170, cr_price: 0, qty: 0.00065, symbol: 'BTCUSDT' });
      list.push({ id: 5, name: 'CELO', bought_price: 0.78, cr_price: 0, qty: 47.2, symbol: 'CELOUSDT' });
      list.push({ id: 6, name: 'ETH', bought_price: 1295, cr_price: 0, qty: 0.04302, symbol: 'ETHUSDT' });
      list.push({ id: 7, name: 'CRV', bought_price: 0.831, cr_price: 0, qty: 19.3, symbol: 'CRVUSDT' });

      //list.push({ id: 6, name: 'WLKN', bought_price: 0.04607, cr_price: 0, symbol: 'WLKNUSDT' });

      for(var i = 0; i< list.length ; i ++){
        const element = list[i];
        var price = await axios.get(`https://api.binance.com/api/v3/avgPrice?symbol=${element.symbol}`);
        element.cr_price = parseFloat(price.data.price);

        element.roe = 100 * (element.cr_price - element.bought_price) / element.bought_price;
        element.roe_price = (element.cr_price - element.bought_price)* element.qty;
      }

      setItems(list.sort((a,b) => a.roe - b.roe));
    };

    getItems();

  }, []);
  
  return (
    <>
      <table className='table'>
        <thead>
          <tr id="first">
            <td scope='col' className='text-align-right'>Symbol</td>
            <td scope='col' className='text-align-right'>Bought Price($)</td>
            <td scope='col' className='text-align-right'>Cr Price($)</td>
            <td scope='col' className='text-align-right'>ROE(%)</td>
            <td scope='col' className='text-align-right'>ROE($)</td>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) =>
            <tr key={index}>
              <td className='text-align-right'>{item.name}</td>
              <td className='text-align-right'>{item.bought_price.toFixed(3)}</td>
              <td className='text-align-right'>{item.cr_price.toFixed(3)}</td>
              {
                item.roe > 0 
                ? <td className='text-align-right up'>{item.roe.toFixed(3)}</td>
                : <td className='text-align-right down'>{item.roe.toFixed(3)}</td>
              }
              {
                item.roe_price > 0 
                ? <td className='text-align-right up'>{item.roe_price.toFixed(3)}</td>
                : <td className='text-align-right down'>{item.roe_price.toFixed(3)}</td>
              }
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CoinHold;
