import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Button,TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";
import axios from "axios";


const Login = ()=>{
    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const nameChange=(event)=>{
        setName(event.target.value);
    }

    const passwordChange=(event)=>{
        setPassword(event.target.value);
    }
    const onClick=async ()=>{
        setLoading(true);
        if(name=='' && password==''){
            setError('Please fill out the fields');
        }
        else{
            const response = await axios({
                method:'POST',
                url:'http://bs.koushikisoftware.com/reacttest/api/AdminUser/Login',
                data:{
                    "LoginId":name,
                    "Password":password
                }
            })
            if(response.data.IsSucess == true){
                setLoading(false);
                setError('');
                console.log(response.data.Data.Name)
                localStorage.setItem('ApiToken',response.data.Data.ApiToken)
                localStorage.setItem('Name',response.data.Data.Name)
                navigate('/main/home',{replace:true});
            }
            else{
                setLoading(false);
                setError(response.data.Message)
            }
        }
    }
    
    const inputStyle={
        width:"55%",
        marginTop:"10px",
        marginBottom:"10px",
    };
    
    const buttonStyle={
          padding:15,
          width:"55%",
          margin:"15px auto",
          borderRadius:"30px",
          backgroundColor:"darkblue"
    }


    return (
        <Grid style={{marginTop:"0px"}} container rowSpacing={0} columnSpacing={{ xs: 0, sm: 0, md: 0 }}>
            <Grid align="center" className="right-side" item xs={7}>
                <div style={{
                    paddingTop:"28vh"
                }}>
                    <img color="" height="200vw" src={process.env.PUBLIC_URL+"/knowledge1.png"} alt="" />
                    <h1 style={{
                        color:"white"
                    }}>Student Management System</h1>
                </div>
            </Grid>
            <Grid align="center" item xs={5}>
               {loading && <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
               <CircularProgress color="inherit" />
                   </Backdrop>}
                <form>
                    <div className="right-content">
                        <h1 style={{
                            fontSize:"50px",
                            color:"darkblue"
                        }}>Login</h1>
                        {error ===''?'':<h4 style={{color:'red'}}>{error}</h4>}
                        <TextField required onChange={nameChange} style={inputStyle}  label="Name" variant="outlined" /><br />
                        <TextField required onChange={passwordChange} style={inputStyle} type="password"  label="Password" variant="outlined" /> <br />
                        <Button type="button" style={buttonStyle} onClick={onClick} variant="contained">Login</Button>
                    </div>
                </form>
            </Grid>
        </Grid>
    );
}

export default Login;