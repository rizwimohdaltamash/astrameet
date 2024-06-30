import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { useFirebase } from "../context/Firebase"; //Newww
import { FaRegCopy } from "react-icons/fa";
import bgImg from '../assets/bg.png'

const LobbyScreen = () => {
  const [name, setName] = useState(""); // Add state for name
  const [room, setRoom] = useState("");
  const [length, setLength] = useState(15);
  const [password, setPassword] = useState("");
  // const [nameError, setNameError] = useState("");//
  // const [passwordError, setPasswordError] = useState("");//


  const { getDisplayName , logout} = useFirebase();

  // useRef hook
  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, setPassword]);

  const copyPasswordToClipboard = useCallback(
    (e) => {
      e.preventDefault(); // Prevent form submission
      passwordRef.current?.focus();
      passwordRef.current?.select();
      passwordRef.current?.setSelectionRange(0, 15);
      window.navigator.clipboard.writeText(password);
    },
    [password]
  );

  useEffect(() => {
    passwordGenerator();
  }, [length, passwordGenerator]);
  /////
  useEffect(() => {
    const displayName = getDisplayName();
    if (displayName) {
      setName(displayName);
    }
  }, [getDisplayName]);
  /////
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { name, room });
    },
    [name, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { name, room } = data;
      navigate(`/room/${room}`, { state: { name, password } });
    },
    [navigate, password]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };



  return (
    <div className="flex flex-col justify-center items-center h-screen"
    style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-[rgba(17,137,130,0.4)] p-10 rounded-3xl shadow-lg w-full max-w-md border border-white ">
      <h1 className="text-4xl font-bold mb-10 text-center text-white font-museo">Lobby</h1>
     
     <form onSubmit={handleSubmitForm} className="flex flex-col ">
       {/* <label htmlFor="name" className="mb-1">
         Join as
       </label> */}

       <input
         type="text"
         id="name"
         placeholder="Enter your Name"
         value={name}
         onChange={(e) => setName(e.target.value)}
         className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white mb-5"
         required
       />
     

       <label htmlFor="text" className="mb-1 text-white">
         Your room Password
       </label>

       <div className="flex items-center mb-3">
         <input
           type="text"
           value={password}
           placeholder="Password"
           readOnly
           ref={passwordRef}
           className="border border-gray-400 rounded-l px-2 py-1  w-full bg-gray-400"
         />
         <button
           onClick={copyPasswordToClipboard}
           className="bg-[#0A4A3A] hover:bg-[rgba(10,74,58,0.9)] border-[rgba(10,74,58,0.9)] text-gray-400 rounded-r px-2 py-2 "
         >
           <FaRegCopy />
         </button>
       </div>

       {/* <label htmlFor="room" className="mb-1">
         Password
       </label> */}

       <input
         type="text"
         id="room"
         placeholder="Enter Room/Guest Password"
         value={room}
         onChange={(e) => setRoom(e.target.value)}
         className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white mb-5 "
         required
       />
    
       <button  type="submit" className="bg-[#0A4A3A] hover:bg-[rgba(10,74,58,0.9)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline w-full mb-6">
         Join
       </button>
     </form>
     <button onClick={handleLogout} className="bg-[rgba(17,137,130,0.4)] hover:bg-[rgba(17,137,130,0.6)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline border border-white w-full flex flex-row items-center justify-center">
       Logout
     </button>
      </div>
      
    </div>
  );
};

export default LobbyScreen;


