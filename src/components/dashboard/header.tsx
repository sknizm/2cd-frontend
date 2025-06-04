import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import {config} from '@/lib/config';

type DashboardHeaderProps = {
  onOpen: () => void;
};

type Membership = {
  membership: boolean;
  expiry_date: string | null;
  planType: string | null;
};

export const DashboardHeader = ({ onOpen }: DashboardHeaderProps) => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContext must be used within an AppProvider');
  }

  const { token } = context;
  const [membership, setMembership] = useState<Membership | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/check-membership`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch membership');

        const data = await res.json();
        
        setMembership(data);
      } catch (err) {
        console.error('Membership fetch error:', err);
      }
    };

    fetchMembership();
  }, [token]);

 const daysLeft =
  membership?.membership && membership.expiry_date
    ? differenceInDays(parseISO(membership.expiry_date), new Date()) + 1
    : 0;
  
  const isExpired = !membership?.membership || daysLeft <= 0;
  // const currentPlan = membership?.planType || 'Free Trial';

  const showButton = isExpired || (daysLeft > 0 && daysLeft <= 3);

  const buttonLabel = isExpired
    ? 'Membership Expired'
    : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-1"
            onClick={onOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
            <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent">
              MenuLink
            </span>
          </span>
        </div>

        {showButton && (
          <Button
            variant={isExpired ? 'destructive' : 'secondary'}
            onClick={() => navigate('/dashboard/membership')}
            className={`text-sm font-small ${isExpired?" text-white bg-red-500":""}`}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </header>
  );
};
