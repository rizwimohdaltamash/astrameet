import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import bgImg from '../assets/1bg.png'
import LogoImg from '../assets/logo.png'


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);

  const firebase = useFirebase();
  const navigate = useNavigate();

  // const handleSubmit =async(e)=>{
  //       e.preventDefault();
  //       console.log('SignUp up a user...');
  //      const result = await firebase.signupUserWithEmailAndPassword(
  //       email,
  //       password
  //   );
  //       console.log('Succesful',result);
  // }

  useEffect(()=>{
    if(firebase.isLoggedIn){
      //navigate to lobby
      navigate('/lobby');
    }
  },[firebase.isLoggedIn,navigate]);

  console.log(firebase);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signing up a user...");
    try {
      const result = await firebase.signupUserWithEmailAndPassword(
        email,
        password
      );
      console.log("Successful", result);

      // Save user details in Firestore
      await firebase.saveUserDetails({
        displayName: name,
        email: result.user.email,
        uid: result.user.uid,
        timestamp: new Date(),
      });

      setIsSignupSuccessful(true);
      navigate("/lobby");
    } catch (error) {
      console.error("Signup failed", error);
      setIsSignupSuccessful(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen"
    style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
     
       {/* 1nd box */}
     <div className='w-1/2 flex flex-col justify-center items-center'>        
     <div className="bg-[rgba(17,137,130,0.4)] p-10 rounded-3xl shadow-lg w-full max-w-md border border-white">
        <h2 className="text-4xl font-bold mb-10 text-center text-white font-museo">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-6">
            
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Type your name"
              className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white"
              required
            />
          </div>
          {/* Email */}
          <div className="mb-6">
            
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Type your email"
              className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white "
              required
            />
          </div>
          <div className="mb-6 relative">
            
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white "
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#0A4A3A] hover:bg-[rgba(10,74,58,0.9)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline w-full mt-12"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
      </div>

       {/* 2nd box */}       
     <div className='w-1/2 flex flex-col justify-center items-center'>               
        <img src={ LogoImg} className="w-2/4 h-auto" alt=''/>
      </div>



    </div>
  );
};

export default RegisterPage;
