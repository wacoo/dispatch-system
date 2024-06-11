import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovals } from '../../redux/approval/approvalSlice';

// Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
//   return { id, date, name, shipTo, paymentMethod, amount };
// }

// const rows = [
//   createData(
//     0,
//     '16 Mar, 2019',
//     'Elvis Presley',
//     'Tupelo, MS',
//     'VISA ⠀•••• 3719',
//     312.44,
//   ),
//   createData(
//     1,
//     '16 Mar, 2019',
//     'Paul McCartney',
//     'London, UK',
//     'VISA ⠀•••• 2574',
//     866.99,
//   ),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(
//     3,
//     '16 Mar, 2019',
//     'Michael Jackson',
//     'Gary, IN',
//     'AMEX ⠀•••• 2000',
//     654.39,
//   ),
//   createData(
//     4,
//     '15 Mar, 2019',
//     'Bruce Springsteen',
//     'Long Branch, NJ',
//     'VISA ⠀•••• 5919',
//     212.79,
//   ),
// ];

function preventDefault(event) {
  event.preventDefault();
}

export default function ApprovalTable({title}) {
  const approvals = useSelector((state) => state.approvals.approvals) ?? [];
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(fetchApprovals());
  }, []);

  React.useEffect(() => {
    console.log(approvals);
  }, [approvals]);
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>          
            <TableCell>Approval Date</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvals.map((approval) => (
            /*approval.request.status === 'PENDING'&& */ <TableRow key={approval.id}>
              <TableCell>{approval.id}</TableCell>
              <TableCell>{approval.approval_date.slice(0, 10)}</TableCell>
              <TableCell>{`(${approval.request.id}) ${approval.request.request_date.slice(0, 10)}, ${approval.request.requested_vehicle_type}; ${approval.request.destination};`}</TableCell>
              <TableCell>{`${approval.manager.fname} ${approval.manager.mname}`}</TableCell>
              <TableCell>{approval.request.status}</TableCell>           
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
