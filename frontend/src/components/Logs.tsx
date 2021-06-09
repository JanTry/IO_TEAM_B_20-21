import { Table } from 'react-bootstrap';

export interface Log {
  studentId: string;
  studentName: string;
  eventType: string;
  time: string;
}

export const logsTable = (logs: Log[]) => (
  <Table striped bordered hover className="mt-5 ml-2" size="sm">
    <thead>
      <tr>
        <th>#</th>
        <th>Time</th>
        <th>Student</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {logs.map((log, i) => (
        <tr>
          <th>{i + 1}</th>
          <th>{log.time}</th>
          <th>{log.studentName}</th>
          <th>{log.eventType}</th>
        </tr>
      ))}
    </tbody>
  </Table>
);
