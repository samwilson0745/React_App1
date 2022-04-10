import { Paper,Button } from "@mui/material";
import { TextField,MenuItem } from "@mui/material";
import axios from "axios";
import React,{useEffect, useState} from "react";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import * as startOfDay from "date-fns";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useNavigate  } from "react-router-dom";


const Add=()=>{
    const navigate = useNavigate();
    const [name,setName] = useState('');
    const [gender,setGender] = useState('');
    const [dob,setDOB] = useState(null);
    const [classId,setClassId] = useState('');
    const [subjects,setSubjects] = useState([]);
    const [genderData,setgenderData] = useState(null);
    const [classData,setclassData] = useState(null);
    const [subjectData,setSubjectData] = useState(null);
    const [allStudent,setAllStudent] = useState(null);
    const [uploadState,setUploadState] = useState(null)
    const [open,setOpen]=useState(true)
    const [notUploadState,setNotUploadState]=useState(null)
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null)
    const [alertText,setAlertText] = useState('')

    const changeGender = (event)=>{
        setGender(event.target.value)
    }
    const changeClass = (event)=>{
        setClassId(event.target.value)
    }
    const changeSubjects = (event)=>{
        setSubjects(event.target.value)
    }
    const changeName = (event)=>{
        setName(event.target.value)
    }
    const getGender =async ()=>{
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/GetGenders',
        }).then((response)=>{
            setgenderData(response.data.Data)
        }).catch((error)=>{
            console.log(error)
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
    const getSubjects = async ()=>{
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/GetSubjects',
            data:{
                "ApiToken": localStorage.getItem('ApiToken')
            }
        }).then((response)=>{
            setSubjectData(response.data.Data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    const getAll = async()=>{
        setLoading(true);
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

    const addStudents = async()=>{
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/Add',
            data:{
                "Name": name,
                "Gender": gender,
                "ClassId": classId,
                "DOB": dob,
                "IsSpeciallyEligible": true,
                "Subjects": subjects,
                "ApiToken": localStorage.getItem('ApiToken')
              }
        }).then((response)=>{
            if(response.data.IsSucess==true){
                setAlertText(response.data.Message)
                setUploadState(true)
                setLoading(true)
                setTimeout(() => {
                    navigate('/main/upload',{replace:true})
                  }, 3000);
               
            }
            else{
                setAlertText(response.data.Errors[0].Message)
                setNotUploadState(true)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }


    useEffect(()=>{
        getAll();
        getGender();
        getClasses();
        getSubjects();
    },[])
    
    
    return(
        
        <Paper elevation={5}  
        style={{
            margin:"20px 50px",
            padding:"50px"
        }} className="box"> 
        <h2 align="center">Add Student</h2>
        {
            error && <h4 style={{color:'red'}}>{error}</h4>
        }
            {loading && <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
               <CircularProgress color="inherit" />
                   </Backdrop>}
            <div className="box">
                <TextField label="Name" value={name} onChange={changeName} fullWidth/>
            </div>
            
            <div className="box">
            <TextField label="Select Gender" select value={gender} onChange={changeGender} fullWidth>
             
                {
                    genderData!==null?genderData?.map((gender)=>{
                        return(
                            <MenuItem key={gender.Value} value={gender.Value}>
                                {gender.Name}
                            </MenuItem>
                        );
                    }):<CircularProgress color="inherit" />
                }
            </TextField>
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
            <div className="box">
                <TextField label="Select Subjects" select value={subjects} onChange={changeSubjects} fullWidth SelectProps={{
                    multiple:true
                }}>
                {
                    subjectData!==null?subjectData?.map((subject)=>{
                        return(
                            <MenuItem key={subject.SubjectId} value={subject.SubjectId}>
                                {subject.Name}
                            </MenuItem>
                        );
                    }):<CircularProgress color="inherit" />
                }
            </TextField>
            </div>
            <div className="box">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    fullWidth
                    renderInput={(props) => <TextField {...props} />}
                    label="Date of birth"
                    value={dob}
                    onChange={(newValue) => {
                        setDOB(newValue);
                    }}
                />
            </LocalizationProvider></div>
            <Button fullWidth style={{
                height:'50px'
            }} variant="contained" onClick={()=>{
                if(name=='' && gender=='' && classId == '' && dob==null && subjects.length==0){
                    setError('Please Fill up the fields')
                }
                else{
                    setError('')
                   for(var i=0;i<allStudent.length;i++){
                       if(name==allStudent[i].Name && classId==allStudent[i].ClassId){
                           setError('Same Name cannot be in same class')
                           return;
                       }
                   }
                   setError('');
                   addStudents();
                }
            }}>Add</Button>
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
        </Paper>
    );
}
export default Add;
// navigate('/main/home',{replace:true});