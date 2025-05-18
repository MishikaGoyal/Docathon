import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <div>
      <footer className="border-t border-slate-200 bg-#fdf6f6 py-12 ">
        <div className="container ml-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 ">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-500 bg-clip-text text-transparent">
                  Docathon
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Healthcare meets Technology
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-500 hover:text-pink-600"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-500 hover:text-pink-600"
                  >
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-slate-500 hover:text-pink-600"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-4 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Docathon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
