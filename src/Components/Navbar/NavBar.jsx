import {NavLink} from 'react-router-dom';

const Navbar = () => {
    return ( 
            <nav className="navbar" position='fixed'>    
                <h1>{localStorage.getItem('Name')}</h1>
                <div className="links" style={{
                    align:"right"
                }}>
                    <NavLink to="home">Home</NavLink>
                    <NavLink to="add">Add</NavLink>
                    <NavLink to="update">Update</NavLink>
                    <NavLink to="upload">Upload</NavLink>
                </div> 
            </nav>
    );
}
    
export default Navbar;