import React from "react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* COLUMN 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 cursor-pointer transition">
              About
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Contact
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Message
            </li>
          </ul>
        </div>

        {/* COLUMN 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Help Center
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Privacy Policy
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Home
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Products
            </li>
            <li className="hover:text-indigo-400 cursor-pointer transition">
              Cart
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} E-Store. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;
