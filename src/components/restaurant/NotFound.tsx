// src/components/restaurant/NotFound.tsx
import { Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
        <Utensils className="h-10 w-10 text-amber-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Restaurant Not Found
      </h1>
      
      <p className="text-gray-600 text-lg mb-8">
        The restaurant you're looking for doesn't exist yet. Would you like to create your own?
      </p>
      
      <div className="space-y-4 max-w-md mx-auto">
        <Button className="w-full bg-amber-600 hover:bg-amber-700">
          <Link to="/signup" className="w-full block">
            Create an Account
          </Link>
        </Button>
       
        <p className="text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="text-amber-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          What you'll get with MenuLink
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            'Beautiful digital menu',
            'Online ordering system',
            'Customer management',
            '24/7 support',
            'Marketing tools',
            'Analytics dashboard'
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}