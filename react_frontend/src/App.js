import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dashboard from './components/dashboard/Dashboard';
import SignIn from './components/SignIn';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from './components/NotFound';
import RefuelContent from './components/dashboard/RefuelContent';
// import RequestForm from './components/reports/RequestForm';
import Header from './components/reports/Header';
import DispatchReport from './components/reports/DispatchReport';

function App() {
  // const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('md'));
  // const [mobileOpen, setMobileOpen] = React.useState(false);

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };

  return (
    // <DispatchReport/>
    // <RequestForm />
    // <Header />
    // <Dashboard />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard active='Dashboard'/>} />        
        <Route path="/drivers" element={<Dashboard active='Drivers'/>} />
        <Route path="/vehicles" element={<Dashboard active='Vehicles'/>} />
        <Route path="/requests" element={<Dashboard active='Requests'/>} />
        <Route path="/dispatches" element={<Dashboard active='Dispatches'/>} />
        <Route path="/approvals" element={<Dashboard active='Approvals'/>} />
        <Route path="/users" element={<Dashboard active='Users'/>} />
        <Route path="/departments" element={<Dashboard active='Departments'/>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/refuels" element={<Dashboard active='Refuel'/>} />
        <Route path="/dispatch_report" element={<Dashboard active='DispatchReport'/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
