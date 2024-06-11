import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApprovalIcon from '@mui/icons-material/Approval';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';

const MainListItems = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/')} >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/drivers')}>
        <ListItemIcon>
          <AirlineSeatReclineNormalIcon />
        </ListItemIcon>
        <ListItemText primary="Drivers" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/vehicles')}>
        <ListItemIcon>
          <DirectionsCarIcon />
        </ListItemIcon>
        <ListItemText primary="Vehicles" />
      </ListItemButton>
      <ListItemButton  onClick={() => navigate('/requests')}>
        <ListItemIcon>
        <ContactSupportIcon />
        </ListItemIcon>
        <ListItemText primary="Requests" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/dispatches')}>
        <ListItemIcon>
          <AltRouteIcon />
        </ListItemIcon>
        <ListItemText primary="Dispatches" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/approvals')}>
        <ListItemIcon>
          <ApprovalIcon />
        </ListItemIcon>
        <ListItemText primary="Approvals" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/refuels')}>
        <ListItemIcon>
          <LocalGasStationIcon />
        </ListItemIcon>
        <ListItemText primary="Refuels" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/users')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/departments')}>
        <ListItemIcon>
          <BusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Departments" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/dispatch_report')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Dispatch report" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
    </React.Fragment>
    );
}


export default MainListItems;