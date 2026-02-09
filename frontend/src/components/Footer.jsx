import React from "react";

function Footer() {
  return (
    <footer
      className="bg-gradient-to-br from-slate-900 to-slate-800
                 text-slate-300 mt-20"
    >
      <div
        className="max-w-7xl mx-auto px-6 py-12
                   grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
      >

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 tracking-wide">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">About</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Contact</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Message</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 tracking-wide">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Help Center</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Home</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Products</li>
            <li className="hover:text-indigo-400 hover:translate-x-1 transition cursor-pointer">Cart</li>
          </ul>
        </div>
      </div>

      <div
        className="border-t border-slate-700/60
                   py-4 text-center text-sm text-slate-400"
      >
        <p>&copy; {new Date().getFullYear()} E-Store. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;