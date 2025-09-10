import { useState } from "react";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full px-8 py-4 flex justify-between items-center shadow-sm bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-black">WhiteBoard Share</h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
        <a href="#features" className="hover:text-black transition">Features</a>
        <a href="#how-it-works" className="hover:text-black transition">How it Works</a>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav Dropdown  */}
      {isOpen && (
        <div className="absolute top-16 right-8 bg-white border shadow-md rounded-lg p-4 flex flex-col gap-4 md:hidden">
          <a href="#features" className="hover:text-black transition" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#how-it-works" className="hover:text-black transition" onClick={() => setIsOpen(false)}>How it Works</a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
