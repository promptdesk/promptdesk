import React from "react";

interface Variable {
  description: string;
  key: string;
}

interface Organization {
  name: string;
  keys: Variable[];
}

interface OrganizationTableProps {
  organization: Organization | null;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organization,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            style={{ width: "300px" }}
          >
            Organization
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Description
          </th>
          <th
            scope="col"
            className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-left"
            style={{ width: "100px" }}
          >
            API key
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {organization?.keys.map((variable, index) => (
          <tr key={index}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
              {organization.name}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {variable.description}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex">
              {variable.key}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrganizationTable;
