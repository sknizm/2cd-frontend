import { ChevronDown, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
export default function Header({isLoggedIn=false}) {
    const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  
    return (
      <header className="w-full px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-amber-50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              {/* <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent">
                MenuLink
              </span> */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
  <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent">
    2cd Site
  </span>
</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="#" className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium hover:bg-amber-50 px-3 py-2 rounded-lg">
                Home
              </Link>
              <Link to="#" className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium hover:bg-amber-50 px-3 py-2 rounded-lg">
                Pricing
              </Link>
              <Link to="#" className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium hover:bg-amber-50 px-3 py-2 rounded-lg">
                Sample Menu
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium hover:bg-amber-50 px-3 py-2 rounded-lg"
                >
                  Resources
                  <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-2 border border-amber-100 z-10">
                    <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      Blog
                    </Link>
                    <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      Guides
                    </Link>
                    <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                      Case Studies
                    </Link>
                  </div>
                )}
              </div>
              
              <Link to="#" className="text-gray-700 hover:text-amber-600 transition-colors text-sm font-medium hover:bg-amber-50 px-3 py-2 rounded-lg">
                Contact
              </Link>
            </nav>
          </div>
  
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                {/* <Link 
                  to="/signin" 
                  className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  <span>Sign In</span>
                </Link> */}
                
                <Button 
                  asChild
                  className="bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Link to="/signup">
                    <span>Create Digital Menu </span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    )
  }