// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense, useContext } from 'react';// Recommended for au
import BouncingDotsLoader from './components/ui/bounce-loader';
import HomePage from './pages/main-site/HomePage';
import  { AppContext } from './context/AppContext';
import { AdminPage } from './pages/adminboard/AdminPage';
import { OverviewPage } from './pages/adminboard/OverViewPage';
import { UsersPage } from './pages/adminboard/UsersPage';
import CartPage from './pages/public-site/CartPage';
import MembershipsPage from './pages/adminboard/MembershipPage';
import { config } from './lib/config';
import Membership from './pages/dashboard/membership';
import PDFListPage from './pages/dashboard/allpdfs';
import PdfUploadForm from './pages/dashboard/addpdf';
import PdfPage from './pages/public-site/PdfPage';

// Lazy load pages for performance
const SignInPage = lazy(() => import('@/pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard'));
const RestaurantSettingsPage = lazy(() => import('@/pages/dashboard/setting'));

function App() {
  const context = useContext(AppContext);
const user = context?.user;
const isAdmin = user?.email === config.admin_email;
  return (

    
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={<BouncingDotsLoader/>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
  path="/:slug"
  element={
      <PdfPage />
  }
/>
<Route
  path="/:slug/cart"
  element={
      <CartPage />
  }
/>

            {/* Main Site */}
            
            <Route path="/" element={<HomePage/>} />
            
            {/* Protected Onboarding Route */}
            <Route 
              path="/onboarding" 
              element={ user?
                  <OnboardingPage  />:<SignUpPage />
              } 
            />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                
                  <DashboardPage />
              }
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<PDFListPage/>} />
              <Route path="pdf/create" element={<PdfUploadForm />} />
              <Route path="pdf/create/:id" element={<PdfUploadForm />} />
              <Route path="membership" element={<Membership />}/> 
              <Route path="restaurant" element={<RestaurantSettingsPage />} />
            </Route>
            
            {/* Root Redirect */}

            
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/adminboard" 
              element={
                isAdmin ?
                  <AdminPage />:<SignInPage/>
              }
            >
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="memberships" element={<MembershipsPage />} />
            </Route>
            
            {/* Root Redirect */}


            {/* <Route path="/" element={<Navigate to="/dashboard/home" replace />} /> */}
            
            {/* 404 Route */}
            {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
          </Routes>
        </Suspense>
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-center" 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;