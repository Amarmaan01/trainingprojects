import { motion } from 'framer-motion';
import { Flame, Shield, MessageCircle, Heart, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Flame className="w-10 h-10 text-accent" />
          <span className="text-4xl font-bold text-dark-text">
            darkwhisper<span className="text-accent">.</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-dark-text mb-2">
            Welcome Back
          </h1>
          <p className="text-dark-muted mb-8">
            Sign in to share confessions, react, and reply anonymously.
          </p>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </motion.button>

          {/* Features */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-dark-muted">
              <Shield className="w-4 h-4 text-accent shrink-0" />
              <span>Your identity stays completely anonymous</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-dark-muted">
              <MessageCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Post confessions and reply to others</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-dark-muted">
              <Heart className="w-4 h-4 text-accent shrink-0" />
              <span>React to confessions with like, love & laugh</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-dark-muted">
              <Lock className="w-4 h-4 text-accent shrink-0" />
              <span>Edit or delete your posts with a secret code</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-dark-muted/50 mt-6">
          We only use Google to verify you're a real person. Your name is never shown on confessions.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
