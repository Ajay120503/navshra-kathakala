import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon, MessageSquare, Plus } from "lucide-react";
import api from "../../api/axios";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "Not specified";

const MyCustomOrders = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get("/custom-orders/my");
        setRequests(data.data?.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          My Custom Orders
        </h1>
        <Link to="/custom-order" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 card">
          <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg text-neutral-500">
            You have not submitted any custom order requests yet
          </p>
          <Link
            to="/custom-order"
            className="text-primary-500 hover:underline mt-2 inline-block"
          >
            Request a custom order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-neutral-900">
                    {request.occasion || "Custom Order Request"}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Submitted on {formatDate(request.createdAt)}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700 w-fit">
                  {request.status?.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Detail label="Budget" value={request.budget} />
                <Detail label="Deadline" value={formatDate(request.deadline)} />
                <Detail
                  label="Reference Images"
                  value={`${request.referenceImages?.length || 0} uploaded`}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Your Idea</p>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-xs text-neutral-500 mb-1">
                    Admin Follow-up
                  </p>
                  <p className="text-sm font-medium text-neutral-900 mb-2">
                    Status: {request.status?.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {request.adminNotes ||
                      "No admin notes yet. We will update this once your request is reviewed."}
                  </p>
                </div>

                {request.referenceImages?.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-2">
                      Reference Images
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {request.referenceImages.map((image, index) => (
                        <a
                          key={image.publicId || image.url || index}
                          href={image.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100"
                        >
                          {image.url ? (
                            <img
                              src={image.url}
                              alt={`Reference ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-neutral-300 m-5" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-neutral-500">{label}</p>
    <p className="text-sm font-medium text-neutral-900">
      {value || "Not specified"}
    </p>
  </div>
);

export default MyCustomOrders;
