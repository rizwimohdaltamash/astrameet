import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";

import { IoIosCall, IoMdMic, IoMdMicOff } from "react-icons/io";
import { CiVideoOn, CiVideoOff } from "react-icons/ci";
import { TbMessageOff } from "react-icons/tb";
import { MdMessage } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import ChatBox from "./Chat"; // Import the ChatBox component
import SharePopup from "./SharePopup";
import DisconnectPopup from "./DisconnectPopup"; // Import the DisconnectPopup component
import { CiShare2 } from "react-icons/ci";

const RoomPage = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation(); // Get location
  const userName = location.state?.name || ""; // Extract user name from state
  const password = location.state?.password || ""; // Fetch the password

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMicOn, setIsMicOn] = useState(true); // State for microphone
  const [isVideoOn, setIsVideoOn] = useState(true); // State for video
  const [isChatOpen, setIsChatOpen] = useState(false); // State to toggle chat box
  const [showPopup, setShowPopup] = useState(false);
  const [showAcceptRejectPopup, setShowAcceptRejectPopup] = useState(false);
  const [showStartVideoPopup, setShowStartVideoPopup] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState(""); // New state for remote user name
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false); // State for disconnect popup
  const [rejectionMessage, setRejectionMessage] = useState(""); // State for rejection message
  const [isVideoStarted, setIsVideoStarted] = useState(false); // State to track if the video has started


  const handleUserJoined = useCallback(({ name, id }) => {
    console.log(`Name : ${name} joined room`);
    setRemoteSocketId(id);
    setRemoteUserName(name); // Set the remote user name
    setShowAcceptRejectPopup(true); // Show the popup when a user joins
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer, name: userName });// Include your name in the call
    setMyStream(stream);
    setShowAcceptRejectPopup(false); // Hide the popup when the call is accepted
  }, [remoteSocketId, socket,userName]);

  const handleIncommingCall = useCallback(
    async ({ from, offer, name }) => {
      setRemoteSocketId(from);
      setRemoteUserName(name); // Set the remote user name
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans, name: userName }); // Send your name when accepting
      
    },
    [socket, userName]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
    setShowStartVideoPopup(true);
    setIsVideoStarted(true); // Set video started to true when sending streams
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans, name }) => {
      // Updated to include name
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      setRemoteUserName(name); // Set the remote user name
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    socket.on("call:rejected", ({ name }) => {
      setRejectionMessage(`Your call has been rejected by Admin`);
    });

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:rejected");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const handleDisconnect = useCallback(() => {
    setShowDisconnectPopup(true);
  }, []);

  const confirmDisconnect = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    peer.peer.close();
    setRemoteSocketId(null); // Reset remoteSocketId
    setRemoteUserName(""); // Reset remoteUserName
    navigate("/lobby");
  }, [myStream, navigate]);

  const cancelDisconnect = useCallback(() => {
    setShowDisconnectPopup(false);
  }, []);

  const toggleMic = useCallback(() => {
    if (!myStream) return;
    const audioTrack = myStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(audioTrack.enabled);
  }, [myStream]);

  // const toggleVideo = useCallback(() => {
  //   if (!remoteStream) return;
  //   const videoTrack = remoteStream.getVideoTracks()[0];
  //   videoTrack.enabled = !videoTrack.enabled;
  //   setIsVideoOn(videoTrack.enabled);
  // }, [remoteStream]);
////
  const toggleVideo = useCallback(() => {
    if (!remoteStream) return;
    const videoTrack = remoteStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
    socket.emit("video:toggle", { to: remoteSocketId, enabled: videoTrack.enabled });
  }, [remoteStream, remoteSocketId, socket]);

  useEffect(() => {
    const handleRemoteVideoToggle = ({ enabled }) => {
      if (!myStream) return;
      const videoTrack = myStream.getVideoTracks()[0];
      videoTrack.enabled = enabled;
      setIsVideoOn(enabled);
    };
  
    socket.on("video:toggle", handleRemoteVideoToggle);
  
    return () => {
      socket.off("video:toggle", handleRemoteVideoToggle);
    };
  }, [myStream, socket]);
///
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat visibility
  };

  const handleRejectCall = () => {
    setShowAcceptRejectPopup(false); // Hide the popup when the call is rejected
    socket.emit("call:rejected", { to: remoteSocketId, name: userName }); // Emit call rejected event
    setRemoteSocketId(null); // Reset remoteSocketId
    setRemoteUserName(""); // Reset remoteUserName
    navigate(`/room/${password}`);
  };

  return (
    <div className="h-screen w-full bg-gray-800 relative">
      {/* Connected / No one in the room */}
      <h4 className="text-white absolute top-0 left-0 ml-4 mt-2">
        {remoteSocketId ? "" : "No one in room"}
      </h4>

      {/* Share Popup */}

      {!myStream && (
        <div className="absolute top-7 left-4 mr-4 mt-4 cursor-pointer z-[1]">
          <h1 className="text-white">Share your Password</h1>
          <button
            onClick={() => setShowPopup(true)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <CiShare2 size={20} round={true} />
          </button>
          {showPopup && (
            <SharePopup
            // using this link: http://localhost:3000
              url={`Join my room with this password: ${password} `}
              password={password}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>
      )}

      {/* Send Stream Button */}
      {remoteStream && !showStartVideoPopup &&(
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg text-center z-50">
        <h2>Are you sure you want to start the video?</h2>
        <div>
          <button
            onClick={sendStreams}
            className="m-2 px-4 py-2 bg-green-700 text-white rounded cursor-pointer"
          >
            Start Video
          </button>
          <button
            onClick={confirmDisconnect}
            className="m-2 px-4 py-2 bg-red-700 text-white rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
      )}

      {/*Call Popup */}
      {remoteSocketId && !myStream && showAcceptRejectPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg text-center z-50">
          <h2>Incoming Call from {remoteUserName}</h2>
          <div>
            <button
              onClick={handleCallUser}
              className="m-2 px-4 py-2 bg-green-700 text-white rounded cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={handleRejectCall}
              className="m-2 px-4 py-2 bg-red-700 text-white rounded cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      )}

 
{/* Rejection Popup */}
{rejectionMessage && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg text-center z-50">
    <button
      onClick={() => setRejectionMessage("")}
      className="absolute top-0 right-0 bg-black w-[7%] rounded mt-2 mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
    >    
      X
    </button>
    <p className="mt-2 text-lg text-gray-800">{rejectionMessage}</p>
  </div>
)}



      {/* 4 Buttons */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-2 w-full flex justify-center z-10">
        {myStream && (
          <>
            {/* Mike On Off */}
            <button
              onClick={toggleMic}
              className={`flex items-center justify-center rounded-full border border-black text-white ${
                isMicOn ? "bg-gray-500" : "bg-gray-500"
              } h-12 w-12 mr-5 cursor-pointer`}
            >
              {isMicOn ? <IoMdMic /> : <IoMdMicOff />}
            </button>
            {/* Disconnect */}

            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center rounded-full border border-black text-white bg-red-500 h-12 w-12 cursor-pointer"
            >
              <IoIosCall />
            </button>

            {/* Video On Off */}
            <button
              onClick={toggleVideo}
              className={`flex items-center justify-center rounded-full border border-black text-white ${
                isVideoOn ? "bg-gray-500" : "bg-gray-500"
              } h-12 w-12 ml-5 cursor-pointer`}
            >
              {isVideoOn ? <CiVideoOn /> : <CiVideoOff />}
            </button>
            {/* Messaging */}
            <button
              onClick={toggleChat}
              className={`flex items-center justify-center rounded-full border border-black text-white  ${
                isChatOpen ? "bg-gray-500" : "bg-gray-500"
              } h-12 w-12 ml-5 cursor-pointer`}
            >
              {isChatOpen ? <MdMessage /> : <TbMessageOff />}
            </button>
          </>
        )}
      </div>

      <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
        {/* My Video Stream */}
        {/* myStream */}
        {  myStream && (
          <>
            <ReactPlayer playing
             height="100%" 
             width="100%" 
             url={myStream} 
             />

            <div className="absolute bottom-[2%] left-[19%] text-white bg-black bg-opacity-50 p-2 rounded">
           
            {remoteUserName}
            </div>
          </>
        )}
      </div>

      <div className="absolute top-[-5%] right-[12%] z-2">
        {/* Remote Stream */}
        {remoteStream && (
          <div className="relative">
            <ReactPlayer
              playing
              width="80%"
              url={remoteStream}
              className="w-full lg:w-4/5"
            />


            <div style={{ display: isVideoStarted ? "block" : "none" }} className="absolute top-[78%] left-[2%] text-white bg-black bg-opacity-50 p-1.5 rounded">
            {userName}
            </div>
          </div>
        )}
      </div>

      {/* Chat Box */}
      <div style={{ display: isChatOpen ? "block" : "none" }}>
        <ChatBox
          userName={userName}
          socket={socket}
          remoteSocketId={remoteSocketId}
          onClose={toggleChat}
        />
      </div>

      {/* Disconnect Popup */}
      {showDisconnectPopup && (
        <DisconnectPopup
          onConfirm={confirmDisconnect}
          onCancel={cancelDisconnect}
        />
      )}
    </div>
  );
};

export default RoomPage;