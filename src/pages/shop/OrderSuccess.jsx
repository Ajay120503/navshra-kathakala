import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="card p-8 md:p-12 text-center">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Order Placed! 🎉
        </h1>
        <p className="text-neutral-500 mb-6">
          Thank you for your order. We'll start working on it right away!
        </p>
        {order && (
          <div className="bg-neutral-50 rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-neutral-900">
                Order #{order.invoiceNumber}
              </span>
              <span className="text-sm text-primary-500 font-medium">
                {order.orderStatus.replace(/_/g, " ")}
              </span>
            </div>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-success">Discount</span>
                  <span className="text-success">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>
                  {order.shippingPrice === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    formatCurrency(order.shippingPrice)
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary-500">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/account/orders" className="btn-primary">
            <Package className="w-4 h-4" /> View Orders
          </Link>
          <Link to="/shop" className="btn-secondary">
            <ArrowRight className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccess;
