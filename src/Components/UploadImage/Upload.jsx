import { Paper,Button } from "@mui/material";
import { useEffect, useState } from "react";
import { TextField,MenuItem } from "@mui/material";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Backdrop } from "@mui/material";


const Upload=()=>{
    
    const [error,setError] = useState('');
    const [image,setImage] = useState('');
    const [StudentID,setStudentID] = useState('');
    const [imageURL,setImageURL]= useState([]); 
    const [name,setName] = useState('');
    const [classId,setClassId] = useState('');
    const [classData,setclassData] = useState(null);
    const [searchResult,setSearchResult] = useState(false);
    const [allStudent,setAllStudent] = useState(null);
    const [uploadState,setUploadState] = useState(null)
    const [open,setOpen]=useState(true)
    const [notUploadState,setNotUploadState]=useState(null)
    const [alertText,setAlertText] = useState('')
    const [loading,setLoading] = useState(true);


    const changeClass = (event)=>{
        setClassId(event.target.value)
    }
    const changeName = (event)=>{
        setName(event.target.value)
    }
    const uploadImage = async ()=>{
        const formData = new FormData();
        formData.append("File",image);
        formData.append("StudentId",StudentID);
        formData.append("ApiToken",localStorage.getItem('ApiToken'));
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/UploadStudentImages',
            data:formData
        }).then((response)=>{
            if(response.data.IsSucess==true){
                setAlertText(response.data.Message)
                setUploadState(true)
            }
            else{
                setAlertText(response.data.Errors[0].Message)
                setNotUploadState(true)
            }
        }).catch((error)=>{
            console.log(error)
        })
        const timer = setTimeout(() => {
            window.location.reload(false)
          }, 1000);
        return ()=> clearTimeout(timer);
    }
    const searchStudent = ()=>{
        setError('')
        setSearchResult(false);
        if(name=='' && classId==''){
            setError('Please fill out the fields')
        }
        for(var i=0;i<allStudent.length;i++){
            if(name==allStudent[i].Name && classId==allStudent[i].ClassId){
                setSearchResult(true)
                setStudentID(allStudent[i].StudentId)
                return;
            }
        }
    }
    const onImageChange =(event)=>{
        if(event.target.files[0] == null){
            setImageURL(null)
          }
          else{
            setImage(event.target.files[0])
            setImageURL(URL.createObjectURL(event.target.files[0]))
          }
    }
    const getAll = async()=>{
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/GetAll',
            data:{
                "ApiToken": localStorage.getItem('ApiToken')
            }
        }).then((response)=>{
            setAllStudent(response.data.Data)  
            setLoading(false);
        })
    }
    const getClasses =async ()=>{
        await axios({
            method:'POST',
            url:' http://bs.koushikisoftware.com/reacttest/api/Student/GetClasses',
            data:{
                "ApiToken": localStorage.getItem('ApiToken')
            }
        }).then((response)=>{
            setclassData(response.data.Data)
        }).catch((error)=>{
            console.log(error)
        })
    }


    useEffect(()=>{
        getAll()
        getClasses()
    },
    [])

    return(
        <Paper
        elevation={5}  
        style={{
            margin:"20px 50px",
            padding:"50px"
        }}
        >
            {loading && <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
               <CircularProgress color="inherit" />
                   </Backdrop>}
            <form>
            {error && <h4 style={{color:'red'}}>{error}</h4>}
            <div className="box">
                <TextField label="Name" value={name} onChange={changeName} fullWidth/>
            </div>
            <div className="box">
                <TextField label="Select Class" select value={classId} onChange={changeClass} fullWidth>
                {
                    classData!==null?classData?.map((classes)=>{
                        return(
                            <MenuItem key={classes.ClassId} value={classes.ClassId}>
                                {classes.Name}
                            </MenuItem>
                        );
                    }):<CircularProgress color="inherit" />
                }
            </TextField>
            </div>
            <Button fullWidth style={{
                height:'50px'
            }} variant="contained" 
             onClick={searchStudent}
            >
                Search
            </Button>
        {
            searchResult==true?
            
            <div className="box">
                <br/>
            <TextField
                type="file"
                onChange={onImageChange}
            /><br/>
            {imageURL && <div style={{
                margin:"20px"
            }} align="center"><img src={imageURL} alt="" /></div>}
            <div style={{margin:'20px'}}>
                <Button  fullWidth style={{
                height:'50px'
            }} variant="contained" 
                onClick={()=>{
                    setOpen(true);
                    setUploadState(false);
                    setNotUploadState(false);
                    if(imageURL.length==0){
                        setError('Select image file')
                    }
                    else{
                        uploadImage()
                    }
                }}
            > Upload</Button>
            </div>
        </div>:<h3 align="center">Search to upload Students Image</h3>}
        {uploadState==true?<Collapse in={open}><Alert severity="success" action={<IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>}>{alertText}</Alert></Collapse>:''}
        {
            notUploadState==true?<Collapse in={open}><Alert severity="error" action={<IconButton
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
        </form>
        </Paper>
    );
}
export default Upload;