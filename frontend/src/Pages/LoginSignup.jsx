import React, { useState } from 'react'
import './Css/LoginSignup.css'

const LoginSignup = () => {

  const [state,setState] = useState('Login');
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler =(e)=>{
setFormData({...formData,[e.target.name]:e.target.value})
  }
  const login = async ()=>{
    console.log("data",formData)
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/from-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    }).then((res)=>res.json()).then((data)=>responseData=data);
    console.log(responseData.success)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }else{
      alert(responseData.error)
    }

  }

  const signup = async ()=>{
    console.log("data",formData)
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/from-data',
        'Content-Type':'application/json'
      },
      body:JSON.stringify(formData)
    }).then((res)=>res.json()).then((data)=>responseData=data);
    console.log(responseData.success)
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }else{
      alert(responseData.error)
    }

  }
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up" ? <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name="email" value={formData.email} onChange={changeHandler} type="email"  id=""  placeholder='Email Address'/>
          <input name="password" value={formData.password}  onChange={changeHandler} type="password"  id="" placeholder='Password'/>
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?<p className="loginsignup-login">Already have an Account? <span style={{"cursor":"pointer"}} onClick={()=>{setState("Login")}}>Login Here</span></p>:<p className="loginsignup-login">Don't have an account? <span style={{"cursor":"pointer"}} onClick={()=>{setState("Sign Up")}}>Create Here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By Continuing, i agree to the Terms and Conditions.</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
