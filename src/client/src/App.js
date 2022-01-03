import React from "react";
import { Routes, Route, NavLink as Link } from 'react-router-dom';
import KimsWeb from "./components/kimsweb";
import AboutMe from "./components/aboutme";
import Book from "./components/book";



function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/" className={({ isActive }) => isActive ? "white" : "black"} end>Home</Link>
          </li>
          <li>
            <Link to="about" className={({ isActive }) => isActive ? "white" : "black"}>About Me</Link>
          </li>
          <li>
            <Link to="book" className={({ isActive }) => isActive ? "white" : "black"}>Schedule Appointment</Link>
          </li>
        </ul>
      </nav>
      <div className="main">
   
        <Routes>
          <Route path="/" element={<KimsWeb />}></Route>
          <Route path="about" element={<AboutMe />}></Route>
          <Route path="book" element={<Book />}></Route>
		  <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
export const NotFound = () => {
	return <div>This is a 404 page</div>;
  }


export default App;







