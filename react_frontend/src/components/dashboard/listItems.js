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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../redux/user/authContext';

const MainListItems = ({active}) => {
  const navigate = useNavigate();
  const { user, setUser } = React.useContext(AuthContext);
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/')} >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/drivers')}>
        <ListItemIcon>
          <AirlineSeatReclineNormalIcon />
        </ListItemIcon>
        <ListItemText primary="Drivers" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/vehicles')}>
        <ListItemIcon>
          <DirectionsCarIcon />
        </ListItemIcon>
        <ListItemText primary="Vehicles" />
      </ListItemButton>}
      {user?.user?.access_level >= 0 && <ListItemButton  onClick={() => navigate('/requests')}>
        <ListItemIcon>
        <ContactSupportIcon />
        </ListItemIcon>
        <ListItemText primary="Requests" />
      </ListItemButton>}
      {user?.user?.access_level >= 1 && <ListItemButton onClick={() => navigate('/approvals')}>
        <ListItemIcon>
          <ApprovalIcon />
        </ListItemIcon>
        <ListItemText primary="Approvals" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/dispatches')}>
        <ListItemIcon>
          <AltRouteIcon />
        </ListItemIcon>
        <ListItemText primary="Dispatches" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/dispatch_report')}>
        <ListItemIcon>
          <AssignmentTurnedInIcon />
        </ListItemIcon>
        <ListItemText primary="Complete dispatch" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/refuels')}>
        <ListItemIcon>
          <LocalGasStationIcon />
        </ListItemIcon>
        <ListItemText primary="Refuels" />
      </ListItemButton>}
      {user?.user?.access_level == 3 && <ListItemButton onClick={() => navigate('/users')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>}
      {user?.user?.access_level == 3 && <ListItemButton onClick={() => navigate('/departments')}>
        <ListItemIcon>
          <BusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Departments" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton  onClick={() => navigate('/old_dispatch')}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Dispatch report" />
      </ListItemButton>}
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