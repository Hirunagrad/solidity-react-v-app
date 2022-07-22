import React, { useEffect, useState } from "react";
import "./App.css";
import Electionabi from "./contracts/Election.json";
import Web3 from "web3";
import Button from "@mui/material/Button";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";


function App() {
  const [currentaccount, setCurrentaccount] = useState("");
  const [id, setId] = useState([]);
  const [candidate1, setCandidate1] = useState([]);
  const [candidate2, setCandidate2] = useState([]);
  const [election,setElection] = useState([])

  useEffect(() => {
    //  loadWeb3();
    loadBlockchaindata();
  }, [candidate1,candidate2,currentaccount]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      // window.web3 = new web3(window.ethereum);
      // await window.ethereum.enable()
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //setAccounts(accounts);;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "None Ethereum browser detected. You should consider tring Metamask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    //const web3 = window.web3;
    //const Web3 = require("web3");
    const web3 = new Web3(window.ethereum);
    // get all accounts
    const accounts = await web3.eth.getAccounts();

    // const accounts = web3.eth.accounts;
    const account = accounts[0];
    setCurrentaccount(account);

    const networkId = await web3.eth.net.getId();
    console.log("id", networkId);

    const networkData = Electionabi.networks[networkId];
    console.log(networkData);
    //setId(networkData);

    if (networkData) {
      const election = new web3.eth.Contract(
        Electionabi.abi,
        networkData.address
      );
      console.log(election);
      setElection(election);
      const candidate1 = await election.methods.candidates(1).call();
      const candidate1id = candidate1.id;
      const candidate1name = candidate1.name;
      const candidate1vote = candidate1.votecount;
      setCandidate1(candidate1);
      console.log("candidate1", candidate1);
      const candidate2 = await election.methods.candidates(2).call();
      const candidate2id = candidate2.id;
      const candidate2name = candidate2.name;
       const candidate2vote = candidate2.votecount;
      setCandidate2(candidate2);

      console.log("candidate2", candidate2);
    } else {
      window.alert("the smart contract is not deployed current network");
    }
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const onSubmit = async () => {
     
    

    await election.methods.Vote(age).send({ from: currentaccount }).on('transactionhash', () => {
      console.log("succesfull !")
    });
  }

  return (
    <div className="App">
      <div>
        <Typography variant="h3" mt={5}>
          Block Chain Voting App
        </Typography>
        <hr />
        <p>Acount : {currentaccount}</p>

        <Grid container mt={10}>
          <Grid item lg={12} px={20}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Calories</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Votes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">candidate 1</TableCell>
                    <TableCell align="left">{candidate1.name}</TableCell>
                    <TableCell align="left">{candidate1.votecount}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">candidate 2</TableCell>
                    <TableCell align="left">{candidate2.name}</TableCell>
                    <TableCell align="left">{candidate2.votecount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid mt={10}>Cast Your Vote : {age}</Grid>
            <Grid mt={5}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={1}>{candidate1.name}</MenuItem>
                  <MenuItem value={2}>{candidate2.name}</MenuItem>
                </Select>
              </FormControl>
              <Grid mt={3}>
                <Button variant="contained" onClick={onSubmit}>
                  Vote Candidate
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
