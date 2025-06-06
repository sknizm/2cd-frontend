
import CTA from "@/components/site/cta"
import EmpowerBusiness from "@/components/site/emp-business"
import Footer from "@/components/site/footer"
import Header from "@/components/site/header"
import Hero from "@/components/site/hero"
import Pricing2 from "@/components/site/pricing"
import SampleMenu from "@/components/site/sample-menu"
import Testimonials from "@/components/site/testimonials"
import FloatingWhatsAppButton from "@/components/site/whatsapp"

const HomePage = () => {
  return (
    <div className=" min-h-screen">
        <Header/>
        <Hero/>
        <EmpowerBusiness/>
        <SampleMenu/>
        {/* <WebBasedFeatures/> */}
        <Testimonials/>
        <Pricing2 isWhatsApp={false} isMembershipInactive={false}/>
        {/* <FAQ/> */}
        <CTA/>
        <FloatingWhatsAppButton/>
        <Footer/>
        
    </div>
  )
}

export default HomePage