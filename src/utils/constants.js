export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

export const ORDER_STATUS = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded',
};

export const ORDER_STATUS_COLORS = {
  placed: 'warning',
  confirmed: 'info',
  packed: 'info',
  shipped: 'primary',
  out_for_delivery: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
  refunded: 'danger',
};

export const CUSTOM_ORDER_STATUS = {
  new: 'New',
  in_discussion: 'In Discussion',
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
};

export const PAYMENT_METHODS = [
  { value: 'razorpay', label: 'Card / UPI / Net Banking (Razorpay)' },
  { value: 'cod', label: 'Cash on Delivery (COD)' },
];

export const OCCASIONS = [
  'birthday', 'anniversary', 'wedding', 'festival',
  'baby-shower', 'corporate', 'valentines-day', 'housewarming',
];

export const CATEGORY_TYPES = ['category', 'occasion'];