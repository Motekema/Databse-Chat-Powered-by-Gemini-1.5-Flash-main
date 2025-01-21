import React from 'react';

const StudentTable = () => {
  return (
    <div className="container mx-auto p-6">
      <p>Data sample in database "PostgreSQl"</p>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="table-header">ID</th>
            <th className="table-header">Roll No</th>
            <th className="table-header">Score</th>
            <th className="table-header">Gender</th>
            <th className="table-header">City</th>
            <th className="table-header">University</th>
            <th className="table-header">Student Name</th>
            <th className="table-header">Country</th>
          </tr>
        </thead>
        <tbody>
          {/* Add your table rows here */}
          <tr>
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">1001</td>
            <td className="border px-4 py-2">95</td>
            <td className="border px-4 py-2">Female</td>
            <td className="border px-4 py-2">New York</td>
            <td className="border px-4 py-2">NYU</td>
            <td className="border px-4 py-2">Jane Doe</td>
            <td className="border px-4 py-2">USA</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
