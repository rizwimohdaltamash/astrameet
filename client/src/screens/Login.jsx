import React, { useState,useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import {useFirebase} from '../context/Firebase';
import { FaGoogle } from "react-icons/fa";
import bgImg from '../assets/1bg.png'
import LogoImg from '../assets/logo.png'


const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState(''); 
  // const [isSigninSuccessful, setIsSigninSuccessful] = useState(false); 


  const firebase = useFirebase();
  const navigate=useNavigate();

  console.log(firebase);

  useEffect(()=>{
      if(firebase.isLoggedIn){
        //navigate to lobby
        navigate('/lobby');
      }
  },[firebase.isLoggedIn,navigate]);

  // const handleSubmit =async(e)=>{
  //       e.preventDefault();
  //       console.log('Login up a user...');
  //      const result = await firebase.signinUserWithEmailandPass(
  //       email,
  //       password
  //   );
  //       console.log('Succesful',result);
  // }
  
  // useEffect(() => {
  //   if (firebase.isLoggedIn) {
  //     navigate('/lobby');
  //   }
  // }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in a user...');
    try {
      const result = await firebase.signinUserWithEmailandPass(email, password);
      console.log('Successful', result);
      if (result) {
        navigate('/lobby');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await firebase.signinWithGoogle();
      console.log('Google sign-in successful', result);
      navigate('/lobby');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleGuest = async () => {
    navigate('/lobby');
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center"
    style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
    
     {/* 1nd box */}
     <div className='w-1/2 flex flex-col justify-center items-center'>
        
       
        <img src={ LogoImg} className="w-2/4 h-auto" alt=''/>
      </div>

      {/* 2st box */}
      <div className='w-1/2 flex flex-col justify-center items-center'>        
      <div className="bg-[rgba(17,137,130,0.4)] p-10 rounded-3xl shadow-lg w-full max-w-md border border-white ">
        <h2 className="text-4xl font-bold mb-10 text-center text-white font-museo">Log in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            {/* <label htmlFor="email" className="block text-white text-sm font-bold mb-2">Email Address</label> */}
            <input
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"                          
              className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white"
              
              required
            />
          </div>
          <div className="mb-6 relative">
            {/* <label htmlFor="password" className="block text-white text-sm font-bold mb-2">Password</label> */}
            <input
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter password"            
              className="border-b-2 border-b-white border-t-[rgba(17,137,130,0)] border-l-[rgba(17,137,130,0)] border-r-[rgba(17,137,130,0)] w-full py-3 px-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[rgba(17,137,130,0)] placeholder-white"
              required
            />
           
          </div>
          <div className="flex items-center justify-between mb-4">
            <button type="submit" className="bg-[#0A4A3A] hover:bg-[rgba(10,74,58,0.9)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline w-full">
             Signin
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
          <Link to="/signup" className="text-white hover:text-gray-300 ">
              Do you want to register?
            </Link>
          </div>

       

          {/* firebase.signinWithGoogle */}
        </form>
        <button onClick={handleGoogleSignIn} className="bg-[rgba(17,137,130,0.4)] hover:bg-[rgba(17,137,130,0.6)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline border border-white w-full flex flex-row items-center justify-center"><FaGoogle className='mr-2'/> SignIn with Google</button>
        <button onClick={handleGuest} className="bg-[rgba(17,137,130,0.4)] hover:bg-[rgba(17,137,130,0.6)] text-white font-bold py-3  rounded-lg focus:outline-none focus:shadow-outline border border-white w-full mt-4 ">Enter as Guest</button>

      </div>      
      </div>

     




    
    </div>
  );
};

export default LoginPage;
