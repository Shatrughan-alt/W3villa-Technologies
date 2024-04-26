import React, { useState } from 'react'
import { useNavigate, NavLink } from "react-router-dom"
import boy from "./boy.png";
export default function Loginuser() {
  const navigate = useNavigate()
  const [userdata, setuserdata] = useState({
    userName: "",
    password: ""
  })
  const handleData = (e) => {
    setuserdata({ ...userdata, [e.target.name]: e.target.value })
  }


  const Login = async (e) => {
    e.preventDefault()
    const { userName, password } = userdata

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName, password
      })
    })

    await res.json();
    if (res.status === 400) {
      console.log("Invalid Credential");
    }
    else if (res.status === 422) {
      console.log("Fill the from");
    }
    else {
      console.log("Success");

      navigate("/todo")
    }
  }
  return (
    <>
      <div className='background'><div className='transbox'>
      
      <div className='form1'>
          <img style={{height:450}} src={boy} alt="" />
        <div className='form'>
          <div class="title">Welcome</div>
          <div class="subtitle">Login your account!</div>
          <form method="post">
            <div className="input-container ic1">
              <input placeholder="Usename" type="text" name="userName" onChange={handleData} className="input" id="username" />
            </div>
            <div className="input-container ic2">
              <input placeholder="Password" type="password" name="password" onChange={handleData} className="input" id="password" />
            </div>
            <button className='submit' onClick={Login}>Login</button>
            <div className='shatru1'>
            <NavLink className='shatru' to="/">Register </NavLink>
            </div>
          </form>
        </div>
        </div></div>
      </div>





      {/* <form method="post">
        <input type="text" name="userName" onChange={handleData} placeholder='UserNAme' />
        <input type="password" name="password" onChange={handleData} placeholder='Password' />
        <button onClick={Login}>Submit</button>

        <NavLink to="/">Signup </NavLink>
      </form> */}
    </>
  )
}
