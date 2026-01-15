import React, { useState } from "react"; // Added useState
import { useLocation } from "react-router-dom";
import { Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import TermsModal from "../components/TermsModal.jsx";

/* ================================
   SINGLE SOURCE OF TRUTH (SCALABLE)
================================ */
const SOCIAL_LINKS = [
  {
    name: "Twitter",
    href: "https://www.reddit.com/u/begreatest/s/rteqAa7f87",
    Icon: Twitter,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/swaroop_bhati.11",
    Icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/swaroop-bhati-957a90249?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    Icon: Linkedin,
  },
];

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [openTerms, setOpenTerms] = useState(false);

  /* ================================
      HOME PAGE → BIG FOOTER (LIGHT UI)
     ================================ */
  if (isHomePage) {
    return (
      <footer className="mt-10 bg-white border-t border-gray-100 pt-20 pb-10 rounded-t-[3.5rem] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* BRANDING SECTION */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-black/10">
                  <img src="/newuilogo1.png" alt="Icon" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <img src="/prepvio (1).png" alt="PrepVio" className="h-9 w-auto object-contain" />
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-sm">
                Empowering interview readiness with AI-driven insights and real-world practice.
              </p>
              {/* SOCIAL LINKS */}
              <div className="flex gap-4">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="hover:text-black cursor-pointer">Our Team</li>
                <li className="hover:text-black cursor-pointer">Feedback</li>
                <li onClick={() => setOpenTerms(true)} className="hover:text-black cursor-pointer">Terms & Conditions</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> <span>[Your Address]</span></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> <span>prepvio.ai@gmail.com</span></li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span>+91 7433877151</span></li>
              </ul>
            </div>

            {/* CTA */}
            <div className="md:col-span-4">
              <h4 className="font-bold text-gray-900 mb-6">Start Training</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-black/5" />
                <button className="bg-black text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Go</button>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 PrepVio. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span onClick={() => setOpenTerms(true)} className="hover:text-black cursor-pointer">Privacy Policy</span>
              <span onClick={() => setOpenTerms(true)} className="hover:text-black cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Modal call - Content is now in TermsModal.jsx */}
        <TermsModal isOpen={openTerms} onClose={() => setOpenTerms(false)} />
      </footer>
    );
  }

  /* ================================
      OTHER PAGES → DARK FOOTER
     ================================ */
  return (
    <footer className="w-full bg-black border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/newuilogo4.png" alt="Icon" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block">
            <img src="/prepvio (1).png" alt="PrepVio" className="h-7 w-auto object-contain brightness-0 invert" />
          </div>
        </div>

        <p className="text-xs text-white/50 text-center">© 2025 PrepVio. All rights reserved.</p>

        {/* SOCIAL LINKS */}
        <div className="flex gap-4 text-white/60">
          {SOCIAL_LINKS.map(({ name, href, Icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="hover:text-white transition-colors">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Adding Modal here too so it works on other pages */}
      <TermsModal isOpen={openTerms} onClose={() => setOpenTerms(false)} />
    </footer>
  );
}

export default Footer;





// import React from "react";
// import { useLocation } from "react-router-dom";

// function Footer() {
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   if (isHomePage) {
//     // 👉 Your BIG FOOTER (the code you pasted)
//     return (
//       <div className='w-full bg-[#312d2d] text-white md:content-center md:h-110 xl:block'>
//         <div className='block md:flex justify-between px-6 lg:px-18 xl:upper xl:flex xl:px-30 xl:gap-56 xl:py-12'>
//           <div className='Logo content-center'>
//             <div className='content-center py-4 text-center'>
//               <h1 className='text-3xl font-extrabold sm:text-4xl'>PrepVio</h1>
//               <p>v 1.0.0</p>
//             </div>
//             <div className='px-8 md:hidden'>
//               <hr />
//             </div>
//           </div>

//           <div className='Contact'>
//             <div className='text-center py-4 md:content-center md:text-left'>
//               <h1 className='mb-3 text-2xl font-semibold'>Contact Us</h1>
//               <div className='text-lg'>
//                 <p>Address: [Your Address]</p>
//                 <p>Email: support@[yourwebsite].com</p>
//                 <p>Phone: [+XX-XXXXXXXXXX]</p>
//               </div>
//             </div>
//             <div className='px-8 md:hidden'>
//               <hr />
//             </div>
//           </div>

//           <div className='other-links'>
//             <div className='text-center py-4 md:content-center md:text-left'>
//               <h1 className='mb-3 text-2xl font-semibold'>Other Links</h1>
//               <div className='text-lg'>
//                 <p>Our Team</p>
//                 <p>Feedback</p>
//                 <p>Terms & Conditions</p>
//               </div>
//             </div>
//             <div className='px-8 md:hidden'>
//               <hr />
//             </div>
//           </div>
//         </div>

//         <div className='hidden md:block md:px-8 lg:px-17 xl:block xl:px-30'>
//           <hr />
//         </div>

//         <div className='text-white mt-6 text-center'>
//           <div>
//             <h1 className='text-2xl'>Follow Us</h1>
//             {/* 👉 keep your social icons here (unchanged) */}
//           </div>
//           <h2 className='text-xl mt-2'>Copyright. All rights Reserved</h2>
//         </div>
//       </div>
//     );
//   }

//   // 👉 SMALL FOOTER for all other pages
//   return (
//     <div className='w-full bg-[#312d2d] text-white py-4 text-center'>
//       <h1 className='text-lg font-bold'>PrepVio</h1>
//       <p className='text-sm'>© 2025 PrepVio. All Rights Reserved.</p>
//     </div>
//   );
// }

// export default Footer;