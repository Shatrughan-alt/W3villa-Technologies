import './App.css';
import {
  BrowserRouter,
  Routes, Route
} from "react-router-dom"
import Register from './Components/Register';
import Loginuser from './Components/Loginuser';
import ToDofrom from './Components/ToDofrom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<Loginuser />} />
          <Route path='/todo' element={<ToDofrom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
