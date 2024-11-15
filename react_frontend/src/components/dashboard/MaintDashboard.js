import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MainListItems from './listItems';
import SecondaryListItems from './SecondaryListItems';
import MaintDashboardContent from './MaintDashboadContent';
import UserContent from './UserContent';
import RequestContent from './RequestContent';
import DispatchContent from './DispatchContent';
import VehicleContent from './VehicleContent';
import DriverContent from './DriverContent';
import ApprovalContent from './ApprovalContent';
import { useNavigate } from 'react-router-dom';
import RefuelContent from './RefuelContent';
import DepartmentContent from './DepartmentContent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests } from '../../redux/request/requestSlice';
import DispatchReport from './DispatchReport';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../redux/user/userSlice';
import Error403 from './Error403';
import GenerateDispatchReport from './GenerateDispatchReport';
import { AuthContext } from '../../redux/user/authContext';
import MonthlyPlan from './MonthlyPlan';
import OilAndMaintenace from './OilAndMaintenance';
import MaintRequestContent from '../maintenance/MaintRequestContent';
import MaintMainListItems from './maintListItems';
import DashboardContent from './DashboadContent';
import PreventiveMaintContent from '../maintenance/PreventiveMaintContent';
import InsuranceClaimContent from '../maintenance/InsuranceClaimContent';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://ethbspe.org/">
        Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function MaintDashboard({ active }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const navigate = useNavigate();
  
  const { user, setUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [setUser]);

  React.useEffect(() => {
    if (!user) {
      sessionStorage.setItem("module", "dispatch");
      navigate('/signin');
    }
  }, [user])
  

  const pending_requests = useSelector((state) => state.requests.pending_requests.results) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        // console.log(pending_requests);
    }, [pending_requests]);

    React.useEffect(() => {
        dispatch(fetchPendingRequests());
    }, []);


  const handleLogout = () => {    
    sessionStorage.setItem("module", "maintenance");
    logout();
    navigate('/signin');
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Vehicle Maintenance (ተሽከርካሪ ጥገና)
            </Typography>
            <IconButton color="inherit">
              
              <Badge badgeContent={pending_requests.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {user && <IconButton color="inherit" onClick={() => handleLogout()}>
              
              <Badge badgeContent={pending_requests.length} color="secondary">
                <LogoutIcon />
              </Badge>
            </IconButton>}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MaintMainListItems />
            {/* <Divider sx={{ my: 1 }} /> */}
            {/* <SecondaryListItems /> */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {user?.user?.access_level >= 0 && ( // Ensure valid user
            active && ( // Check if user is active
              <>
                {active === 'Dashboard' && <MaintDashboardContent />}
                {active === 'Maintenance' && (user.user?.access_level >= 2 ? <MaintRequestContent /> : <Error403 />)}
                {active === 'Preventive' && (user.user?.access_level >= 2 ? <PreventiveMaintContent /> : <Error403 />)}
                {active === 'Insurance' && (user.user?.access_level >= 2 ? <InsuranceClaimContent /> : <Error403 />)}
                
              </>
            )
          ) || <Error403 />}
                    
            {/* <DashboardContent /> */}
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
