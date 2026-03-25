"use client"
import Link from 'next/link'
import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, Upload, Image as ImageIcon, ArrowRight, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { RegisterUser } from '@/APIS';
import clsx from 'clsx';

const SignUpPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<{ status: number, message: string }>()
  const [loading, setLoading] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isProfile) {
          setProfileImageURL(reader.result as string);
          setProfileImage(file);
        } else {
          setCoverImage(file);
          setCoverImageURL(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await RegisterUser({
        fullName: formData.username,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        avatar: profileImage,
        coverImage: coverImage
      }, setError, setLoading)
      if (response?.statusCode === 200) {
        router.replace("/signin")
      }
    } catch (error) {
      console.log("signup-> onsubmit error: ", error);
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-4 sm:p-0">
        <div className="bg-[#121212] border border-[#222] rounded-3xl p-8 shadow-2xl relative w-full">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Channel</h1>
            <p className="text-gray-500 text-sm font-medium">Start your journey as a creator today.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">

            {/* Text Inputs */}
            <div className="space-y-4">
              <Input
                icon={User}
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className={clsx(
                  [400].includes(error?.status || 0)
                    ? 'border-red-500/50 ring-1 ring-red-500/50' // ✅ red border always
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                )}
              />
              <Input
                icon={User}
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={clsx(
                  [400, 409].includes(error?.status || 0)
                    ? 'border-red-500/50 ring-1 ring-red-500/50' // ✅ red border always
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                )}
              />
              <Input
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={clsx(
                  [400, 409].includes(error?.status || 0)
                    ? 'border-red-500/50 ring-1 ring-red-500/50' // ✅ red border always
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                )}
              />
              <Input
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={clsx(
                  [400].includes(error?.status || 0)
                    ? 'border-red-500/50 ring-1 ring-red-500/50' // ✅ red border always
                    : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                )}
              />
            </div>

            {/* Profile Photo Section */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Profile Photo</label>
              <div className="flex gap-4 items-center">
                {/* Avatar Preview */}
                <div className="shrink-0 relative">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 overflow-hidden bg-[#181818] transition-all ${profileImage ? 'border-blue-500' : 'border-dashed border-gray-700'}`}>
                    {profileImageURL ? (
                      <img src={profileImageURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-600" />
                    )}
                  </div>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage(null)}
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-xl text-sm font-medium text-gray-300 transition-all duration-200 group w-full"
                  >
                    <div className="bg-blue-500/10 p-1.5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Camera size={16} className="text-blue-400" />
                    </div>
                    <span>Capture</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-xl text-sm font-medium text-gray-300 transition-all duration-200 group w-full"
                  >
                    <div className="bg-purple-500/10 p-1.5 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <Upload size={16} className="text-purple-400" />
                    </div>
                    <span>Upload</span>
                  </button>
                  <input
                    type="file"
                    ref={profileInputRef}
                    className={clsx(
                      [400, 500].includes(error?.status!)
                        ? 'border-red-500/50 ring-1 ring-red-500/50 hidden' // ✅ red border always
                        : 'border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 hidden'
                    )}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                  />
                </div>
              </div>
            </div>

            {/* Cover Photo Section */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Cover Photo</label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className={`relative w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden bg-[#181818] ${coverImage ? 'border-purple-500/50' : 'border-gray-700 hover:border-gray-500 hover:bg-[#1a1a1a]'}`}
              >
                {coverImageURL ? (
                  <>
                    <img src={coverImageURL} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex items-center gap-2 px-3 py-1 bg-black/50 rounded-lg backdrop-blur-sm border border-white/10">
                      <span className="text-xs font-medium text-white">Click to change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
                    <ImageIcon size={18} />
                    <span className="text-sm font-medium">No cover selected</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}

                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 text-white font-semibold 
                py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all 
                duration-300 transform active:scale-[0.98] flex items-center 
                justify-center gap-2
                ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className={error?.message && 'mt-5 text-red-400 font-light'}>
              {error?.message && <p>{error.message}</p>}
            </div>
            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link href={"/signin"} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Singin</Link>
              </p>
            </div>

          </form>

          {/* Camera Modal */}
          {/* <CameraModal
            isOpen={isCameraOpen}
            onClose={() => setIsCameraOpen(false)}
            onCapture={handleCameraCapture}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default SignUpPage