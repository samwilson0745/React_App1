import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from 'react-redux'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
const Home=()=>{
    
    var [result,setResult]=useState(null);
    var [loading,setLoading] = useState(true);
    const [alert,setAlert] = useState(null);
    const [alertText,setAlertText] = useState(null);
    const [open,setOpen]=useState(true)
    const [errorAlert,setErrorAlert]=useState(null)
    //
    useEffect(async ()=>{
      setAlert(false);
      setAlertText(false);
      setErrorAlert(false);
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/GetAll',
            data:{
                "ApiToken": localStorage.getItem('ApiToken')
            }
        }).then((response)=>{
            setResult(response.data.Data)
            setLoading(false)        
        })
       
    },[loading])

    return(
        <div align="center" style={{margin:"10px auto"}}>
          <h1>All Students</h1>
          
          {loading==true?<div style={{padding:"50px"}}><CircularProgress color="inherit" /></div>
          :
          result.length!=0?
          
          result.map((res)=>(
              <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
              <ListItem key={result.StudentId} alignItems="flex-start" secondaryAction={
                 <IconButton edge="end" aria-label="delete" onClick={async ()=>{
                  await axios({
                    method:'POST',
                    url:'http://bs.koushikisoftware.com/reacttest/api/Student/Remove',
                    data:
                      {
                        "StudentId": res.StudentId,
                        "ApiToken": localStorage.getItem('ApiToken')
                      }
                }).then((response)=>{
                    if(response.data.IsSucess == true){
                      setAlert(true)
                      setAlertText(response.data.Message)
                      
                    }
                    else{
                      setErrorAlert(true)
                      setAlertText(response.data.Message)
                    }
                    const timer = setTimeout(() => {
                      setLoading(true)
                      setResult(null)
                    }, 1000);
                  return ()=> clearTimeout(timer);
                    
                }).catch((error)=>{
                    console.log(error)
                })
                 }}>
                 <DeleteIcon />
               </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={res.Documents[0]?res.Documents[0].DocumentUrl:''} />
                </ListItemAvatar>
                <ListItemText
                  primary={res.Name}
                  secondary={
                    res.Class.Name
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              
            
            
            </List>
            
          )):<div style={{padding:"20px"}}><p>No Students Added yet</p></div>}
          {alert==true?<Collapse in={open}><Alert severity="success" action={<IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>}>{alertText}</Alert></Collapse>:''}
            {errorAlert==true?<Collapse in={open}><Alert severity="error" action={<IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>}>{alertText}</Alert></Collapse>:''
        }
        </div>
    );
}
export default Home;