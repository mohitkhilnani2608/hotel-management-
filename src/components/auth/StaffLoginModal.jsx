import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useRestaurant } from '../../context/RestaurantContext';

export const StaffLoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginStaff, registerStaff } = useRestaurant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginStaff(email, password);
      } else {
        await registerStaff(name, email, password, role);
      }
      setEmail('');
      setPassword('');
      setName('');
      setRole('Staff');
      onClose();
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden w-full max-w-md relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-serif">Staff Access</h2>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-background/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Staff">Staff (Restricted Access)</option>
                        <option value="Admin">Admin (Full Access)</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@auradine.com"
                    className="bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-background/50"
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Create Account')}
                </Button>
                
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    {isLogin ? "Need a staff account? Create one." : "Already have an account? Login."}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
