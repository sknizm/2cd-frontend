import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom"



interface PricingProps {
    isWhatsApp: boolean,
    isMembershipInactive : boolean
  }

export default function Pricing2({ isWhatsApp, isMembershipInactive=false }: PricingProps) {
    const navigate  = useNavigate();
    // const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')
  
    const handleCtaClick = (planName: string) => {
      if (isWhatsApp) {
        const message = `Hi, I want to get the ${planName} plan. Please assist me.`
        const whatsappUrl = `https://wa.me/918455838503?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      } else {
        navigate('/signup')
      }
    }
  
    const plans = [
      {
        name: "Monthly Plan",
        price: "₹29",
        description: "Transition from the traditional paper menus to QR code enabled beautiful mobile menu.",
        features: [
          "Unlimited menu items & photos",
          "Get Orders on WhatsApp",
          "Instagram account integration",
          "Free QR code",
          "Full access to all features",
        ],
        cta: "Get Started"
      },
      {
        name: "Yearly Plan",
        price: "₹299",
        originalPrice: "₹588",
        description: "Best value for long-term users",
        features: [
          "Everything in the Monthly Plan",
          "2 months free compared to monthly",
          "Priority support",
          "Annual billing",
          "Save 50%"
        ],
        cta: "Get Started",
        popular: true
      }
    ]
  
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {
            isMembershipInactive?
              <div className="text-center mb-12">
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Subscription, <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">Ended</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             This restaurant's membership has expired. Please renew it.
            </p>
          </div>
            :  <div className="text-center mb-12">
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No hidden fees. Free trial . Start right away.
            </p>
          </div>
          }
        
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 rounded-xl border ${plan.popular ? 'border-amber-300 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-md transition-all`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.originalPrice && (
                    <>
                      <span className="ml-2 text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save 17%</span>
                    </>
                  )}
                  <span className="block text-sm text-gray-500 mt-1">
                    {plan.name.includes('Yearly') ? 'per year' : 'per month'}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCtaClick(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium ${plan.popular ? 'bg-gradient-to-r from-amber-600 to-amber-600 text-white hover:from-amber-700 hover:to-amber-700' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'} transition-all`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
  
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Not sure which plan is right for you?</p>
            <button 
              onClick={() => { window.open(`https://wa.me/918455838503?text=${encodeURIComponent("Hi, I need help choosing a plan")}`, '_blank')
                }
              }
              className="text-amber-600 font-medium hover:underline"
            >
              Contact our team →
            </button>
          </div>
        </div>
      </section>
    )
  }