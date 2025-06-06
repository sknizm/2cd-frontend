import { Link } from "react-router-dom";

export default function CTA() {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-r from-amber-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your restaurant's menu?</h2>
          <p className="text-xl text-amber-100 mb-8">Join thousands of restaurants serving beautiful digital menus with MenuLink.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1"
            >
              Get Started with 1 Day Free Trial
            </Link>
           
          </div>
        </div>
      </section>
    )
  }