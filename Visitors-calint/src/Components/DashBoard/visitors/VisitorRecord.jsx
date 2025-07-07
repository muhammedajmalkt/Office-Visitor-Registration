import { UserCircle } from "lucide-react";
import { format } from "date-fns";

const VisitorRecord = ({ visitor, handleVisitorClick, handleManualCheckout, handleUpdateId }) => {
  const getDuration = (inTime, outTime) => {
  if (!outTime) return "N/A";
  const durationMs = new Date(outTime) - new Date(inTime);
  const minutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
};

  return (
    <tr key={visitor._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center ">
          {visitor.imageUrl ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={visitor.imageUrl}
              alt={visitor.name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full ">
              <UserCircle className="h-5 w-5 text-indigo-600" />
            </div>
          )}
          <div className="ml-4 cursor-pointer">
             <div className="text- font-medium text-indigo-600 hover:text-indigo-800 " onClick={() => handleVisitorClick(visitor._id)} >
              {visitor.name}
            </div>
            <div className="text-[10px] text-gray-500">
              {visitor.idType?.toUpperCase() || 'N/A'}: {visitor.idNumber || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center ">
        <div className="text-sm text-gray-900">{visitor.mobile || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-gray-900">
          {visitor.checkInTime ? format(visitor.checkInTime, "MMM dd, h:mm a") : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center ">
        <div className="text-sm text-gray-900">
          {visitor.checkOutTime ? format(visitor.checkOutTime, "MMM dd, h:mm a") : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center ">
  <div className="text-sm text-gray-900 ">
    {getDuration(visitor.checkInTime, visitor.checkOutTime)}
  </div>
</td>

      <td className="px-6 py-4 whitespace-nowrap ">
        <div className="flex justify-center gap-3">
          {visitor.status === 'checked-in' && (
            <button
              onClick={() => handleManualCheckout(visitor._id)}
              className="text-xs px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded"
            >
              Check-out
            </button>
          )}
          <button
            onClick={() => handleVisitorClick(visitor._id)}
            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded"
          >
            Details
          </button>
          <button
            onClick={() => handleUpdateId(visitor._id)}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
          >
            Update ID
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VisitorRecord;