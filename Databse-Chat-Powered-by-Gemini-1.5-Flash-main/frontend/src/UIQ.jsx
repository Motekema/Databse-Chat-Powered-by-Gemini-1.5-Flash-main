import React from "react";

const StudentTable = () => {
  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-md mt-[1px]">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Student Data
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Data sample in database "PostgreSQL"
      </p>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-medium">ID</th>
              <th className="px-4 py-2 text-left font-medium">Roll No</th>
              <th className="px-4 py-2 text-left font-medium">Score</th>
              <th className="px-4 py-2 text-left font-medium">Gender</th>
              <th className="px-4 py-2 text-left font-medium">City</th>
              <th className="px-4 py-2 text-left font-medium">University</th>
              <th className="px-4 py-2 text-left font-medium">Student Name</th>
              <th className="px-4 py-2 text-left font-medium">Country</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {/* Add your table rows here */}
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">4</td>
              <td className="border px-4 py-2">1004</td>
              <td className="border px-4 py-2">85</td>
              <td className="border px-4 py-2">Male</td>
              <td className="border px-4 py-2">Miami</td>
              <td className="border px-4 py-2">Stanford</td>
              <td className="border px-4 py-2">Tom Black</td>
              <td className="border px-4 py-2">USA</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
