const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    total
  });

  await Cart.findByIdAndDelete(cart._id); // Clear cart
  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user items.product');
  res.json(orders);
};
