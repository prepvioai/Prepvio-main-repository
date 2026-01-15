// src/components/Header.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authstore";
import { Link as ScrollLink } from "react-scroll";
import { DashboardModal } from "../Dashboard/DashBoardPage";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Menu, 
  Search, 
  Bell, 
  Volume2, 
  VolumeX, 
  LayoutDashboard, 
  LogOut, 
  X 
} from 'lucide-react';

const Header = () => {
  // --- CORE STATE & LOGIC ---
  const [isMuted, setIsMuted] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const getInitialsSeed = (fullName) => {
    if (!fullName) return "User";
    const parts = fullName.trim().split(" ");
    return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1]}`;
  };

  // --- EFFECTS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSearchVisible(false);
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchVisible]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearchVisible(true);
  };
  const handleMuteClick = () => setIsMuted(!isMuted);
  const handleNotificationsClick = () => console.log("Notifications clicked!");
  const handleProfileClick = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleDashboardClick = (e) => {
    e.preventDefault();
    setIsDashboardOpen(true);
    setIsProfileDropdownOpen(false);
  };
  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <motion.nav
        ref={headerRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-10 py-4 ${
          isScrolled ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          
          {/* 1. BRANDING - RESPONSIVE LOGOS */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
            {/* ICON LOGO: Always visible (Square Icon) */}
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center overflow-hidden group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-black/20">
              <img 
                className="w-full h-full object-cover" 
                src="/newuilogo1.png" 
                alt="Icon" 
              />
            </div>

            {/* TEXT LOGO: Hidden on mobile, visible on Large screens (md and up) */}
            <div className="hidden md:block">
              <img 
                className="h-10 w-auto object-contain" 
                src="/prepvio (1).png" 
                alt="PrepVio AI" 
              />
            </div>
          </Link>

          {/* 2. ADAPTED CENTER NAV (The "Pill") */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 bg-white/60 backdrop-blur-md px-8 py-3 rounded-full border border-white shadow-lg shadow-gray-200/50">
            <div className="relative flex items-center">
              <AnimatePresence mode="wait">
                {isSearchVisible ? (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center overflow-hidden"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search topics..."
                      className="w-40 bg-transparent border-none focus:ring-0 outline-none text-gray-900 placeholder-gray-400 text-xs"
                    />
                    <button onClick={() => setIsSearchVisible(false)}>
                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-black" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    onClick={handleSearchClick} 
                    className="hover:text-black transition-colors"
                  >
                    <Search className="w-4.5 h-4.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-gray-200"></div>

            <ScrollLink to="about" smooth={true} duration={600} offset={-80} className="cursor-pointer hover:text-black transition-all">
              About
            </ScrollLink>
            <ScrollLink to="explore" smooth={true} duration={600} offset={-80} className="cursor-pointer hover:text-black transition-all">
              Explore
            </ScrollLink>
            <ScrollLink to="faqs" smooth={true} duration={600} offset={-80} className="cursor-pointer hover:text-black transition-all">
              FAQS
            </ScrollLink>

            <div className="flex items-center gap-4 pl-2 border-l border-gray-200">
              <button onClick={handleMuteClick} className="hover:text-black transition-colors">
                {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
              <button onClick={handleNotificationsClick} className="hover:text-black transition-colors">
                <Bell className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* 3. AUTH SECTION */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 bg-white/80 border border-white shadow-sm pl-1 pr-3 py-1 rounded-full hover:shadow-md transition-all backdrop-blur-sm"
                >
                  <img
                    src={user?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(getInitialsSeed(user?.name))}`}
                    alt="User"
                    className="h-8 w-8 rounded-full object-cover border border-gray-100"
                  />
                  <span className="font-bold text-sm text-gray-900 hidden sm:block">{user?.name?.split(" ")[0]}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl border border-white rounded-[1.5rem] shadow-2xl overflow-hidden z-50 p-2"
                    >
                      <button onClick={handleDashboardClick} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                      </button>
                      <div className="h-px bg-gray-100 my-1 mx-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-900 px-4">
                  Sign In
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#1A1A1A] text-white px-7 py-3 rounded-full text-sm font-bold shadow-xl shadow-black/10 hover:bg-black transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden p-3 bg-white rounded-full shadow-md border border-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl mt-4 rounded-3xl border border-gray-100 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-4 font-bold text-gray-600">
                <Link to="/practice" onClick={() => setIsMobileMenuOpen(false)}>Practice</Link>
                <ScrollLink to="about" onClick={() => setIsMobileMenuOpen(false)}>About</ScrollLink>
                <ScrollLink to="explore" onClick={() => setIsMobileMenuOpen(false)}>Explore</ScrollLink>
                {!isAuthenticated && (
                  <Link to="/login" className="pt-4 border-t border-gray-100 text-black">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* DASHBOARD MODAL */}
      {isDashboardOpen && (
        <DashboardModal onClose={() => setIsDashboardOpen(false)} />
      )}
      
      {/* FIXED SPACER */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Header;


// //Backup code hai jab upar wala nahi chale to  src/components/Header.js
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authstore";
// import { Link as ScrollLink } from "react-scroll";
// import { DashboardModal } from "../Dashboard/DashBoardPage";

// const Header = () => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const [isDashboardOpen, setIsDashboardOpen] = useState(false);

//   const { user, isAuthenticated, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const headerRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const profileDropdownRef = useRef(null);

//   const getInitialsSeed = (fullName) => {
//     if (!fullName) return "User";
//     const parts = fullName.trim().split(" ");
//     if (parts.length === 1) return parts[0];
//     return `${parts[0]} ${parts[parts.length - 1]}`;
//   };

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (headerRef.current && !headerRef.current.contains(event.target)) {
//         setIsSearchVisible(false);
//         setIsMobileMenuOpen(false);
//         setIsProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Focus search input when opened
//   useEffect(() => {
//     if (isSearchVisible && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchVisible]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearchClick = (e) => {
//     e.preventDefault();
//     setIsSearchVisible(true);
//   };

//   const handleMuteClick = () => setIsMuted(!isMuted);
//   const handleNotificationsClick = () => console.log("Notifications clicked!");
//   const handleProfileClick = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

//   const handleDashboardClick = (e) => {
//     e.preventDefault();
//     setIsDashboardOpen(true);
//     setIsProfileDropdownOpen(false);
//   };

//   const handleLogout = async () => {
//     await logout();
//     setIsProfileDropdownOpen(false);
//     navigate("/");
//   };

//   return (
//     <>
//       <header
//         ref={headerRef}
//         className={`font-aquire flex justify-center transition-all duration-300 z-50 ${
//           isScrolled ? "fixed top-0 left-0 w-full" : "sticky top-4"
//         }`}
//       >
//         <div
//           className={`${
//             isScrolled
//               ? "w-full rounded-none px-6 md:px-20"
//               : "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] rounded-full"
//           } bg-white/20 backdrop-blur-lg border border-white/10 shadow-lg px-6 h-16 flex items-center justify-between transition-all duration-300 text-black`}
//           style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
//         >
//           <div className="flex flex-1 items-center justify-between">
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <img className="h-12 rounded-lg" src="swaroop.png" alt="LOGO" />
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-6">
//               {/* Search */}
//               <div className="relative">
//                 {!isSearchVisible ? (
//                   <a
//                     href="#"
//                     className="hover:text-gray-800 font-devator"
//                     onClick={handleSearchClick}
//                   >
//                     Search
//                   </a>
//                 ) : (
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder="Search..."
//                     className={`px-4 py-2 rounded-lg bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300 ease-in-out ${
//                       isScrolled ? "w-72" : "w-56"
//                     }`}
//                     style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
//                   />
//                 )}
//               </div>

//               {/* Links */}
//               <ScrollLink
//                 to="about"
//                 smooth={true}
//                 duration={600}
//                 offset={-80}
//                 className="cursor-pointer hover:text-gray-800"
//               >
//                 About
//               </ScrollLink>
//               <ScrollLink
//                 to="explore"
//                 smooth={true}
//                 duration={600}
//                 offset={-80}
//                 className="cursor-pointer hover:text-gray-800"
//               >
//                 Explore
//               </ScrollLink>

//               {/* Mute Button */}
//               <button onClick={handleMuteClick} className="hover:text-gray-800">
//                 {isMuted ? "Unmute" : "Mute"}
//               </button>

//               {/* Notifications */}
//               <button
//                 onClick={handleNotificationsClick}
//                 className="flex items-center hover:text-gray-800"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 17h5l-1.405-1.405C17.653 14.894 17 13.985 17 12V9c0-3.313-2.687-6-6-6S5 5.687 5 9v3c0 1.985-.653 2.894-1.595 3.595L2 17h5m5 0v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3"
//                   />
//                 </svg>
//               </button>

//               {/* Profile / Auth */}
//               {isAuthenticated ? (
//                 <div className="relative" ref={profileDropdownRef}>
//                   <div
//                     className="flex items-center space-x-2 cursor-pointer"
//                     onClick={handleProfileClick}
//                   >
//                     <img
//                       src={
//                         user?.profilePic ||
//                         `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
//                           getInitialsSeed(user?.name)
//                         )}`
//                       }
//                       alt={user?.name || "User"}
//                       className="h-10 w-10 rounded-full object-cover"
//                     />
//                     <span className="font-medium">{user?.name}</span>
//                   </div>

//                   {isProfileDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-md border border-white/10 rounded-md shadow-lg z-50">
//                       <div className="py-1">
//                         <button
//                           onClick={handleDashboardClick}
//                           className="w-full text-left px-4 py-2 hover:bg-white/10"
//                         >
//                           Dashboard
//                         </button>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 hover:bg-white/10"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <Link to="/login" className="hover:text-gray-800">
//                     Login
//                   </Link>
//                   <Link
//                     to="/signup"
//                     className="px-6 py-2 rounded-full font-aquire font-bold 
//              bg-black text-white transition-all duration-300 
//              hover:bg-white/20 hover:text-black hover:backdrop-blur-sm"
//                   >
//                     Get Started
//                   </Link>
//                 </>
//               )}
//             </nav>

//             {/* Mobile Hamburger */}
//             <button
//               className="md:hidden flex items-center justify-center"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Dashboard Modal */}
//       {isDashboardOpen && (
//         <DashboardModal onClose={() => setIsDashboardOpen(false)} />
//       )}
//     </>
//   );
// };

// export default Header;





// // src/components/Header.js
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authstore";
// import { Link as ScrollLink } from "react-scroll";

// const Header = () => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const { user, isAuthenticated, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const headerRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const profileDropdownRef = useRef(null);

//   // ✅ Fix template string for initials
//   const getInitialsSeed = (fullName) => {
//     if (!fullName) return "User";
//     const parts = fullName.trim().split(" ");
//     if (parts.length === 1) return parts[0];
//     return `${parts[0]} ${parts[parts.length - 1]}`;
//   };

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (headerRef.current && !headerRef.current.contains(event.target)) {
//         setIsSearchVisible(false);
//         setIsMobileMenuOpen(false);
//         setIsProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Focus search input when opened
//   useEffect(() => {
//     if (isSearchVisible && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchVisible]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearchClick = (e) => {
//     e.preventDefault();
//     setIsSearchVisible(true);
//   };

//   const handleMuteClick = () => setIsMuted(!isMuted);
//   const handleNotificationsClick = () => console.log("Notifications clicked!");
//   const handleProfileClick = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

//   const handleLogout = async () => {
//     await logout();
//     setIsProfileDropdownOpen(false);
//     navigate("/");
//   };

//   return (
//     <>
//       <header
//         ref={headerRef}
//         className={`font-aquire flex justify-center transition-all duration-300 z-50 ${
//           isScrolled ? "fixed top-0 left-0 w-full" : "sticky top-4"
//         }`}
//       >
//         <div
//           className={`${
//             isScrolled
//               ? "w-full rounded-none px-6 md:px-20"
//               : "w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] rounded-full"
//           } bg-white/20 backdrop-blur-lg border border-white/10 shadow-lg px-6 h-16 flex items-center justify-between transition-all duration-300 text-black`}
//           style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
//         >
//           {/* Centered wrapper */}
//           <div className="flex flex-1 items-center justify-between">
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <img className="h-12 rounded-lg" src="swaroop.png" alt="LOGO" />
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-6">
//               {/* Search */}
//               <div className="relative">
//                 {!isSearchVisible ? (
//                   <a
//                     href="#"
//                     className="hover:text-gray-800 font-devator"
//                     onClick={handleSearchClick}
//                   >
//                     Search
//                   </a>
//                 ) : (
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     placeholder="Search..."
//                     className={`px-4 py-2 rounded-lg bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-300 ease-in-out ${
//                       isScrolled ? "w-72" : "w-56"
//                     }`}
//                     style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.15)" }}
//                   />
//                 )}
//               </div>

//               {/* Links */}
//               <ScrollLink
//                 to="about"
//                 smooth={true}
//                 duration={600}
//                 offset={-80}
//                 className="cursor-pointer hover:text-gray-800"
//               >
//                 About
//               </ScrollLink>
//               <ScrollLink
//                 to="explore"
//                 smooth={true}
//                 duration={600}
//                 offset={-80}
//                 className="cursor-pointer hover:text-gray-800"
//               >
//                 Explore
//               </ScrollLink>

//               {/* Mute Button */}
//               <button onClick={handleMuteClick} className="hover:text-gray-800">
//                 {isMuted ? "Unmute" : "Mute"}
//               </button>

//               {/* Notifications */}
//               <button
//                 onClick={handleNotificationsClick}
//                 className="flex items-center hover:text-gray-800"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 17h5l-1.405-1.405C17.653 14.894 17 13.985 17 12V9c0-3.313-2.687-6-6-6S5 5.687 5 9v3c0 1.985-.653 2.894-1.595 3.595L2 17h5m5 0v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3"
//                   />
//                 </svg>
//               </button>

//               {/* Profile / Auth */}
//               {isAuthenticated ? (
//                 <div className="relative" ref={profileDropdownRef}>
//                   <div
//                     className="flex items-center space-x-2 cursor-pointer"
//                     onClick={handleProfileClick}
//                   >
//                     <img
//                       src={
//                         user?.profilePic ||
//                         `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
//                           getInitialsSeed(user?.name)
//                         )}`
//                       }
//                       alt={user?.name || "User"}
//                       className="h-10 w-10 rounded-full object-cover"
//                     />
//                     <span className="font-medium">{user?.name}</span>
//                   </div>

//                   {isProfileDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-md border border-white/10 rounded-md shadow-lg z-50">
//                       <div className="py-1">
//                         <Link
//                           to="/dashboard"
//                           className="block px-4 py-2 hover:bg-white/10"
//                           onClick={() => setIsProfileDropdownOpen(false)}
//                         >
//                           Dashboard
//                         </Link>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-4 py-2 hover:bg-white/10"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <Link to="/login" className="hover:text-gray-800">
//                     Login
//                   </Link>
//                   <Link
//                     to="/signup"
//                     className="px-6 py-2 rounded-full font-aquire font-bold 
//              bg-black text-white transition-all duration-300 
//              hover:bg-white/20 hover:text-black hover:backdrop-blur-sm"
//                   >
//                     Get Started
//                   </Link>
//                 </>
//               )}
//             </nav>

//             {/* Mobile Hamburger */}
//             <button
//               className="md:hidden flex items-center justify-center"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;











// DUSRA HAI  src/components/Header.js
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authstore"; // 👈 import your auth store

// const Header = () => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const { user, isAuthenticated, logout } = useAuthStore(); // Zustand state
//   const navigate = useNavigate();

//   const headerRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const profileDropdownRef = useRef(null);

//   // Click outside to close menus
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (headerRef.current && !headerRef.current.contains(event.target)) {
//         setIsSearchVisible(false);
//         setIsMobileMenuOpen(false);
//         setIsProfileDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Auto-focus search input
//   useEffect(() => {
//     if (isSearchVisible && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchVisible]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Handlers
//   const handleSearchClick = (e) => {
//     e.preventDefault();
//     setIsSearchVisible(true);
//   };
//   const handleMuteClick = () => setIsMuted(!isMuted);
//   const handleNotificationsClick = () => console.log("Notifications clicked!");
//   const handleProfileClick = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

//   const handleLogout = async () => {
//     await logout();
//     setIsProfileDropdownOpen(false);
//     navigate("/"); // redirect home
//   };

//   return (
//     <>
//       <header
//         ref={headerRef}
//         className={`flex justify-center transition-all duration-300 z-50 ${
//           isScrolled ? "fixed top-0 left-0 w-full" : "sticky top-4"
//         }`}
//       >
//         <div
//           className={`${
//             isScrolled
//               ? "w-full rounded-none px-6 md:px-20"
//               : "w-[90%] md:w-[75%] lg:w-[85%] xl:w-[60%] rounded-full"
//           } bg-white bg-opacity-90 backdrop-blur-lg border border-gray-200 shadow-md px-6 h-16 flex justify-between items-center transition-all duration-300`}
//         >
//           {/* Logo */}
//           <div className="flex flex-row items-center gap-3">
//             <img className="h-12 rounded-lg" src="logo final-Photoroom.png" alt="LOGO" />
//             <h1 className="font-bold text-2xl">Prepvio</h1>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <div className="relative">
//               {!isSearchVisible ? (
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:text-gray-900"
//                   onClick={handleSearchClick}
//                 >
//                   Search
//                 </a>
//               ) : (
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="Search..."
//                   className={`px-4 py-2 rounded-lg focus:outline-none 
//                     focus:ring-1 focus:ring-ring-100 transition-all duration-300 ease-in-out ${
//                       isScrolled ? "w-72" : "w-48"
//                     }`}
//                 />
//               )}
//             </div>

//             <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
//             <a href="#" className="text-gray-600 hover:text-gray-900">Explore</a>

//             <button onClick={handleMuteClick} className="text-gray-600 hover:text-gray-900">
//               {isMuted ? "Unmute" : "Mute"}
//             </button>

//             <button
//               onClick={handleNotificationsClick}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M15 17h5l-1.405-1.405C17.653 14.894 
//                   17 13.985 17 12V9c0-3.313-2.687-6-6-6S5 
//                   5.687 5 9v3c0 1.985-.653 2.894-1.595 
//                   3.595L2 17h5m5 0v3a2 2 0 01-2 
//                   2H9a2 2 0 01-2-2v-3" />
//               </svg>
//             </button>

//             {/* 👇 Conditional Rendering */}
//             {isAuthenticated ? (
//               <div className="relative" ref={profileDropdownRef}>
//                 <div
//                   className="flex items-center space-x-2 cursor-pointer"
//                   onClick={handleProfileClick}
//                 >
//                   <img
//                     src={user?.profilePic || "https://via.placeholder.com/150"}
//                     alt={user?.name || "User"}
//                     className="h-10 w-10 rounded-full object-cover"
//                   />
//                   <span className="font-medium text-gray-800">{user?.name}</span>
//                 </div>
//                 {isProfileDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                     <div className="py-1">
//                       <Link
//                         to="/dashboard"
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
//                         onClick={() => setIsProfileDropdownOpen(false)}
//                       >
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <Link to="/login" className="text-gray-600 hover:text-gray-900">
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
//                 >
//                   Get Started
//                 </Link>
//               </>
//             )}
//           </nav>

//           {/* Mobile Hamburger */}
//           <button
//             className="md:hidden flex items-center justify-center text-gray-700"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? (
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4">
//           <a href="#" className="block text-gray-600 hover:text-gray-900">About</a>
//           <a href="#" className="block text-gray-600 hover:text-gray-900">Explore</a>
//           <button onClick={handleMuteClick} className="block text-gray-600 hover:text-gray-900">
//             {isMuted ? "Unmute" : "Mute"}
//           </button>
//           <button
//             onClick={handleNotificationsClick}
//             className="block text-gray-600 hover:text-gray-900"
//           >
//             Notifications
//           </button>

//           {isAuthenticated ? (
//             <>
//               <Link
//                 to="/dashboard"
//                 className="block text-gray-600 hover:text-gray-900"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Dashboard
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full block text-center bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block text-gray-600 hover:text-gray-900">
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="w-full block text-center bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
//               >
//                 Get Started
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;






// {ORIGINAL }
// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom"; // 👈 import Link

// const Header = () => {
//   const [isMuted, setIsMuted] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const headerRef = useRef(null);
//   const searchInputRef = useRef(null);

//   // Click outside to close search and mobile menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (headerRef.current && !headerRef.current.contains(event.target)) {
//         setIsSearchVisible(false);
//         setIsMobileMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Auto-focus search input
//   useEffect(() => {
//     if (isSearchVisible && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchVisible]);

//   // Detect scroll
//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Handlers
//   const handleSearchClick = (e) => {
//     e.preventDefault();
//     setIsSearchVisible(true);
//   };
//   const handleMuteClick = () => setIsMuted(!isMuted);
//   const handleNotificationsClick = () => console.log("Notifications clicked!");

//   return (
//     <>
//       <header
//         ref={headerRef}
//         className={`flex justify-center transition-all duration-300 z-50 ${
//           isScrolled ? "fixed top-0 left-0 w-full" : "sticky top-4"
//         }`}
//       >
//         <div
//           className={`${
//             isScrolled
//               ? "w-full rounded-none px-6 md:px-20"
//               : "w-[90%] md:w-[75%] lg:w-[85%] xl:w-[60%] rounded-full"
//           } bg-white bg-opacity-90 backdrop-blur-lg border border-gray-200 shadow-md px-6 h-16 flex justify-between items-center transition-all duration-300`}
//         >
//           {/* Logo */}
//           <div className="flex flex-row items-center gap-3">
//             <img className="h-12 rounded-lg" src="logo final-Photoroom.png" alt="LOGO" />
//             <h1 className="font-bold text-2xl">Prepvio</h1>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <div className="relative">
//               {!isSearchVisible ? (
//                 <a
//                   href="#"
//                   className="text-gray-600 hover:text-gray-900"
//                   onClick={handleSearchClick}
//                 >
//                   Search
//                 </a>
//               ) : (
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   placeholder="Search..."
//                   className={`px-4 py-2 rounded-lg  focus:outline-none 
//                     focus:ring-1 focus:ring-ring-100 transition-all duration-300 ease-in-out ${
//                       isScrolled ? "w-72" : "w-48"
//                     }`}
//                 />
//               )}
//             </div>

//             <a href="#" className="text-gray-600 hover:text-gray-900">
//               About
//             </a>
//             <a href="#" className="text-gray-600 hover:text-gray-900">
//               Explore
//             </a>

//             <button onClick={handleMuteClick} className="text-gray-600 hover:text-gray-900">
//               {isMuted ? "Unmute" : "Mute"}
//             </button>

//             <button
//               onClick={handleNotificationsClick}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 17h5l-1.405-1.405C17.653 14.894 17 
//                   13.985 17 12V9c0-3.313-2.687-6-6-6S5 
//                   5.687 5 9v3c0 1.985-.653 2.894-1.595 
//                   3.595L2 17h5m5 0v3a2 2 0 01-2 
//                   2H9a2 2 0 01-2-2v-3"
//                 />
//               </svg>
//             </button>

//             {/* 👇 Use Link instead of a button for navigation */}
//             <Link to="/login" className="text-gray-600 hover:text-gray-900">
//               Login
//             </Link>

//             <Link
//               to="/signup"
//               className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
//             >
//               Get Started
//             </Link>
//           </nav>

//           {/* Mobile Hamburger */}
//           <button
//             className="md:hidden flex items-center justify-center text-gray-700"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? (
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </header>

//       {/* Mobile Menu Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4">
//           <a href="#" className="block text-gray-600 hover:text-gray-900">
//             About
//           </a>
//           <a href="#" className="block text-gray-600 hover:text-gray-900">
//             Explore
//           </a>
//           <button onClick={handleMuteClick} className="block text-gray-600 hover:text-gray-900">
//             {isMuted ? "Unmute" : "Mute"}
//           </button>
//           <button
//             onClick={handleNotificationsClick}
//             className="block text-gray-600 hover:text-gray-900"
//           >
//             Notifications
//           </button>

//           {/* 👇 Mobile menu links */}
//           <Link to="/login" className="block text-gray-600 hover:text-gray-900">
//             Login
//           </Link>

//           <Link
//             to="/signup"
//             className="w-full block text-center bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
//           >
//             Get Started
//           </Link>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;