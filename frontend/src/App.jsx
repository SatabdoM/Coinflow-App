import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Transfer from "./components/Transfer";
function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Welcome></Welcome>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/signin" element={<Signin></Signin>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/transfer/:userId" element={<Transfer></Transfer>}></Route>
        <Route path="/*" element={<div>404! Path Not Defined!</div>}></Route>
      </Routes>
    </div>
  );
}

export default App;
