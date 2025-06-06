import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import hero from '@/assets/hero.png'

export default function Hero() {
    return (
      <section className="w-full bg-gradient-to-b from-amber-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
                Create digital menu
              </span>{' '}
              for your restaurant
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
           Create your digital menu in less than 90 seconds — perfect for restaurants, cafés, hotels, and more
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                
                className="bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Link to={'/signup'}>
                Create Menu →
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-amber-300 text-amber-600 hover:bg-amber-50 gap-2 hover:border-amber-400"
              >
                <a href="https://2cd.site/023fb7bb-8a3a-4ede-bb50-7b64c9055ccd">
                  See Demo →
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-amber-600 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item}
                    className="h-8 w-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-xs font-bold">🍔</span>
                  </div>
                ))}
              </div>
              <span>Trusted by 100+ restaurants worldwide</span>
            </div>
          </div>
          
          {/* YouTube Video Embed */}
       <div className="relative w-full max-w-xl lg:max-w-2xl">
          <img
            src={hero}
            alt="Digital menu example"
            className="w-full h-full object-contain "
          />
        </div>
        </div>
      </section>
    )
}