import { PencilLine, Eye, RefreshCcw } from "lucide-react"

const features = [
  {
    title: "Create a Digital Menu in Minutes",
    description: "Say goodbye to paper menus. Easily build a stunning digital menu that customers can access by scanning a QR code.",
    icon: PencilLine,
    iconColor: "text-amber-500"
  },
  {
    title: "Full Menu Access for Customers",
    description: "Let your customers view your complete menu anytime, anywhere—no app download required.",
    icon: Eye,
    iconColor: "text-indigo-500"
  },
  {
    title: "Instant Real-Time Updates",
    description: "Update your menu on the fly—prices, availability, and items reflect instantly for all customers.",
    icon: RefreshCcw,
    iconColor: "text-amber-500"
  }
]

export default function WebBasedFeatures() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              100% Web-Based Solution
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <strong>No app downloads required</strong> – works perfectly on any smartphone or device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all text-center"
              >
                <div className={`mx-auto mb-6 ${feature.iconColor}`}>
                  <Icon className="w-14 h-14 mx-auto" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
