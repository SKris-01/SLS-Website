import { useSignUp, useAuth } from "@clerk/react"
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, CheckCircle2, Loader2, AlertCircle, Tag, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { userId } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (userId) navigate('/')
  }, [userId, navigate])

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.includes('@') &&
    password.length >= 8

  // Button is enabled as long as form is valid and not loading;
  // the isLoaded check happens inside the handler
  const canSubmit = isFormValid && !loading

  // Step 1: Create account and send verification email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    if (!isLoaded || !signUp) {
      setError('Authentication is still initializing. Please wait a moment and try again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await signUp.create({
        firstName,
        lastName,
        username: username.trim() || undefined,
        emailAddress: email,
        password,
      })

      // Clerk v6: send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerifying(true)
      setSuccess('')
    } catch (err: any) {
      console.error('SignUp error:', err)
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Resend code
  const handleResend = async () => {
    if (!isLoaded || !signUp) {
      setError('Authentication not ready. Please wait and try again.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setSuccess('Verification code resent! Please check your inbox (and spam folder).')
    } catch (err: any) {
      console.error('Resend error:', err)
      setError(err.errors?.[0]?.longMessage || err.message || 'Failed to resend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify the 6-digit code — Clerk v6 correct method
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return
    if (!isLoaded || !signUp) {
      setError('Authentication not ready. Please refresh and try again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
      } else {
        console.warn('Verification incomplete:', result.status)
        setError('Verification incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid or expired code. Please try again or resend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white border border-primary/10 shadow-[0_32px_64px_-16px_rgba(91,15,46,0.1)] rounded-[40px] p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
              {verifying ? 'Verify Email' : 'Create Account'}
            </h1>
            <p className="text-primary/40 font-medium text-[10px] uppercase tracking-[0.2em]">
              {verifying ? `Code sent to ${email}` : 'Join Shriyans Lotus Seeds'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold px-5 py-4 rounded-2xl text-center overflow-hidden"
              >
                <AlertCircle className="w-3 h-3 inline-block mr-2 mb-0.5" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold px-5 py-4 rounded-2xl text-center overflow-hidden"
              >
                <CheckCircle2 className="w-3 h-3 inline-block mr-2 mb-0.5" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {!verifying ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 pl-12 pr-4 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 px-5 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Username (optional)"
                  className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 px-14 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 px-14 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 8 characters)"
                  className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 px-14 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Clerk CAPTCHA anchor */}
              <div id="clerk-captcha" className="flex justify-center w-full min-h-[65px]"></div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 ${
                  canSubmit
                    ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    : "bg-primary/30 text-white/60 cursor-not-allowed"
                }`}
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-2">
                <p className="text-primary/50 text-xs font-bold">
                  Enter the 6-digit code from your email.<br />
                  <span className="text-primary/30 font-medium">Check spam/junk if not in inbox.</span>
                </p>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  placeholder="• • • • • •"
                  inputMode="numeric"
                  className="w-full bg-gray-50/50 border-2 border-primary/10 focus:border-primary/40 focus:bg-white text-primary placeholder:text-primary/10 px-6 py-5 rounded-2xl transition-all outline-none font-black text-3xl text-center tracking-[0.8em]"
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setCode(val)
                  }}
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 ${
                  !loading && code.length === 6
                    ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    : "bg-primary/30 text-white/60 cursor-not-allowed"
                }`}
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><CheckCircle2 className="w-4 h-4" /><span>Verify & Sign In</span></>
                }
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center">
            <p className="text-primary/40 font-bold text-[10px] uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-primary hover:underline underline-offset-4 font-black">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUpPage
