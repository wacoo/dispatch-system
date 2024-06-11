import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { fetchRefuels } from '../../redux/refuel/refuelSlice';
import { useDispatch, useSelector } from 'react-redux';
import { convertToEthiopianDateTime } from '../../functions/date';

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

export default function RefuelsTable({title}) {
  const refuels = useSelector((state) => state.refuels.refuels) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        // console.log(refuels);
    }, [refuels]);

    React.useEffect(() => {
        dispatch(fetchRefuels());
    }, []);

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell>Request date</TableCell>
            <TableCell>Refuel date</TableCell>
            <TableCell>Fuel type</TableCell>
            <TableCell>KM before refuel</TableCell>
            <TableCell>KM during previous refuel</TableCell>
            <TableCell>KM per liter</TableCell>
            <TableCell>Current fuel level</TableCell>
            <TableCell>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refuels.map((refuel) => (
            <TableRow key={refuel.id}>
              <TableCell>{refuel.id}</TableCell>
              <TableCell>{`(${refuel.vehicle.license_plate}) ${refuel.vehicle.make} ${refuel.vehicle.model} ${refuel.vehicle.year}; ${refuel.vehicle.type}`}</TableCell>
              <TableCell>{convertToEthiopianDateTime(refuel.refuel_request_date)}</TableCell>
              <TableCell>{convertToEthiopianDateTime(refuel.refuel_date)}</TableCell>
              <TableCell>{refuel.fuel_type}</TableCell>
              <TableCell>{refuel.km_during_refuel}</TableCell>
              <TableCell>{refuel.km_during_previous_refuel}</TableCell>
              <TableCell>{refuel.km_per_liter}</TableCell>
              <TableCell>{refuel.current_fuel_level}</TableCell>
              <TableCell>{refuel.remark}</TableCell>
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
