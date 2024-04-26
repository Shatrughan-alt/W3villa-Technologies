import React, { useState } from 'react'
import { useNavigate, NavLink } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate()
    const [userdata, setuserdata] = useState({
        userName: "",
        password: ""
    })
    const handleData = (e) => {
        setuserdata({ ...userdata, [e.target.name]: e.target.value })
    }
    const Adder = async (e) => {
        e.preventDefault()
        const { userName, password } = userdata

        const res = await fetch("/register", {
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
            console.log("Shop already present");
        }
        else if (res.status === 422) {
            console.log("Fill the form");

        }
        else {
            console.log("Success");

            navigate("/login")
        }
    }
    return (
        <>
            <div className='background'><div className='transbox'>
        <div className='form1'>
        {/* <img style={{ height: 450 }} src={file} alt="" /> */}
        <div className='form'>
                <div class="title">Registration</div>
                <div class="subtitle">Let's create your account!</div>
            <form method="post">
                    <div className="input-container ic1">
                        <input placeholder="Usename" type="text" name="userName" onChange={handleData} className="input" id="username"/>
                    </div>
                    <div className="input-container ic2">
                        <input placeholder="Password" type="password" name="password" onChange={handleData} className="input" id="password" />
                    </div>
                <button className='submit' onClick={Adder}>Register</button>
                <div className='shatru1'>
                <NavLink className='shatru' to="/login">Login </NavLink>
                </div>
            </form>
        </div>
        
                </div> 
                </div>
            </div>
        </>
    )
}

















