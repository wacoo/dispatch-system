import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { fetchUsers } from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}


function preventDefault(event) {
  event.preventDefault();
}

export default function DriversTable({title}) {
  const users = useSelector((state) => state.users.users) ?? [];
  const dispatch = useDispatch();
    React.useEffect(() => {
      console.log(users);
    }, [users]);

    React.useEffect(() => {
        dispatch(fetchUsers());
    }, []);
  
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(users) && users.slice(0, 10).map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{`${user.fname} ${user.mname}`}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.access_level}</TableCell>
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
