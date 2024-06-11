import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { fetchDispatches } from '../../redux/dispatch/dispatchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { EthiopianDate } from 'mui-ethiopian-datepicker';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    'Elvis Presley',
    'Tupelo, MS',
    'VISA ⠀•••• 3719',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2019',
    'Paul McCartney',
    'London, UK',
    'VISA ⠀•••• 2574',
    866.99,
  ),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  createData(
    3,
    '16 Mar, 2019',
    'Michael Jackson',
    'Gary, IN',
    'AMEX ⠀•••• 2000',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen',
    'Long Branch, NJ',
    'VISA ⠀•••• 5919',
    212.79,
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function DispatchTable({title}) {
  const dispatches = useSelector((state) => state.dispatches.dispatches) ?? [];
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchDispatches());
  }, []);

  React.useEffect(() => {
    console.log(dispatches);
  }, [dispatches]);

  const times = [{'07:00:00': '1:00 (ከጠዋቱ)'},{'02:00:00': '2:00 (ከጠዋቱ)'},{'09:00:00': '3:00 (ከጠዋቱ)'},{'10:00:00': '4:00 (ከረፋዱ)'},{'11:00:00': '5:00 (ከረፋዱ)'},{'00:00:00': '6:00 (ከቀኑ)'},{'13:00:00': '7:00 (ከቀኑ)'},{'14:00:00': '8:00 (ከቀኑ)'},{'15:00:00': '9:00 (ከቀኑ)'},{'16:00:00': '10:00 (ከቀኑ)'},{'17:00:00': '11:00 (ከአመሻሹ)'},{'18:00:00': '12:00 (ከአመሻሹ)'},{'19:00:00': '1:00 (ከምሽቱ)'},{'20:00:00': '2:00 (ከምሽቱ)'},{'21:00:00': '3:00 (ከምሽቱ)'},{'22:00:00': '10:00 PM'},{'23:00:00': '11:00 PM'},{'12:00:00': '12:00 PM'},{'01:00:00': '1:00 AM'},{'02:00:00': '2:00 AM'},{'03:00:00': '3:00 AM'},{'04:00:00': '4:00 AM'},{'05:00:00': '5:00 AM'},{'06:00:00': '6:00 AM'}];

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Dispatch ID</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Assigned date </TableCell>
            <TableCell>Departure time</TableCell>
            <TableCell>Departure milage</TableCell>
            <TableCell>Return time</TableCell>
            <TableCell>Return milage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dispatches.map((dispatch) => (
            <TableRow key={dispatch.id}>
              <TableCell>{dispatch.id}</TableCell>
              <TableCell>
                {dispatch.vehicle_requests?.map(request => (
                  `(${request.id}, ${request.destination}, ${request.requester?.fname}, ${request.requester?.mname})`
                )).join('')}
              </TableCell>
              <TableCell>{`${dispatch.vehicle.license_plate}; ${dispatch.vehicle.make} ${dispatch.vehicle.model}`}</TableCell>
              <TableCell>{`${dispatch.driver.license_number}; ${dispatch.driver.fname} ${dispatch.driver.mname}`}</TableCell>
              <TableCell>{dispatch.assigned_date.slice(0, 10)}</TableCell>
              <TableCell>{`${dispatch.departure_date}: ${dispatch.departure_time_est}`}</TableCell>
              <TableCell>{dispatch.departure_milage}</TableCell>
              <TableCell>{`${dispatch.return_date_est}: ${dispatch.return_time_est}`}</TableCell>
              <TableCell align="right">{dispatch.return_milage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
