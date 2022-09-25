import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { constant_value } from '../constant';

import { metamask } from "../Metamask/Metamask";
import { errorMsg } from '../errorMessage';

//pt70 padding top
const Vote = ({ pt70 }) => {
  const [items, setItems] = useState([]);
  const [login_mm_address, setlogin_mm_address] = useState('');
  const [isVoteClickStart, setIsVoteClickStart] = useState(false);
  const [voted_data, setVoted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getItems = async () => {
      try {
        // get list items
        const { data } = await axios.post(
          constant_value.API_URL.get_item
        );

        // get vote log from blockchain
        const item_ids = [];
        data.items.forEach(element => {
          item_ids.push(element.id);
        });

        var voteds = await metamask.get_vote_log(item_ids);
        setVoted(voteds);

        setItems(data.items);

        var senderAddress = await metamask.getCurrentMM_Address();
        setlogin_mm_address(senderAddress);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        
        setIsLoading(false);
      }
    };

    getItems();

  }, []);

  const is_voted = (item_id) => {

    var index = voted_data.findIndex(
      e => e.item_id === `${item_id}` 
        && (e.vote_by+"").toLowerCase()  === (login_mm_address + "").toLowerCase());

    if (index !== -1) {
      return true
    } else {
      return false;
    }
  }

  const count_vote = (item_id) => {
    //console.log(voted_data);
    var count = 0;
    voted_data.forEach(element => {
      //console.log(element.item_id + " - " + item_id);
      if (`${element.item_id}` === `${item_id}`) {
        count++;
      }
    });

    return count;
  }

  // vote button click
  const vote_click = async (e, item_id) => {

    setIsVoteClickStart(true);
    e.preventDefault();

    //check metamask is login or not?
    var isMMCn = await metamask.isMetaMaskConnected();
    if (!isMMCn) {
      window.ShowDialogErrorMsg(errorMsg.ERR_004);
    } else {
      try {

        // call smart contract
        //var senderAddress = await metamask.getCurrentMM_Address();
        await metamask.getContractMM().methods.vote_item(
          item_id
        ).send(
          {
            from: login_mm_address,
            //value: weiAmount
          }
        );

        // // update db
        // var update_rs = await axios.post(
        //   constant_value.API_URL.update_voted,
        //   {
        //     item_id: item_id
        //   }
        // );

        // console.log(update_rs);

        //alert("Buy successfully!")
        window.ShowDialogInfoMsg(errorMsg.INFO_001);

        // call update balance on Navbar
        window.showBalanceCoin();

        location.reload();
      }
      catch (err) {
        if (err.message !== errorMsg.ERR_007) {
          window.ShowDialogErrorMsg(err.message);
        }
      }
    }


    setIsVoteClickStart(false);
  };

  return (
    <>
    {/* ${pt70} */}
      <div className={`buy-sell-cryptocurrency-area bg-image `}> 
        <div className='container'>

          {
            isLoading ? (<div className='row justify-content-center'>
              <img src="/images/loading.gif" className="home_loading_img" alt="loading..." />
            </div>) : ""
          }

          {/* <div className='section-title'>
            <h2>Votes</h2>
          </div> */}
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='buy-sell-cryptocurrency-content'>
                <div className='row justify-content-center'>

                  {items.map(item =>
                    <div key={item.id} className='col-lg-6 col-sm-6 col-md-6'>
                      <div className='single-buy-sell-box'>
                        {/* <div className='icon'>
                              <img src='/images/icon/icon12.png' alt='image' />
                          </div> */}
                          <p>id:{item.id}</p>
                        <h3>{item.title}</h3>
                        <p className='css-fix'>
                          {item.decription}
                        </p>

                        {
                          is_voted(item.id) ? (<p><strong>You Voted!</strong></p>)
                            :
                            (

                              <div className="vote-box">
                                {
                                  isVoteClickStart ?
                                    (
                                      <a target='_blank' className="vote-btn" onClick={(e) => (e)} >
                                        <img src="/images/loading.gif" className="loading_img" alt="loading..." />
                                      </a>
                                    )
                                    :
                                    (
                                      <a target="_blank" className="vote-btn" onClick={(e) => vote_click(e, item.id)}>Vote</a>
                                    )
                                }
                              </div>
                            )
                        }

                        <hr />
                        <p><strong className='voted-color'>Voted: {count_vote(item.id)}</strong></p>
                      </div>

                    </div>
                  )}

                </div>
                <hr></hr>

                <div className='row justify-content-center'>
                  {items.map((item, index) =>
                    <div key={"div" + index} className='col-lg-6 col-sm-6 col-md-6'>
                      <p key={index}>■{item.title}</p>
                      {
                        voted_data.map((voted, index) => {

                          if (`${voted.item_id}` === `${item.id}`) {
                            return <p key={index}>→　{voted.vote_by}</p>
                          }
                        }
                        )
                      }
                      <br></br>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
 
    </>
  );
};

export default Vote;
