import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authClient } from '../auth-client.ts'

const AppLayout = () => {
  const navigate = useNavigate();

  const onLogout = async () => {
    await authClient.signOut();
    navigate("/")
  }

  return (
    <>
      <Navbar onLogout={onLogout} />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
