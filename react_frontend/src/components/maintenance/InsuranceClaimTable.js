import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { fetchVehicles } from '../../redux/vehicle/vehicleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintRequests } from '../../redux/maintenance_request/maintRequestSlice';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function MaintRequestTable({title}) {

  const maint_requests = useSelector((state) => state.maint_requests.maintRequests.results) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        console.log(maint_requests);
    }, [maint_requests]);

    React.useEffect(() => {
        dispatch(fetchMaintRequests());
    }, []);
  
  return (
    <React.Fragment>
      {/* <Title>{title}</Title> */}
      <Table size="small">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Make</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Year</TableCell>
            <TableCell align="right">License plate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(maint_requests) && maint_requests.slice(0, 10).map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.id}</TableCell>
              <TableCell>{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell align="right">{`${vehicle.license_plate}`}</TableCell>
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
