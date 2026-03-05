import { Routes, Route } from 'react-router-dom';
import Home from './components/home'
import BugList from './components/bugList';
import UserList from './components/userList';
import Login from './components/login';
import Register from './components/registerPage';
import UserEditor from './components/UserEditor';
import BugEditor from './components/bugEditor';
import './App.css'
import { ToastContainer, toast } from 'react-toastify'
import AppLayout from './layouts/appLayout.tsx';
import Dashboard from './components/dashboard.tsx';
import YourAccount from './components/YourAccount.tsx';

function App() {
  function showError(message: string) {
    toast(message, { type: 'error', position: 'bottom-right' });
  }
  function showSuccess(message: string) {
    toast(message, { type: 'success', position: 'bottom-right' });
  }

  return (
    <>
      <ToastContainer />
      <div>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/BugList" element={<BugList />} />
            <Route path="/UserList" element={<UserList />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/UserEditor" element={<UserEditor showError={showError} showSuccess={showSuccess} />} />
            <Route path='/BugEditor' element={<BugEditor showError={showError} showSuccess={showSuccess} />} />
            <Route path='/YourAccount' element={<YourAccount showError={showError} showSuccess={showSuccess} />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App
