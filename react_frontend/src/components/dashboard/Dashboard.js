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
import DashboardContent from './DashboadContent';
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

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
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

export default function Dashboard({ active }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const navigate = useNavigate();
  //const [tab, setTab] = React.useState('Dashboard');

  // const changeTab = (tb) => {
  //   setTab(tb);
  // }
  const storedUser = localStorage.getItem('user');
  let parsedUser = '';
  if (storedUser) {
    console.log('sss');
    parsedUser = JSON.parse(storedUser);
  }

  React.useEffect(() => {
    if (!parsedUser) {
      navigate('/signin');
    }
  }, [parsedUser])
  

  const pending_requests = useSelector((state) => state.requests.pending_requests.results) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        console.log(pending_requests);
    }, [pending_requests]);

    React.useEffect(() => {
        dispatch(fetchPendingRequests());
    }, []);

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
              Dashboard
            </Typography>
            <IconButton color="inherit">
              
              <Badge badgeContent={pending_requests.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {storedUser && <IconButton color="inherit" onClick={() => logout()}>
              
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
            <MainListItems />
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems />
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
          {parsedUser.user?.access_level >= 0 && ( // Ensure valid user
            active && ( // Check if user is active
              <>
                {active === 'Dashboard' && <DashboardContent />}
                {active === 'Requests' && <RequestContent />}
                {/* Access level checks for other content */}
                {active === 'Approvals' && (parsedUser.user?.access_level >= 1 ? <ApprovalContent /> : <Error403 />)}
                {active === 'Vehicles' && (parsedUser.user?.access_level >= 2 ? <VehicleContent /> : <Error403 />)}
                {active === 'Drivers' && (parsedUser.user?.access_level >= 2 ? <DriverContent /> : <Error403 />)}
                {active === 'Refuel' && (parsedUser.user?.access_level >= 2 ? <RefuelContent /> : <Error403 />)}
                {active === 'Dispatches' && (parsedUser.user?.access_level >= 2 ? <DispatchContent /> : <Error403 />)}
                {active === 'DispatchReport' && (parsedUser.user?.access_level >= 2 ? <DispatchReport /> : <Error403 />)}
                {active === 'Users' && (parsedUser.user?.access_level >= 3 ? <UserContent /> : <Error403 />)}
                {active === 'Departments' && (parsedUser.user?.access_level >= 3 ? <DepartmentContent /> : <Error403 />)}
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
