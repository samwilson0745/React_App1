import './App.css';
import Login from './Components/adminLogin';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Main from './Components/Main/mainPage';
import Home from './Components/Home/Home';
import Add from './Components/AddStudent/Add';
import Update from './Components/UpdateStudent/Update';
import Upload from './Components/UploadImage/Upload';


function App() {
  return (
    <Router>
      <div>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/main" element={<Main/>}>
              <Route path="home" element={<Home/>}/>
              <Route path="add" element={<Add/>}/>
              <Route path="update" element={<Update/>}/>
              <Route path="upload" element={<Upload/>}/>
          </Route>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
