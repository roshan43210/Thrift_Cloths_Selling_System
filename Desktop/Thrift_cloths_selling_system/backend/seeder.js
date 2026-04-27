import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Message from './models/Message.js';
import Cart from './models/Cart.js';
import Wishlist from './models/Wishlist.js';
import { connectDB } from './config/db.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@thrift.com',
    password: '123456',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Seller One',
    email: 'seller@thrift.com',
    password: '123456',
    role: 'seller',
    isVerified: true,
    phone: '9800000001',
    address: 'Kathmandu, Nepal',
    esewaId: 'ESW-SELLER1',
    khaltiId: 'KHL-SELLER1',
  },
  {
    name: 'Buyer One',
    email: 'buyer@thrift.com',
    password: '123456',
    role: 'buyer',
    isVerified: true,
    phone: '9800000002',
    address: 'Lalitpur, Nepal',
    esewaId: 'ESW-BUYER1',
    khaltiId: 'KHL-BUYER1',
  },
  {
    name: 'Jane Seller',
    email: 'jane@thrift.com',
    password: '123456',
    role: 'seller',
    isVerified: true,
    phone: '9800000003',
    address: 'Bhaktapur, Nepal',
  },
];

const sampleProducts = [
  {
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket, slightly worn but great condition. Perfect for layering.',
    price: 1200,
    condition: 'good',
    category: 'men',
    images: ['https://via.placeholder.com/400x400?text=Denim+Jacket'],
    size: 'M',
    brand: 'Levis',
  },
  {
    title: 'Floral Summer Dress',
    description: 'Light and breezy floral dress, ideal for summer days. Like new condition.',
    price: 950,
    condition: 'like new',
    category: 'women',
    images: ['https://via.placeholder.com/400x400?text=Floral+Dress'],
    size: 'S',
    brand: 'Zara',
  },
  {
    title: 'Kids Cartoon T-Shirt',
    description: 'Colorful cartoon print t-shirt for kids. Soft cotton, worn but clean.',
    price: 350,
    condition: 'worn',
    category: 'kids',
    images: ['https://via.placeholder.com/400x400?text=Kids+Tee'],
    size: '4-5Y',
    brand: 'H&M',
  },
  {
    title: 'Formal Black Blazer',
    description: 'Sleek black blazer for formal occasions. Barely worn, like new.',
    price: 2500,
    condition: 'like new',
    category: 'men',
    images: ['https://via.placeholder.com/400x400?text=Black+Blazer'],
    size: 'L',
    brand: 'Van Heusen',
  },
  {
    title: 'Casual Hoodie',
    description: 'Comfy casual hoodie in grey. Good for everyday wear.',
    price: 800,
    condition: 'good',
    category: 'women',
    images: ['https://via.placeholder.com/400x400?text=Grey+Hoodie'],
    size: 'M',
    brand: 'Nike',
  },
  {
    title: 'Traditional Kurta Set',
    description: 'Beautiful traditional kurta with pyjama. Worn once for a wedding.',
    price: 1800,
    condition: 'like new',
    category: 'men',
    images: ['https://via.placeholder.com/400x400?text=Kurta+Set'],
    size: 'XL',
    brand: 'Manyavar',
  },
  {
    title: 'Sportswear Leggings',
    description: 'High-waist sportswear leggings, stretchable and comfortable.',
    price: 650,
    condition: 'good',
    category: 'women',
    images: ['https://via.placeholder.com/400x400?text=Leggings'],
    size: 'M',
    brand: 'Adidas',
  },
  {
    title: 'Baby Romper',
    description: 'Adorable baby romper, soft fabric, good condition.',
    price: 400,
    condition: 'good',
    category: 'kids',
    images: ['https://via.placeholder.com/400x400?text=Baby+Romper'],
    size: '6-9M',
    brand: 'Mothercare',
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();
    await Message.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    const admin = createdUsers[0]._id;
    const seller1 = createdUsers[1]._id;
    const buyer = createdUsers[2]._id;
    const seller2 = createdUsers[3]._id;

    const productsWithSellers = sampleProducts.map((p, i) => ({
      ...p,
      seller: i % 2 === 0 ? seller1 : seller2,
    }));

    const createdProducts = await Product.insertMany(productsWithSellers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Review.deleteMany();
    await Message.deleteMany();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

