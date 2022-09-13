// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract vote {

   address public owner;

    // IERC20 coin 
    struct voteObject{
        uint item_id;
        address voted_by;
    }

    uint[] vote_item_array;
    mapping(uint => voteObject) public vote_array;
    
    event vote_log(address sender, uint indexed item_id);

    constructor(){
        owner = msg.sender;
    }

    // ================== vote ==========================
    function vote_item(uint item_id) public payable{
        vote_item_array.push(item_id);
        vote_array[vote_item_array.length - 1] = voteObject(item_id, msg.sender);

        emit vote_log(msg.sender, item_id);
    }

    function number_of_item() public view returns(uint){
        return vote_item_array.length;
    }

    function get_vote_info(uint order_vote) public view returns(uint, address){
        require(order_vote < vote_item_array.length, "index not correct");

        return (vote_array[order_vote].item_id, vote_array[order_vote].voted_by);
    }

    // ================== update owner ==========================

    // check master modidifier
    modifier checkMaster(){
        require(msg.sender == owner, "Sorry, you are not allowed");
        _;
    }

    // thay đổi master của sm 
    function changeOwner(address newOwner) public checkMaster {
        owner = newOwner;
    }

    // view owner
     function getOwner() external view returns (address) {
        return owner;
    }
}