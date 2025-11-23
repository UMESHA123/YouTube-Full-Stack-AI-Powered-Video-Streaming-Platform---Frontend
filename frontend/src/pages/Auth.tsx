import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Upload, User, Mail, Lock, X, Image as ImageIcon, ArrowRight, Check } from 'lucide-react';
import { AuthContext } from '../App';

const CameraCapture = ({ onCapture, onClose }: { onCapture: (img: string) => void; onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access camera. Please check permissions.");
                onClose();
            }
        };
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
                // Stop stream
                if (stream) stream.getTracks().forEach(track => track.stop());
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[70] flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#1f1f1f] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-[#161616]">
                    <h3 className="font-bold flex items-center gap-2"><Camera size={18} /> Take Profile Photo</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full"><X size={20}/></button>
                </div>
                <div className="aspect-video bg-black relative">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                </div>
                <div className="p-6 flex justify-center bg-[#161616]">
                    <button 
                        onClick={takePhoto}
                        className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:bg-red-500 transition-colors shadow-lg"
                    >
                        <div className="w-full h-full rounded-full border-2 border-[#161616]"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useContext(AuthContext);
  
  const isSignUp = location.pathname === '/signup';
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up Specific
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setter(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isSignUp) {
          if (!username || !email || !password) return alert("Please fill all fields");
          signup({
              username,
              email,
              password,
              avatar: profilePhoto || 'https://picsum.photos/seed/default/100/100',
              banner: coverPhoto || 'https://picsum.photos/seed/banner/1200/300'
          });
      } else {
          // Sign In
          if (!username || !email || !password) return alert("Please fill all fields");
          login({ username, email, password });
      }
      navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f0f] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        {showCamera && (
            <CameraCapture 
                onCapture={(img) => setProfilePhoto(img)} 
                onClose={() => setShowCamera(false)} 
            />
        )}

        <div className="w-full max-w-md bg-[#161616] border border-gray-800 rounded-2xl shadow-2xl relative z-10 animate-fade-in">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{isSignUp ? 'Create Channel' : 'Welcome Back'}</h1>
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? 'Start your journey as a creator today.' : 'Sign in to manage your channel.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Sign Up Specific Fields */}
                    {isSignUp && (
                        <div className="space-y-4 pt-2 animate-slide-up">
                            {/* Profile Photo */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-[#2a2a2a] overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center flex-shrink-0 relative group">
                                        {profilePhoto ? (
                                            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={32} className="text-gray-600" />
                                        )}
                                        {profilePhoto && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <Check size={24} className="text-green-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setShowCamera(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Camera size={16} /> Capture
                                        </button>
                                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer text-gray-300">
                                            <Upload size={16} /> Upload
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setProfilePhoto)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Photo */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cover Photo</label>
                                <div className="w-full h-24 rounded-xl bg-[#2a2a2a] border-2 border-dashed border-gray-600 overflow-hidden relative group">
                                     {coverPhoto ? (
                                         <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="absolute inset-0 flex items-center justify-center text-gray-500 gap-2 pointer-events-none">
                                             <ImageIcon size={20} /> <span>No cover selected</span>
                                         </div>
                                     )}
                                     <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium gap-2">
                                         <Upload size={18} /> Upload Cover
                                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setCoverPhoto)} />
                                     </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20 mt-6 flex items-center justify-center gap-2"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6 text-center pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button 
                            onClick={() => navigate(isSignUp ? '/signin' : '/signup')} 
                            className="text-blue-400 font-semibold ml-1 hover:underline"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Auth;