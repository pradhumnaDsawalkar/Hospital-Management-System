import React, { useState } from 'react';
import { Shield, User, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'patient', label: 'Patient', icon: User },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://hospital-management-system-de1m.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userEmail', email);
        // Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin');
        } else if (data.role === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/patient');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
    {/* Header */}
    <div className="bg-blue-700 px-6 py-5 text-white text-center">
      <h2 className="text-2xl font-semibold">Login to HealthCare Portal</h2>
      <p className="text-sm text-blue-100 mt-1">Access your account</p>
    </div>

    {/* Role Selector */}
    <div className="px-6 pt-6">
      <div className="flex bg-blue-50 border border-blue-100 rounded-lg p-1 mb-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRole === role.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-700 hover:bg-blue-100'
            }`}
          >
            <role.icon size={16} />
            <span>{role.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Login Form */}
    <div className="px-6 pb-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div>
            <p className="text-red-600 text-xs mt-1">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Login as {roles.find((r) => r.id === selectedRole)?.label}
        </button>
      </form>
    </div>

    {/* Footer */}
    <div className="bg-gray-100 px-6 py-4 text-center rounded-b-xl">
      <p className="text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')} className="text-blue-600 font-semibold hover:underline">
          Sign up
        </button>
      </p>
    </div>
  </div>
</div>

  );
};

export default Login;