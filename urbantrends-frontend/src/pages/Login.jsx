import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Zap,
  Mail,
  Lock,
  User,
  Code,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { useAuth0 } from '@auth0/auth0-react';



export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth0();
  const navigate = useNavigate();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0()


  const roles = [
    {
      id: 'client',
      label: 'Client',
      icon: User,
      description: 'Access your projects and services',
      color: 'from-silver to-dim-grey',
    },
    {
      id: 'developer',
      label: 'Developer',
      icon: Code,
      description: 'Manage your products and sales',
      color: 'from-dim-grey to-gunmetal',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Full platform management',
      color: 'from-gunmetal to-black',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      toast.success('Login successful!');

      // Navigate to appropriate dashboard
      switch (selectedRole) {
        case 'client':
          navigate('/dashboard/client');
          break;
        case 'developer':
          navigate('/dashboard/developer');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    loginWithRedirect({
      connection: "google-oauth2",
      appState: { returnTo: "/client" }
    })

  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-silver/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dim-grey/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Link to="/" className="flex items-center mb-8 gap-x-2 group">
              <img src="/urbantrends.svg" alt="" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-2xl text-silver tracking-tight">
                Urban<span className="text-silver">Trends</span>
              </span>
            </Link>


            <h1 className="text-silver mb-4">Welcome Back</h1>
            <p className="text-dim-grey text-lg mb-8">
              Sign in to access your dashboard and manage your projects, products, or platform.
            </p>
            <br />

            <div className="space-y-4">
              {[
                'Access real-time analytics and insights',
                'Manage projects and track progress',
                'Collaborate with your team',
                'Secure and encrypted data',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-silver to-dim-grey flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-dim-grey">{feature}</span>
                </motion.div>
              ))}
            </div>

          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gunmetal/20 border-dim-grey/30 p-8 backdrop-blur-lg">
              {/* Mobile Branding */}
              <Link to="/" className="flex items-center gap-3 mb-6 lg:hidden group">
                <img src="/urbantrends.svg" alt="" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xl text-silver tracking-tight">
                  Urban<span className="text-silver">Trends</span>
                </span>
              </Link>

              <h2 className="text-silver mb-2">Sign In</h2>
              <p className="text-dim-grey mb-6">Choose your account type and enter your credentials</p>

              {/* Role Selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border transition-all ${selectedRole === role.id
                      ? 'border-silver bg-gradient-to-br from-silver/10 to-dim-grey/10'
                      : 'border-dim-grey/30 hover:border-silver/50'
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mx-auto mb-2`}
                    >
                      <role.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs text-silver">{role.label}</div>
                  </motion.button>
                ))}
              </div>

              {/* Selected Role Description */}
              <div className="mb-6 p-3 rounded-lg bg-black/30 border border-gunmetal">
                <p className="text-dim-grey text-sm">
                  {roles.find((r) => r.id === selectedRole)?.description}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-silver mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim-grey" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-black/50 border-dim-grey/30 text-silver placeholder:text-dim-grey focus:border-silver"
                      required
                    />
                  </div>
                </div>

                <br />


                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-silver text-black hover:bg-silver/90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <br />
                <Button
                  type="button"
                  onClick={() =>
                    loginWithRedirect({
                      connection: "google-oauth2",
                      appState: {
                        returnTo:
                          selectedRole === "developer"
                            ? "/developer"
                            : selectedRole === "admin"
                              ? "/admin"
                              : "/client",
                      },
                    })
                  }
                  className="w-full bg-silver text-black hover:bg-silver/90"
                >
                  Login with Google
                </Button>


              </form>

              <div className="mt-6 text-center">
                <p className="text-dim-grey text-sm">
                  Don't have an account?{' '}
                  <button className="text-silver hover:text-silver/80 transition-colors">
                    Sign up
                  </button>
                </p>
              </div>

              {/* Demo Credentials */}
              {/* <div className="mt-6 p-4 rounded-lg bg-black/30 border border-gunmetal">
                <p className="text-xs text-dim-grey mb-2">Demo Credentials:</p>
                <div className="space-y-1">
                  <p className="text-xs text-silver">Email: any@email.com</p>
                  <p className="text-xs text-silver">Password: any password</p>
                  <p className="text-xs text-dim-grey mt-2">Select a role and use any credentials to login</p>
                </div>
              </div> */}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}