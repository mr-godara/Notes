import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getApiErrorMessage } from '../api/axios.js';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Login failed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 font-black text-slate-950">
            N
          </div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Sign in to Notes</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Continue to your private and shared notes.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <div>
            <input className="input" placeholder="Email" type="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <input className="input" placeholder="Password" type="password" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{' '}
          <Link className="font-semibold text-slate-950 hover:underline dark:text-white" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
