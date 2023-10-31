import "./App.css";
import { useState, useEffect } from "react";
import { config, passport } from "@imtbl/sdk";
import { ethers } from "ethers";


function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [passportProviders, setPassportProviders] = useState("");
  const [balance, setBalance] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [displayTransaction, setDisplayTransaction] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [idToken, setIdToken] = useState("");
  const params = new URLSearchParams(document.location.search);

  // Part 1 create Passport Instance
  

  const connect = async () => {
    try {
      if (!isLogin) {
        // Part 2 Authenticate user and login and set variables
        
      } else { 
        // Part 4 Log the user out
        
      } 
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setIsLogin(false);
    }
  };

  // Part 5 create Send Transaction function and get Transaction Hash
  const sendTransaction = async () => {
    
  };


  // Part 6 displaying Transaction Hash
  

  useEffect(() => {
    // Part 3 configure the login callback
    
  }, [defaultAccount]);

  return (
    <>
      <nav>
        <ul className="nav backdrop-blur-sm bg-sky-500/60">
          <div className="acc-container">
            <div className="connect-btn">
              <button onClick={connect} disabled={isLoading} className="primary-btn">
                {isLogin
                  ? "Logout"
                  : "Connect Passport"}
              </button>
            </div>
          </div>
        </ul>
      </nav>

      {!isLogin ? <div className="text-5xl font-bold center">Connect Your Wallet First</div> : 
      <div className="flex flex-col p-6">
        <div className="backdrop-blur-sm bg-yellow-200/60 my-4 p-6 rounded-xl justify-center">
          <div className="text-center text-5xl font-extrabold mb-5">My Passport Profile</div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="font-medium">Wallet Address:</div>
              <div className="text-center font-medium">{defaultAccount}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-medium">User Email:</div>
              <div className="text-center font-medium">{profile.email}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-medium">Balance:</div>
              <div className="text-center font-medium">{balance}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="font-medium">User Nickname:</div>
              <div className="text-center font-medium">{profile.nickname}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-center font-bold text-xl mt-5">Access Token:</div>
              <p className="text-center overflow-clip">{atob(accessToken.replace(/[^a-zA-Z0-9]+/g, ""))}</p>
            </div>
            <div className="flex flex-col">
              <div className="text-center font-bold text-xl mt-5">Id Token:</div>
              <p className="text-center overflow-clip">{atob(idToken.replace(/[^a-zA-Z0-9]+/g, ""))}</p>
            </div>
          </div>
          </div>
          <div className="place-self-center"><button className="primary-btn" onClick={sendTransaction} disabled={isLoading}>Click To Send IMX</button></div>
          <div className="flex flex-col">
            <div className="backdrop-blur-sm bg-yellow-200/60 my-6 p-6 rounded-xl justify-center">
              <div className="text-center font-bold text-xl mb-2">Transaction Hash:</div>
              <div className="text-center font-medium mb-5">{transactionHash}</div>
              <div className="text-center overflow-clip">{JSON.stringify(displayTransaction, undefined, 4)}</div>
            </div>
          </div>
      </div> }

    </>
  );
}

export default App;
