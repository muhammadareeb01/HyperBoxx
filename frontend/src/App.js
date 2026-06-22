import "./App.css";
import FAQ from "./components/FAQ/faq.jsx";
import Authentication from "./components/Authentication/authentication.jsx";
import Footer from "./components/Footer/footer.jsx";
import TOS from "./components/TOS/tos.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/privacy.jsx";
import ShippingAndRefund from "./components/ShippingAndRefund/shippingandrefund.jsx";
import FreeBox from "./components/FreeBox/freebox.jsx";
import Deposit from "./components/Deposit/deposit.jsx";
import Referral from "./components/Referral/referral.jsx";
import Navbar from "./components/Navbar/navbar.jsx";
import Signup from "./components/Signin_Singup/signup.jsx";
import Login from "./components/Signin_Singup/login.jsx";
import { Routes, Route } from "react-router-dom";
import MyProfile from "./components/MyProfile/profile.jsx";
import MainPage from "./components/MainPage/mainpage.jsx";
// Import the Bootstrap CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import BoxDetails from "./components/BoxDetail/boxdetail.jsx";
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  // Define routes where Navbar/Footer should be HIDDEN
  const isPlainPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-global-bg">
      <div>
        {!isPlainPage && <Navbar />}
      </div>

      <Routes>
        <Route path="/signup" element={
          <ProtectedRoute requireAdmin={false}>
            <Signup />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute requireAdmin={false}>
            <MainPage />
          </ProtectedRoute>
        } />

        <Route path="/login" element={
          <ProtectedRoute requireAdmin={false}>
            <Login />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute requireAdmin={false}>
            <MyProfile />
          </ProtectedRoute>
        } />

        <Route path="/termsofservice" element={
          <ProtectedRoute requireAdmin={false}>
            <TOS />
          </ProtectedRoute>
        } />

        <Route path="/affilate" element={
          <ProtectedRoute requireAdmin={false}>
            <ShippingAndRefund />
          </ProtectedRoute>
        } />

        <Route path="/freebox" element={
          <ProtectedRoute requireAdmin={false}>
            <FreeBox />
          </ProtectedRoute>
        } />

        <Route path="/deposit" element={
          <ProtectedRoute requireAdmin={false}>
            <Deposit />
          </ProtectedRoute>
        } />

        <Route path="/profile/deposit" element={
          <ProtectedRoute requireAdmin={false}>
            <Deposit />
          </ProtectedRoute>
        } />

        <Route path="/faq" element={
          <ProtectedRoute requireAdmin={false}>
            <FAQ />
          </ProtectedRoute>
        } />

        <Route path="/privacypolicy" element={
          <ProtectedRoute requireAdmin={false}>
            <PrivacyPolicy />
          </ProtectedRoute>
        } />

        <Route path="/shiipingAndrefund" element={
          <ProtectedRoute requireAdmin={false}>
            <ShippingAndRefund />
          </ProtectedRoute>
        } />

        <Route path="/box/:id" element={
          <ProtectedRoute requireAdmin={false}>
            <BoxDetails />
          </ProtectedRoute>
        } />

        <Route path="/contact" element={
          <ProtectedRoute requireAdmin={false}>
            <FAQ />
          </ProtectedRoute>
        } />

        <Route path="/support" element={
          <ProtectedRoute requireAdmin={false}>
            <FAQ />
          </ProtectedRoute>
        } />

        <Route path="/authentication" element={
          <ProtectedRoute requireAdmin={false}>
            <Authentication />
          </ProtectedRoute>
        } />

        <Route path="/referral" element={
          <ProtectedRoute requireAdmin={false}>
            <Referral />
          </ProtectedRoute>
        } />
        <Route 
          path="/admin" 
          element={
            // <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            // </ProtectedRoute>
        }/>
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>

      {!isPlainPage && <Footer />}
    </div>
  );
}

export default App;
