import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = ['Platform', 'Solutions', 'Pricing', 'Resources', 'Company'];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-brand-bg/40 backdrop-blur-md border border-white/5 rounded-full px-6 py-3 shadow-lg">
        {/* Brand Logo: Circular white border (2px) with smaller filled white circle inside */}
        <a href="#" className="flex items-center gap-2.5 text-white no-underline group">
          <div className="w-[22px] h-[22px] rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-180">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">LedgerFlow</span>
        </a>

        {/* Desktop Links Capsule: gray-700 border */}
        <div className="hidden lg:flex items-center bg-white/3 border border-gray-700/80 rounded-full px-6 py-2 shadow-inner">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link}
              </a>
            ))}
            <a
              href="#contact"
              className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors duration-200 border-l border-white/10 pl-5"
            >
              Contact Us
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Mobile Hamburger menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white/80 hover:text-white focus:outline-none transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-[70px] left-6 right-6 bg-brand-bg/95 backdrop-blur-xl border border-white/8 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors py-1.5"
            >
              {link}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1.5 py-1.5 border-t border-white/5 mt-1"
          >
            Contact Us
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </nav>
  );
};
