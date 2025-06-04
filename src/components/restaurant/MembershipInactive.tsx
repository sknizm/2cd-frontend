// src/components/restaurant/MembershipInactive.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { handleContactClick } from '@/lib/utils';
import Pricing2 from '../site/pricing';

export function MembershipInactive() {
  return (
    <div className="mx-auto  text-center">

      
     <Pricing2 isWhatsApp={true} isMembershipInactive={true}/>
      
      <div className="space-y-4 max-w-md mx-auto">
        <Button className="w-full py-6 text-lg gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
          <Link to="/dashboard" className="w-full block">
            Renew Membership
          </Link>
        </Button>
        
        <p className="text-gray-500 text-sm">
          Need help?{' '}
          <p onClick={handleContactClick} className="text-amber-600 hover:underline">
            Contact support
          </p>
        </p>
      </div>
    </div>
  );
}