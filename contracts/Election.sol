// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

contract Election{
    
    struct Candidate{
        uint id;
        string name;
        uint votecount;
    }

    //candidate count
    uint public candidatesCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public votedornot;

    event electionupdated(
        uint id,
        string name,
        uint votecount
    );

    constructor(){
        addCandidate("donald trumph");
        addCandidate("barack obama");
    }

    function addCandidate(string memory name) private{
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,name,0);
    }

    function Vote(uint _id) public{
        //the person has not vote again
        require(!votedornot[msg.sender], 'you have voted for the participant');
        //the id that the person has input is available
        require(candidates[_id].id !=0 , 'the id doesent exist');
        //increase the vote count of the person whom the candidates[_id].votecount += 1
        candidates[_id].votecount +=1;
        //bool true
        votedornot[msg.sender] = false;

        emit electionupdated(_id,candidates[_id].name,candidates[_id].votecount);
    }


}