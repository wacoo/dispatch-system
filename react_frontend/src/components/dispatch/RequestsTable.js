import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { fetchRequests } from '../../redux/request/requestSlice';
import { useDispatch, useSelector } from 'react-redux';

// Generate Order Data
function preventDefault(event) {
  event.preventDefault();
}

export default function RequestsTable({title}) {
  const requests = useSelector((state) => state.requests.requests.results) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        console.log(requests);
    }, [requests]);

    React.useEffect(() => {
        dispatch(fetchRequests());
    }, []);

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Requester</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Request date</TableCell>
            <TableCell>Vehicle type</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Duration from</TableCell>
            <TableCell>Duration to</TableCell>
            <TableCell  align="right" >Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {/* user: '',
        request_date: new Date(value.format('YYYY-MM-DD')).toISOString(),
        description: '',
        requested_vehicle_type: '',
        destination: '',
        estimated_duration: '',
        status: 'PENDING', */}
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{`${request.user.fname} ${request.user.mname}`}</TableCell>
              <TableCell>{request.user.department}</TableCell>
              <TableCell>{request.request_date.slice(0, 10)}</TableCell>
              <TableCell>{request.requested_vehicle_type}</TableCell>
              <TableCell>{request.destination}</TableCell>
              <TableCell>{`${request.duration_from.slice(0, 10)} ${request.duration_time_from}`}</TableCell>
              <TableCell>{`${request.duration_to.slice(0, 10)}  ${request.duration_time_to}`}</TableCell>
              <TableCell align="right">{request.status}</TableCell>
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
