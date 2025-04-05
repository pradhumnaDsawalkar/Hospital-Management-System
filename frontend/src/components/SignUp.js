import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('https://hospital-management-system-de1m.onrender.com/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: 'patient', // Default role for signup
          }),
        });
        if (response.ok) {
          navigate('/login');
        } else {
          const errorData = await response.json();
          console.log('Error data:', errorData); // Add this line to log the error data
          setErrors({ ...errors, submit: errorData.error });
        }
      } catch (error) {
        setErrors({ ...errors, submit: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md">
    {/* Header */}
    <div className="bg-blue-700 text-white rounded-t-xl px-6 py-5 text-center">
      <h2 className="text-2xl font-semibold">Sign Up as a Patient</h2>
      <p className="text-sm text-blue-100 mt-1">Create your account to access health services</p>
    </div>

    {/* Form */}
    <div className="px-6 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              id="firstName" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
              required
            />
            {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              id="lastName" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
              required
            />
            {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
            required
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              value={formData.password} 
              onChange={handleChange} 
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:ring-blue-500 focus:border-blue-500" 
              required
            />
            <button 
              type="button" 
              className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type={showConfirmPassword ? 'text' : 'password'} 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-10 focus:ring-blue-500 focus:border-blue-500" 
              required
            />
            <button 
              type="button" 
              className="absolute top-2.5 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition-colors"
        >
          Create Account
        </button>
      </form>
    </div>

    {/* Footer */}
    <div className="bg-gray-100 rounded-b-xl px-6 py-4 text-center">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:underline">
          Log in
        </button>
      </p>
      {errors.submit && <p className="text-red-600 text-xs mt-1">{errors.submit}</p>}
    </div>
  </div>
</div>


  );
};

export default SignUp;