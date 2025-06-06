import { Link } from "react-router-dom";
import menulink from '@/assets/menulink.png'
export default function EmpowerBusiness() {
    return (
      <section className="py-2 md:py-5 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Create & Share
              </span>{' '}
               Your Digital Menu Instantly
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Impress your customers with a sleek, mobile-friendly digital menu. Share it with a simple link or QR code — perfect for restaurants, cafes, food trucks, and cloud kitchens. <b>No app needed!</b>
            </p>
          </div>
  
         <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
  {/* Menu Link Card */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100 w-full max-w-xs text-center transition-all hover:shadow-lg hover:border-amber-200">
    <p className="text-gray-500 text-sm mb-2">Your MenuLink URL</p>
    <p className="text-xl font-bold text-gray-700">
      2cd.site/<span className="text-amber-600">your-menu</span>
    </p>
  </div>

  {/* Divider Text */}
  <div className="text-gray-400 font-medium hidden md:block">OR</div>

  {/* QR Code Image */}
  <div className="w-full max-w-xs text-center">
    <img
      src={menulink}
      alt="QR Code for MenuLink"
      className="w-60 h-60 mx-auto object-contain border border-gray-200 rounded-xl shadow-sm"
    />
    <p className="mt-2 text-sm text-gray-500">Scan QR to view the menu</p>
  </div>
</div>
  
      
  
          <div className="mt-12 text-center">
            <Link 
              to="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700"
            >
              Make Your Digital Menu Now
            </Link>
          </div>
        </div>
      </section>
    )
  }