import { TextField,Paper,Button } from "@mui/material";
import { useState,useEffect } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { MenuItem } from "@mui/material";
import * as startOfDay from "date-fns";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Backdrop } from "@mui/material";

/*
    this update function works firstly we search student and change the existing students data then 
    update it accordingly
*/

const Update=()=>{

    //to store formdata 
    const [error,setError] = useState('');
    const [name,setName] = useState('');
    const [newName,setNewName] = useState()
    const [gender,setGender] = useState('');
    const [dob,setDOB] = useState(null);
    const [subjects,setSubjects] = useState([]);
    const [classId,setClassId] = useState('');
    const [newClassId,setNewClassId] = useState('');
    const [StudentId,setStudentId] = useState('')
    const [allStudent,setAllStudent] = useState(null);

    //for loading state
    const [loading,setLoading]=useState(null)
    const [searchResult,setSearchResult] = useState(false);
    
    //for showing success or failure in updating
    const [uploadState,setUploadState] = useState(null)
    const [open,setOpen]=useState(true)
    const [notUploadState,setNotUploadState]=useState(null)
    const [alertText,setAlertText] = useState('');
    
    
    
    //to store individual data from api
    const [genderData,setgenderData] = useState(null);
    const [subjectData,setSubjectData] = useState(null);
    const [classData,setclassData] = useState(null);
    
    
    //handler functions
    const changeNewName = (event) =>{
        setNewName(event.target.value)
    }
    const changeNewClass = (event)=>{
        setNewClassId(event.target.value)
    }
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

    
    //api calls for individual data
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

    //function to update the student 
    const updateStudent = async()=>{
        await axios({
            method:'POST',
            url:'http://bs.koushikisoftware.com/reacttest/api/Student/Update',
            data:{
                "StudentId":StudentId,
                "Name": newName,
                "Gender": gender,
                "ClassId": newClassId,
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
            }
            else{
                setAlertText(response.data.Errors[0].Message)
                setNotUploadState(true)
            }
            setLoading(false)
        }).catch((error)=>{
            console.log(error)
        })
        const timer = setTimeout(() => {
            window.location.reload(false)
          }, 2000);
        return ()=> clearTimeout(timer);
    }
    //function to search the which student to update

    const searchStudent = ()=>{
        setError('')
        setSearchResult(false);
        if(name=='' && classId==''){
            setError('Please fill out the fields')
        }
        else{
            var subjectList= [];
            for(var i=0;i<allStudent.length;i++){
                if(name==allStudent[i].Name && classId==allStudent[i].ClassId){
                    setNewName(allStudent[i].Name)
                    setNewClassId(allStudent[i].ClassId)
                    setDOB(allStudent[i].DOB)
                    setStudentId(allStudent[i].StudentId)
                    setSearchResult(true)
                    setGender(allStudent[i].Gender)
                    allStudent[i].Subjects.map((subject)=>{
                        subjectList.push(subject.SubjectId)
                    })
                    setSubjects(subjectList)
                return;
            }
            const timer = setTimeout(() => {
                setError('The Student is not there')
              }, 2000);
            return ()=> clearTimeout(timer);
            

        }}
    }
    
    
    
    useEffect(()=>{
        getAll()
        getClasses()
        getGender()
        getSubjects()
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
            <div align="center">
                <h2>Update Student</h2>
            </div>
            
            {loading && <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
               <CircularProgress color="inherit" />
                   </Backdrop>}
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
                <div style={{marginTop:"20px"}}>
                <div className="box">
                    <TextField label="Name" value={newName} onChange={changeNewName} fullWidth/>
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
                    <TextField label="Select Class" select value={newClassId} onChange={changeNewClass} fullWidth>
                 
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
                       setError('');
                       updateStudent();
                    }
                }}>Update</Button>
                </div>:''
            }
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
export default Update;