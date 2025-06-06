"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Gem, Check } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

export default function Membership() {
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<null | {
    membership: boolean;
    expiry_date?: string;
    planType?: string | null;
  }>(null);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { token } = context;

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/check-membership`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch membership");

        const data = await res.json();
        setMembership(data);
      } catch (error) {
        console.error("Error fetching membership:", error);
        setMembership(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [token]);

  if (loading) return <BouncingDotsLoader />;
  if (!membership) return <div className="p-4 md:p-8 text-red-500">Unable to load membership info.</div>;

  const daysLeft =
    membership?.membership && membership.expiry_date
      ? differenceInDays(parseISO(membership.expiry_date), new Date()) + 1
      : 0;

  const isExpired = !membership.membership || daysLeft <= 0;
  const isLongTerm = daysLeft > 30;
  const currentPlan = isLongTerm ? "Lifetime Access" : (membership.planType || "Free Trial");

  const plans = [
    {
      name: "Lifetime Access",
      price: "₹49",
      originalPrice: "₹588",
      description: "Best value for long-term users",
      features: [
        "Lifetime Access",
        "Unlimited Visitors",
        "Fast Loading",
        "Upto 3 PDF Menu",
        "No Hidden Charges",
        "Save 80%",
      ],
      cta: "Get Membership",
      popular: true,
    },
  ];

  const handleCtaClick = (planName: string) => {
    const message = `Hi, I want to get the ${planName} in 2cd.site. Please assist me.`;
    const url = `https://wa.me/918455838503?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Plan Status - Only show if not long term and not expired */}
      {!isLongTerm && (
        <Card className="bg-gradient-to-r from-amber-100 via-yellow-50 to-white border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-700 text-xl">
              <Clock className="w-5 h-5" />
              {isExpired
                ? "Plan Expired"
                : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left in your plan`}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700 text-sm">
            {isExpired ? (
              <>Please choose a plan to continue using the service.</>
            ) : (
              <>
                Your current <strong>{currentPlan}</strong> plan expires on{" "}
                <strong>{membership.expiry_date}</strong>.
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      {!isExpired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gem className="text-purple-600" />
                {currentPlan} Plan
              </span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md">
                Current Plan
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            {isLongTerm ? (
              "Enjoy lifetime access to all features. No need to renew!"
            ) : (
              "Enjoy full access to all features. You can upgrade when new plans are available."
            )}
          </CardContent>
        </Card>
      )}

      {/* Pricing Table */}
      {isExpired && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Choose Your <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-gray-600 text-lg">No hidden fees. Start immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 border rounded-xl ${
                  plan.popular ? "border-amber-300 shadow-lg" : "border-gray-200 shadow-sm"
                } hover:shadow-md transition-all`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.originalPrice && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save 80%</span>
                    </>
                  )}
                  <span className="block text-sm text-gray-500 mt-1">
                    {plan.name.includes("Yearly") ? "per year" : "per month"}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCtaClick(plan.name)}
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-600 to-amber-600 text-white hover:from-amber-700 hover:to-amber-700' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'} transition-all`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}