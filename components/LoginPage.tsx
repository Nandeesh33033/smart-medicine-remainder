import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for a 10-digit phone number
    if (/^\d{10}$/.test(phoneNumber)) {
      setError('');
      // In a real app, you would handle Firebase Phone Auth here.
      // For this mock, we'll just log the user in.
      onLogin();
    } else {
      setError('Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">
                Smart Medicine Reminder
            </h1>
            <p className="mt-2 text-gray-500">Caretaker Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">+91</span>
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="9876543210"
                required
                aria-describedby="phone-error"
              />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600" id="phone-error">
                {error}
                </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Login / Sign Up
            </button>
          </div>
        </form>
        <p className="text-xs text-center text-gray-400">
            You will receive an SMS for verification in a real application.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;