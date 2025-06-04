import { Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">
                  MenuLink
                </span>
              </h3>
              <p className="mb-6">Beautiful digital menus for restaurants, cafes, hotels, and more.</p>
              <div className="flex space-x-4">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                  <Link 
                    key={social}
                    to="#" 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social}
                  >
                    {social}
                  </Link>
                ))}
              </div>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Examples', 'Integrations'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Blog', 'Guides', 'Help Center', 'API Docs'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
  
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Contact', 'Legal'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>123 Restaurant Lane, Foodville, FK 12345</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="mailto:hello@menulink.com" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5 mr-2" /> hello@menulink.com
              </Link>
              <Link to="tel:+18005551234" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Phone className="h-5 w-5 mr-2" /> (800) 555-1234
              </Link>
            </div>
          </div>
  
          <div className="mt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} MenuLink. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    )
  }