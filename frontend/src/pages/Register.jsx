import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await axios.post("http://localhost:5000/api/auth/register", form);
    toast.success("Registration successful! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1500);
  } catch (err) {
    toast.error(err.response?.data?.error || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className={"mb-2"} htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="eg: Basant Bhagat Normal User for Rating"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label className={"mb-2"} htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
  <Input
    id="password"
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={form.password}
    onChange={handleChange}
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

          <div>
            <Label className={"mb-2"} htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Baner Pune"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Registering...
    </div>
  ) : (
    "Register"
  )}
</Button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
