import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const validateForm = (values) => {
        const newErrors = {};
        
        if (!values.email) {
            newErrors.email = "Email is required";
        }

        if (!values.password || values.password.length < 1) {
            newErrors.password = "Password is required";
        }

        if (!recaptchaToken) {
            newErrors.recaptcha = "Please complete the security verification";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm(formData)) {
            return;
        }

        setLoading(true);
        try {
            const loginData = {
                Email: formData.email,
                Password: formData.password,
                captchaToken: recaptchaToken
            };

            const response = await axios.post('http://localhost:4000/api/login', loginData, {
                withCredentials: true
            });

            if (response.status === 201) {
                navigate('/Profile');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'Invalid email or password. Please try again.';
            setErrors({ login: errorMessage });
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (errors.recaptcha) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.recaptcha;
                return newErrors;
            });
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    navigate("/Profile");
                }
            } catch (error) {
                // User not authenticated, stay on login page
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-2 lg:px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center text-center">
                        {/* Shopping Cart Icon */}
                        <svg className="h-20 w-20 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-1H1m6 12a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900">IIITH Marketplace</h1>
                            <p className="text-lg text-gray-600">Campus Buy & Sell Platform</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                    <h4 className="text-3xl font-bold tracking-tight text-gray-900">
                        Sign in 
                    </h4>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2 text-left py-2">
                                Email address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    required
                                    placeholder="Enter your IIIT email"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.email
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {/* User Icon */}
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-base text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 pr-10 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.password
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        /* Eye Off Icon */
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l.785-.785m4.242 4.242l-.785.785m.785-.785L16.536 15.536" />
                                        </svg>
                                    ) : (
                                        /* Eye Icon */
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-base text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* reCAPTCHA */}
                        <div>
                            <div className={`flex justify-center p-4 rounded-md border ${
                                errors.recaptcha ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                                <ReCAPTCHA
                                    sitekey="6LeAecUqAAAAAPAX0z3PkRc2eVyJsdq5DeXYgNQi"
                                    onChange={handleRecaptchaChange}
                                    onExpired={() => setRecaptchaToken("")}
                                    theme="light"
                                />
                            </div>
                            {errors.recaptcha && (
                                <p className="mt-1 text-base text-red-600">{errors.recaptcha}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>

                        {/* Login Error */}
                        {errors.login && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-base text-red-800">{errors.login}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* New Registration Link */}
                        <div className="text-center">
                            <p className="mt-2 text-base text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                >
                                    Create a new account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;