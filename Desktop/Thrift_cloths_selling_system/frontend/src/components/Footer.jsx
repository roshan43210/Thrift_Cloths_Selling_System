const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">ThriftShop</h3>
            <p className="text-gray-400 text-sm">Your trusted marketplace for pre-loved fashion. Buy and sell thrift clothing easily.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li><a href="/products" className="hover:text-primary">Shop</a></li>
              <li><a href="/seller" className="hover:text-primary">Sell</a></li>
              <li><a href="/chat" className="hover:text-primary">Messages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-gray-400 text-sm">support@thriftshop.com</p>
            <p className="text-gray-400 text-sm">Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ThriftShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

