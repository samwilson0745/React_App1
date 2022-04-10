import React from "react";

import Navbar from "../Navbar/NavBar";
import { Outlet } from "react-router-dom";
const Main=()=>{
    return(
                <div>
                    <Navbar/>
                    <Outlet/>
                </div>
            
    );
}

export default Main;
//<Route path="/views/:pid" element={<View/>}/>