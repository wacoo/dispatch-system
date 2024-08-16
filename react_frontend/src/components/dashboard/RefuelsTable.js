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


function preventDefault(event) {
  event.prevetDefault();
}

export default function RefuelsTable({title}) {
  const refuels = useSelector((state) => state.refuels.refuels) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
        console.log(refuels);
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
            <TableCell>Req. date</TableCell>
            <TableCell>Refuel date</TableCell>
            <TableCell>Benzine</TableCell>
            <TableCell>Nafta</TableCell>
            <TableCell>KM/B/Refuel</TableCell>
            <TableCell>KM/D/P/Refuel</TableCell>
            <TableCell>Fuel level</TableCell>
            <TableCell>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refuels.slice(0, 10).map((refuel) => (
            <TableRow key={refuel.id}>
              <TableCell>{refuel.id}</TableCell>
              <TableCell>{`(${refuel.vehicle.license_plate}) ${refuel.vehicle.make} ${refuel.vehicle.model} ${refuel.vehicle.year}; ${refuel.vehicle.type}`}</TableCell>
              <TableCell>{convertToEthiopianDateTime(refuel.refuel_request_date)}</TableCell>
              <TableCell>{convertToEthiopianDateTime(refuel.refuel_date)}</TableCell>
              <TableCell>{refuel.benzine}</TableCell>
              <TableCell>{refuel.nafta}</TableCell>
              <TableCell>{refuel.km_during_refuel}</TableCell>
              <TableCell>{refuel.km_during_previous_refuel}</TableCell>
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
