/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Eye, EyeOff } from 'lucide-react';


import {
  XMarkIcon,
  PhoneIcon,
  LockClosedIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import { KalkiSevaLoader } from "../Loader/KalkiSevaLoader";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void; // ✅ Add this
}


export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [currentStep, setCurrentStep] = useState<
    | "login"
    | "register-phone"
    | "verify-otp"
    | "register-password"
    | "reset-password"
    | "reset-otp"
    | "reset-new-password"
  >("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const [redirecting, setRedirecting] = useState(false); // For showing loader before redirect
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);




  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    try {
      switch (currentStep) {
        case "register-phone": {
          if (!phone || phone.trim().length < 10) {
            await Swal.fire({
              title: "Invalid Phone Number",
              text: "Please enter a valid 10-digit phone number.",
              icon: "warning",
              confirmButtonText: "OK",
              customClass: {
                popup: "rounded-lg text-sm",
                confirmButton: "bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600",
              },
              width: 360,
            });
            setLoading(false);
            return;
          }
          const registerResponse = await axios.post(
            `${BASE_URL}/userregister/createAccount`,
            { phonenumber: phone }
          );
          const registerData = registerResponse.data as {
            success: boolean;
            message?: string;
          };
          if (registerData.success) {
            setCurrentStep("verify-otp");
          } else {
            setErrorMessage(registerData.message || "An error occurred");
          }
          break;
        }
  
        case "verify-otp": {
          try {
            const otpValue = Number(otp.join(""));
            const verifyOtpResponse = await axios.post(
              `${BASE_URL}/userregister/verify-otp`,
              {
                phonenumber: phone,
                otp: otpValue,
              }
            );
            const verifyOtpData = verifyOtpResponse.data as {
              success: boolean;
              message?: string;
              error?: string;
            };
            if (verifyOtpData.success) {
              setCurrentStep("register-password");
            } else {
              setErrorMessage(
                verifyOtpData.error ||
                  verifyOtpData.message ||
                  "An error occurred during OTP verification."
              );
            }
          } catch {
            setErrorMessage("Failed to verify OTP. Please try again.");
          }
          break;
        }
  
        case "register-password": {
          try {
            const passwordResponse = await axios.post(
              `${BASE_URL}/userregister/create-password`,
              {
                phonenumber: phone,
                password,
              }
            );
            const passwordData = passwordResponse.data as {
              success: boolean;
              error?: string;
            };
            if (!passwordData.success) {
              setErrorMessage(
                passwordData.error || "Error while setting password"
              );
              return;
            }
  
             const loginResponse = await axios.post(
            `${BASE_URL}/userlogin/login`,
            { phonenumber: phone, password }
          );

          const loginData = loginResponse.data as {
            success: boolean;
            message?: string;
            token?: string;
            userid?: string;
            username?: string;
          };

          if (loginData.success && loginData.token) {
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("userId", loginData.userid || "");
            localStorage.setItem("username", loginData.username || "");
            window.dispatchEvent(new Event("userProfileUpdated")); // ✅ trigger Navigation update
          
            await Swal.fire({
              title: "Login Successful!",
              text: "You have been logged in successfully.",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
              width: 360,
            });
            
            // ✅ Trigger redirecting loader
            setRedirecting(true);
            
            // ✅ Delay to show loader before redirect
            setTimeout(() => {
              onLoginSuccess?.();
              onClose(); // Close the modal
              navigate("/");  // Or use `navigate("/dashboard")`
            }, 1500); // match Swal timer
            
            
          
          } else {
            await Swal.fire({
              title: "Login Failed",
              text: loginData.message || "Invalid phone number or password.",
              icon: "error",
              confirmButtonText: "Retry",
              customClass: {
                popup: "rounded-lg text-sm",
                confirmButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
              },
              width: 360,
            });
          }
        } catch {
          await Swal.fire({
            title: "Something went wrong",
            text: "Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "rounded-lg text-sm",
              confirmButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
            },
            width: 360,
          });
        } finally {
          setLoading(false);
        }
        break;
      }

  
      case "reset-password": {
        if (!phone || phone.trim().length !== 10) {
          await Swal.fire({
            title: "Invalid Phone Number",
            text: "Please enter a valid 10-digit number.",
            icon: "warning",
            confirmButtonText: "OK",
            width: 360,
          });
          setLoading(false);
          return;
        }
      
        try {
          const sendOtpResponse = await axios.post(
            `${BASE_URL}/userregister/reset-password-send-otp`, // Corrected URL with prefix
            { phonenumber: phone }
          );
      
          const sendOtpData = sendOtpResponse.data as { success: boolean; message?: string };

      
          if (sendOtpData.success) {
            await Swal.fire({
              title: "OTP Sent",
              text: "An OTP has been sent to your registered number.",
              icon: "success",
              confirmButtonText: "OK",
              width: 360,
            });
            setCurrentStep("reset-otp");
          } else {
            await Swal.fire({
              title: "Error",
              text: sendOtpData.message || "Could not send OTP",
              icon: "error",
              confirmButtonText: "OK",
              width: 360,
            });
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Request Failed",
            text:
              error?.response?.data?.message ||
              "Something went wrong while sending OTP",
            icon: "error",
            confirmButtonText: "OK",
            width: 360,
          });
        }
        break;
      }
      
  
      case "reset-otp": {
        try {
          const response = await axios.post(
            `${BASE_URL}/userregister/verify-reset-otp`, // Corrected URL
            {
              phonenumber: phone,
              otp: otp.join(""),
            }
          );
      
          const responseData = response.data as { success: boolean; message?: string };
          if (responseData.success) {
            await Swal.fire({
              title: "OTP Verified",
              text: "Now you can reset your password.",
              icon: "success",
              confirmButtonText: "OK",
              width: 360,
            });
            setCurrentStep("reset-new-password");
          } else {
            await Swal.fire({
              title: "Invalid OTP",
              text: (response.data as { message?: string }).message || "OTP is not valid.",
              icon: "error",
              confirmButtonText: "Retry",
              width: 360,
            });
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Verification Failed",
            text: error?.response?.data?.message || "Something went wrong.",
            icon: "error",
            confirmButtonText: "OK",
            width: 360,
          });
        }
        break;
      }
      case "reset-new-password": {
        try {
          const res = await axios.put(`${BASE_URL}/userregister/reset-password`, {
            phonenumber: phone,
            newPassword: password,
            confirmPassword: password,
          });
      
          const responseData = res.data as { success: boolean; message?: string };
          if (responseData.success) {
            await Swal.fire({
              title: "Password Updated",
              text: "Your password has been successfully reset.",
              icon: "success",
              confirmButtonText: "Login",
              width: 360,
            });
            setCurrentStep("login");
          } else {
            await Swal.fire({
              title: "Reset Failed",
              text: (responseData as { message?: string }).message || "Could not reset password",
              icon: "error",
              confirmButtonText: "Retry",
              width: 360,
            });
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Reset Failed",
            text: error?.response?.data?.message || "An error occurred",
            icon: "error",
            confirmButtonText: "Retry",
            width: 360,
          });
        }
        break;
      }
            
  
        default: {
          try {
            const loginResponse = await axios.post(
              `${BASE_URL}/userlogin/login`,
              { phonenumber: phone, password }
            );
  
            const loginData = loginResponse.data as {
              success: boolean;
              message?: string;
              token?: string;
              userid?: string;
              username?: string;
            };
  
            if (loginData.success && loginData.token) {
              localStorage.setItem("token", loginData.token);
              localStorage.setItem("userId", loginData.userid || "");
              localStorage.setItem("username", loginData.username || "");
              window.dispatchEvent(new Event("userProfileUpdated")); // ✅ trigger Navigation update
  
              await Swal.fire({
                title: "Login Successful!",
                text: "You have been logged in successfully.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                width: 360,
              });
              
              // ✅ Trigger redirecting loader
              setRedirecting(true);
              
              // ✅ Delay to show loader before redirect
              setTimeout(() => {
                onLoginSuccess?.();
                onClose(); // Close the modal
                navigate("/");  // Or use `navigate("/dashboard")`
              }, 1500); // match Swal timer
               

            } else {
              await Swal.fire({
                title: "Login Failed",
                text: loginData.message || "Invalid phone number or password.",
                icon: "error",
                confirmButtonText: "Retry",
                customClass: {
                  popup: "rounded-lg text-sm",
                  confirmButton:
                    "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
                },
                width: 360,
              });
            }
          } catch (error) {
            let errorMessage = "Something went wrong. Please try again.";
            if (
              typeof error === "object" &&
              error !== null &&
              "response" in error &&
              typeof (error as any).response?.data?.message === "string"
            ) {
              errorMessage = (error as any).response.data.message;
            }
  
            await Swal.fire({
              title: "Login Failed",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "Retry",
              customClass: {
                popup: "rounded-lg text-sm",
                confirmButton:
                  "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
              },
              width: 360,
            });
          }
          break;
        }
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  
  

  const formClasses =
    "flex flex-col space-y-4 p-6 border-2 border-gray-100 rounded-xl";
  const inputClasses =
    "mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 text-base";
  const buttonClasses =
    "w-full py-3 px-4 text-base border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";

  const renderStep = () => {
    switch (currentStep) {
      case "register-phone":
        return (
          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label
                htmlFor="register-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="relative mt-1">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="register-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep("login")}
              className="w-full text-primary hover:text-primary/90 text-base"
            >
              Back to Login
            </button>
          </form>
        );

      case "verify-otp":
      case "reset-otp":
        return (
          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Enter OTP sent to {phone}
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl rounded-lg border-2 border-gray-200 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                  />
                ))}
              </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
            <div className="text-center space-y-3">
              <button
                type="button"
                className="text-primary hover:text-primary/90"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentStep(
                    currentStep === "verify-otp"
                      ? "register-phone"
                      : "reset-password"
                  )
                }
                className="block w-full text-primary hover:text-primary/90"
              >
                Back
              </button>
            </div>
          </form>
        );

      case "register-password":
      case "reset-new-password":
        return (
          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Set Password
              </label>
              <div className="relative mt-1">
                <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
  type={showPassword ? 'text' : 'password'}
  id="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className={`${inputClasses} pl-10 pr-10`}
  placeholder="Enter new password"
  required
/>
<div
  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</div>

<div
  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</div>


              </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {currentStep === "register-password"
                ? "Complete Registration"
                : "Reset Password"}
            </button>
          </form>
        );

      case "reset-password":
        return (
          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label
                htmlFor="reset-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="relative mt-1">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="reset-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Sending Reset OTP..." : "Send Reset OTP"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep("login")}
              className="w-full text-primary hover:text-primary/90 text-base"
            >
              Back to Login
            </button>
          </form>
        );

      default: // login
        return (
          <form onSubmit={handleSubmit} className={formClasses}>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="relative mt-1">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${inputClasses} pl-10`}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
  type={showPassword ? 'text' : 'password'}
  id="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className={`${inputClasses} pl-10 pr-10`}
  placeholder="Enter your password"
  required
/>
<div
  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</div>

              </div>
            </div>
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => setCurrentStep("register-phone")}
                className="text-primary hover:text-primary/90 text-base"
              >
                Don't have an account? Register
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep("reset-password")}
                className="block w-full text-primary hover:text-primary/90 text-base"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        );
    }
  };

  if (redirecting) {
    return <KalkiSevaLoader />;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 flex justify-between items-center mb-6"
                >
                  {currentStep === "login" && "Welcome Back"}
                  {currentStep === "register-phone" && "Create Account"}
                  {currentStep === "verify-otp" && "Verify OTP"}
                  {currentStep === "register-password" && "Set Password"}
                  {currentStep === "reset-password" && "Reset Password"}
                  {currentStep === "reset-otp" && "Verify OTP"}
                  {currentStep === "reset-new-password" && "Create New Password"}

                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                      {errorMessage}
                    </div>
                  )}
                  {renderStep()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
