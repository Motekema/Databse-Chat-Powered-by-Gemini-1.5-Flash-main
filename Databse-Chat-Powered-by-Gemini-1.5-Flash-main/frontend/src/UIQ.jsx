import React from "react";

const ProductTable = () => {
  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-md mt-[1px]">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Product Data
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Data sample in database "PostgreSQL"
      </p>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Product ID</th>
              <th className="px-4 py-2 text-left font-medium">Product Name</th>
              <th className="px-4 py-2 text-left font-medium">Category ID</th>
              <th className="px-4 py-2 text-left font-medium">Vendor ID</th>
              <th className="px-4 py-2 text-left font-medium">Price</th>
              <th className="px-4 py-2 text-left font-medium">
                Stock Quantity
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {/* Add your table rows here */}
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">Product 1</td>
              <td className="border px-4 py-2">3</td>
              <td className="border px-4 py-2">5</td>
              <td className="border px-4 py-2">$20.50</td>
              <td className="border px-4 py-2">100</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
