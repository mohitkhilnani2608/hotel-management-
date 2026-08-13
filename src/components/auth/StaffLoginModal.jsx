import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useRestaurant } from '../../context/RestaurantContext';

export const StaffLoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Login/Register states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');

  // Forgot password states
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Messages
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    loginStaff,
    registerStaff,
    requestStaffPasswordReset,
    verifyStaffResetOtp,
    resetStaffPassword
  } = useRestaurant();

  // -----------------------------
  // Login / Register
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setNotification('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginStaff(email.trim().toLowerCase(), password);
      } else {
        await registerStaff(
          name,
          email.trim().toLowerCase(),
          password,
          role
        );
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

  // -----------------------------
  // Request OTP
  // -----------------------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError('');
    setNotification('');
    setLoading(true);

    try {
      const data = await requestStaffPasswordReset(
        resetEmail.trim().toLowerCase()
      );

      setNotification(
        `🔐 Password Reset Code: ${data.otp}\nThis code will expire in 10 minutes.`
      );

      setResetStep(2);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify OTP
  // -----------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError('');
    setNotification('');
    setLoading(true);

    try {
      await verifyStaffResetOtp(
        resetEmail.trim().toLowerCase(),
        resetOtp.trim()
      );

      setNotification('✅ Reset code verified successfully.');
      setResetStep(3);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Reset Password
  // -----------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError('');
    setNotification('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    try {
      await resetStaffPassword(
        resetEmail.trim().toLowerCase(),
        newPassword
      );

      setNotification(
        '✅ Password reset successfully. You can now login with your new password.'
      );

      // Reset forgot password fields
      setResetEmail('');
      setResetOtp('');
      setNewPassword('');
      setConfirmPassword('');

      setResetStep(1);

      // Go back to login after a short delay
      setTimeout(() => {
        setForgotPassword(false);
        setIsLogin(true);
        setNotification('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Open Forgot Password
  // -----------------------------
  const openForgotPassword = () => {
    setForgotPassword(true);
    setResetStep(1);
    setResetEmail(email);
    setError('');
    setNotification('');
  };

  // -----------------------------
  // Back to Login
  // -----------------------------
  const backToLogin = () => {
    setForgotPassword(false);
    setResetStep(1);
    setResetEmail('');
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setNotification('');
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

              {/* Header */}
              <div className="flex justify-between items-center mb-6">

                <div className="flex items-center space-x-2">
                  {forgotPassword ? (
                    <KeyRound className="w-5 h-5 text-primary" />
                  ) : (
                    <Lock className="w-5 h-5 text-primary" />
                  )}

                  <h2 className="text-2xl font-serif">
                    {forgotPassword
                      ? 'Reset Password'
                      : 'Staff Access'}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Notification */}
              {notification && (
                <div className="mb-4 p-4 bg-primary/10 border border-primary/20 text-primary text-sm rounded-md whitespace-pre-line">
                  {notification}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}

              {/* ==========================================
                  FORGOT PASSWORD
              ========================================== */}

              {forgotPassword ? (

                <>
                  {/* STEP 1 - EMAIL */}
                  {resetStep === 1 && (
                    <form
                      onSubmit={handleForgotPassword}
                      className="space-y-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Enter your registered staff email to receive a
                        password reset code.
                      </p>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Email Address
                        </label>

                        <Input
                          type="email"
                          value={resetEmail}
                          onChange={(e) =>
                            setResetEmail(e.target.value)
                          }
                          placeholder="staff@auradine.com"
                          className="bg-background/50"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading
                          ? 'Sending...'
                          : 'Send Reset Code'}
                      </Button>

                      <button
                        type="button"
                        onClick={backToLogin}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </button>
                    </form>
                  )}

                  {/* STEP 2 - OTP */}
                  {resetStep === 2 && (
                    <form
                      onSubmit={handleVerifyOtp}
                      className="space-y-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit reset code shown in the
                        notification above.
                      </p>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Reset Code
                        </label>

                        <Input
                          type="text"
                          value={resetOtp}
                          onChange={(e) =>
                            setResetOtp(
                              e.target.value.replace(/\D/g, '').slice(0, 6)
                            )
                          }
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="bg-background/50 text-center tracking-widest"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading
                          ? 'Verifying...'
                          : 'Verify Code'}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setResetStep(1);
                          setResetOtp('');
                          setError('');
                          setNotification('');
                        }}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change Email
                      </button>
                    </form>
                  )}

                  {/* STEP 3 - NEW PASSWORD */}
                  {resetStep === 3 && (
                    <form
                      onSubmit={handleResetPassword}
                      className="space-y-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Create a new password for your staff account.
                      </p>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          New Password
                        </label>

                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(e.target.value)
                          }
                          placeholder="Enter new password"
                          className="bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Confirm New Password
                        </label>

                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          placeholder="Confirm new password"
                          className="bg-background/50"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading
                          ? 'Resetting Password...'
                          : 'Reset Password'}
                      </Button>
                    </form>
                  )}
                </>

              ) : (

                /* ==========================================
                   LOGIN / REGISTER
                ========================================== */

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Registration fields */}
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Full Name
                        </label>

                        <Input
                          type="text"
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                          placeholder="John Doe"
                          className="bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Role
                        </label>

                        <select
                          value={role}
                          onChange={(e) =>
                            setRole(e.target.value)
                          }
                          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="Staff">
                            Staff (Restricted Access)
                          </option>

                          <option value="Admin">
                            Admin (Full Access)
                          </option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>

                    <Input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="staff@auradine.com"
                      className="bg-background/50"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>

                    <Input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="bg-background/50"
                      required
                    />
                  </div>

                  {/* Login */}
                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={loading}
                  >
                    {loading
                      ? 'Authenticating...'
                      : isLogin
                        ? 'Login'
                        : 'Create Account'}
                  </Button>

                  {/* Forgot Password */}
                  {isLogin && (
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={openForgotPassword}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Login/Register switch */}
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setNotification('');
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      {isLogin
                        ? 'Need a staff account? Create one.'
                        : 'Already have an account? Login.'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};