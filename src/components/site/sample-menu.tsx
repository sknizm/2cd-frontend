import { Link } from "react-router-dom"
import {
  Utensils,
  QrCode,
  ShoppingCart,
  LineChart
} from "lucide-react"
import { handleContactClick } from "@/lib/utils"

const steps = [
  {
    label: "Create Your Menu",
    description: "Add your dishes, prices, and images in minutes.",
    icon: Utensils,
    bgColor: "bg-amber-50"
  },
  {
    label: "Share via QR or Link",
    description: "Print your QR or share a link with customers.",
    icon: QrCode,
    bgColor: "bg-amber-50"
  },
  {
    label: "Get Orders Instantly",
    description: "Customers place orders directly from your menu.",
    icon: ShoppingCart,
    bgColor: "bg-amber-50"
  },
  {
    label: "Manage & Grow",
    description: "Track orders, update menus, and grow your business.",
    icon: LineChart,
    bgColor: "bg-amber-50"
  }
]

export default function SampleMenu() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Get Started in{' '}
            <span className="relative inline-block">
              <span className="relative z-10">3 Easy Steps</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-100 opacity-70 -z-0"></span>
            </span>
          </h2>
          <p className="text-lg text-amber-600 max-w-2xl mx-auto">
            From setup to receiving orders, everything is quick and seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className={`group ${step.bgColor} p-6 rounded-xl border border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all text-center`}
              >
                <div className="mb-4">
                  <Icon className="w-14 h-14 mx-auto text-amber-600 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.label}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {step.description}
                </p>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors inline-flex items-center"
                >
                  Get Started <span className="ml-1">→</span>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-700 text-white font-semibold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
          >
            Create Your Free Menu Now
          </Link>
          <p className=" flex items-center justify-center mt-4 text-gray-500 text-sm">
            Have questions?{' '}
            <p onClick={handleContactClick} className="text-amber-600 hover:underline">Talk to our team</p>
          </p>
        </div>
      </div>
    </section>
  )
}
