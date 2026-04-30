import { useSignIn, useAuth } from "@clerk/react"
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'email' | 'reset'

const ForgotPasswordPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { userId } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already signed in, go home
  useEffect(() => {
    if (userId) navigate('/')
  }, [userId, navigate])

  // Step 1: Send the reset code to the user's email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    if (!isLoaded || !signIn) {
      setError('Authentication not ready. Please wait and try again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Clerk v6: create a sign-in attempt with just the identifier first
      await signIn.create({ identifier: email })

      // Find the emailAddressId for the reset_password_email_code strategy
      const emailFactor = signIn.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'reset_password_email_code'
      )

      if (!emailFactor || !('emailAddressId' in emailFactor)) {
        throw new Error('Password reset via email is not supported for this account.')
      }

      // Send the reset code email
      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        emailAddressId: (emailFactor as any).emailAddressId,
      })

      setStep('reset')
    } catch (err: any) {
      console.error('Send reset code error:', err)
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Could not send reset code. Please check your email and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify code and set the new password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6 || password.length < 8) return
    if (!isLoaded || !signIn) {
      setError('Authentication not ready. Please refresh and try again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/')
      } else {
        console.warn('Reset result status:', result.status)
        setError('Password reset incomplete. Please try again.')
      }
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid code or password too weak (min 8 chars, must include letters and numbers).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white border border-primary/10 shadow-[0_32px_64px_-16px_rgba(91,15,46,0.1)] rounded-[40px] p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3">
              {step === 'email' ? 'Reset Password' : 'Set New Password'}
            </h1>
            <p className="text-primary/40 font-medium text-[10px] uppercase tracking-[0.2em]">
              {step === 'email'
                ? 'Enter your registered email to receive a reset code'
                : `Code sent to ${email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-5 py-4 rounded-2xl text-center"
              >
                <AlertCircle className="w-3 h-3 inline-block mr-2 mb-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    placeholder="Registered email address"
                    className="w-full bg-gray-50/50 border border-primary/5 focus:border-primary/20 focus:bg-white text-primary placeholder:text-primary/20 px-14 py-4 rounded-2xl transition-all outline-none font-bold text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.includes('@')}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 ${
                    !loading && email.includes('@')
                      ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      : "bg-primary/30 text-white/60 cursor-not-allowed"
                  }`}
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <><span>Send Reset Code</span><ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="reset-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleReset}
                className="space-y-5"
              >
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

                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password (min 8 chars)"
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

                <button
                  type="submit"
                  disabled={loading || code.length !== 6 || password.length < 8}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 ${
                    !loading && code.length === 6 && password.length >= 8
                      ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      : "bg-primary/30 text-white/60 cursor-not-allowed"
                  }`}
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <><CheckCircle2 className="w-4 h-4" /><span>Update Password & Sign In</span></>
                  }
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setError(''); setCode(''); setPassword('') }}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors cursor-pointer"
                  >
                    ← Try a different email
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center">
            <p className="text-primary/40 font-bold text-[10px] uppercase tracking-widest">
              Remember your password?{' '}
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

export default ForgotPasswordPage
