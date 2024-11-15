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
import NextPlanIcon from '@mui/icons-material/NextPlan';
import GarageIcon from '@mui/icons-material/Garage';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../redux/user/authContext';

const MaintMainListItems = ({active}) => {
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
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/maintenance/maint_request')}>
        <ListItemIcon>
          <GarageIcon />
        </ListItemIcon>
        <ListItemText primary="Maintenance Request" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/maintenance/preventive')}>
        <ListItemIcon>
          <DepartureBoardIcon />
        </ListItemIcon>
        <ListItemText primary="Preventive" />
      </ListItemButton>}
      {user?.user?.access_level >= 2 && <ListItemButton onClick={() => navigate('/maintenance/insurance')}>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Insurance" />
      </ListItemButton>}
    </React.Fragment>
    
    );
}


export default MaintMainListItems;