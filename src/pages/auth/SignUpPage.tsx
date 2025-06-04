import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import { AppContext } from '@/context/AppContext';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
 const context = useContext(AppContext);
  
    if (!context) {
      throw new Error("AppContext must be used within an AppProvider");
    }
  
    const { setToken } = context;
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
      
        try {
          const response = await fetch(`${config.backend_url}/api/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json(); // FIXED: added 'await'
      
          if (!response.ok) {
            console.error('Signup failed:', data);
            setErrorMessage(data.error || 'Signup failed');
            return;
          }else{
   localStorage.setItem("token", data.data.token);
      setToken(data.data.token);
          toast.success('Account Created Successfully');
          navigate('/dashboard'); 
          }
    // Redirect on success
        } catch (error) {
          console.error('Error during signup:', error);
          setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
            <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden border border-amber-100">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                       <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
  <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent">
    MenuLink
  </span>
</span>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-amber-800">Create an Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Join us today and get started
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <p className="text-xs text-gray-500">Minimum 6 characters</p>
                        </div>

                        <Button 
                            disabled={isLoading} 
                            type="submit" 
                            className="w-full bg-amber-600 hover:bg-amber-700 transition-colors duration-200 shadow-md"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : "Get Started"}
                        </Button>

                        {errorMessage && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link 
                            to="/signin" 
                            className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignUpPage;