import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, Search, Video as VideoIcon, Bell, User, LogOut, Upload, Twitter, LayoutGrid, PlaySquare, Film, X, Home as HomeIcon, LogIn } from 'lucide-react';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { CURRENT_USER } from './constants';
import type { User as UserType } from './types';

// --- Auth Context ---
interface AuthContextType {
    currentUser: UserType | null;
    login: (credentials: any) => void;
    signup: (data: any) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => {},
    signup: () => {},
    logout: () => {},
});

// --- Upload Context ---
interface UploadContextType {
  isUploading: boolean;
  progress: number;
  startUpload: (fileName: string) => void;
  fileName: string;
}

export const UploadContext = createContext<UploadContextType>({
  isUploading: false,
  progress: 0,
  startUpload: () => {},
  fileName: ''
});

const GlobalUploadProgress = () => {
    const { isUploading, progress, fileName } = useContext(UploadContext);
    
    if (!isUploading) return null;

    return (
        <div className="fixed bottom-0 right-8 w-96 bg-[#1f1f1f] border border-gray-700 rounded-t-xl shadow-2xl z-[100] animate-slide-up">
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white truncate max-w-[200px]">Uploading: {fileName}</span>
                    <span className="text-xs text-gray-400">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                   <span>{progress < 100 ? "Please keep this tab open" : "Processing complete"}</span>
                   {progress === 100 && <span className="text-green-400 font-bold">Done</span>}
                </div>
            </div>
        </div>
    )
}

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-gray-800 h-14 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-800 rounded-full text-white">
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          <div className="bg-red-600 text-white p-1 rounded-lg">
            <PlaySquare size={20} className="fill-white" />
          </div>
          <span>StreamGenAI</span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-4">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-gray-700 rounded-l-full px-4 py-2 focus:border-blue-500 outline-none shadow-inner"
          />
          <button className="bg-[#222] border border-l-0 border-gray-700 rounded-r-full px-5 hover:bg-[#333]">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
            <>
                <button onClick={() => navigate('/dashboard')} className="hidden sm:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
                   <Upload size={16} /> Create
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f0f0f]"></span>
                </button>
                <div className="relative">
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="w-8 h-8 rounded-full overflow-hidden border border-gray-700"
                    >
                      <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                    </button>
                    {showUserMenu && (
                        <div className="absolute right-0 top-10 w-48 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-400">@handle</p>
                            </div>
                            <button onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2">
                                <VideoIcon size={16} /> Dashboard
                            </button>
                            <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <Link to="/signin" className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 rounded-full text-sm font-medium text-blue-400 transition-colors">
                <div className="p-0.5 border border-blue-400 rounded-full">
                    <User size={12} className="fill-blue-400" />
                </div>
                Sign In
            </Link>
        )}
      </div>
    </header>
  );
};

interface SidebarProps {
    isOpen: boolean;
    isOverlay: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isOverlay, onClose }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path ? "bg-gray-800 font-semibold text-white" : "hover:bg-gray-800 text-gray-300";

    const baseClasses = "fixed left-0 top-14 bottom-0 bg-[#0f0f0f] overflow-y-auto p-2 scrollbar-thin transition-transform duration-300 z-40 w-60 border-r border-gray-800";
    const visibilityClass = isOpen ? "translate-x-0" : "-translate-x-full";
    const overlayClass = isOverlay ? "shadow-2xl" : "";

    return (
        <>
            {/* Backdrop for overlay mode */}
            {isOverlay && isOpen && (
                <div className="fixed inset-0 bg-black/50 z-30" onClick={onClose} />
            )}
            
            <aside className={`${baseClasses} ${visibilityClass} ${overlayClass}`}>
                <nav className="space-y-1">
                    <Link to="/" onClick={isOverlay ? onClose : undefined} className={`flex items-center gap-4 px-3 py-2 rounded-lg ${isActive('/')}`}>
                        <HomeIcon size={20} /> Home
                    </Link>
                    <Link to="/channel/shorts" onClick={isOverlay ? onClose : undefined} className={`flex items-center gap-4 px-3 py-2 rounded-lg ${isActive('/channel/shorts')}`}>
                        <Film size={20} /> Shorts
                    </Link>
                    <Link to="/channel/subs" onClick={isOverlay ? onClose : undefined} className={`flex items-center gap-4 px-3 py-2 rounded-lg ${isActive('/channel/subs')}`}>
                        <User size={20} /> Subscriptions
                    </Link>
                    <hr className="border-gray-800 my-2" />
                    <h3 className="px-3 text-sm font-semibold text-gray-400 mb-1">You</h3>
                    <Link to="/dashboard" onClick={isOverlay ? onClose : undefined} className={`flex items-center gap-4 px-3 py-2 rounded-lg ${isActive('/dashboard')}`}>
                        <VideoIcon size={20} /> Your Videos
                    </Link>
                </nav>
            </aside>
        </>
    )
}

const AppLayout = () => {
    const location = useLocation();
    const isWatchPage = location.pathname.startsWith('/watch');
    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
    
    // Sidebar logic: 
    // - On large screens: default open, unless watch page.
    // - On small screens: default closed.
    const [isSidebarOpen, setSidebarOpen] = useState(!isWatchPage && !isAuthPage);

    // Effect: Close sidebar automatically when entering watch page on mobile or desktop default
    useEffect(() => {
        if (isWatchPage || isAuthPage) {
            setSidebarOpen(false);
        } else {
            // Restore sidebar on other pages if on desktop
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            }
        }
    }, [location.pathname, isWatchPage, isAuthPage]);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
                <Routes>
                    <Route path="/signin" element={<Auth />} />
                    <Route path="/signup" element={<Auth />} />
                </Routes>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
          <Header toggleSidebar={toggleSidebar} />
          <div className="flex">
              <Sidebar 
                isOpen={isSidebarOpen} 
                isOverlay={isWatchPage || window.innerWidth < 768} 
                onClose={() => setSidebarOpen(false)}
              />
              {/* Main Content: Add margin-left only if sidebar is docked (not overlay) */}
              <main 
                className={`flex-1 transition-all duration-300 w-full ${!isWatchPage && isSidebarOpen ? 'md:ml-60' : ''}`}
              >
                   <Routes>
                       <Route path="/" element={<Home />} />
                       <Route path="/watch/:videoId" element={<Watch />} />
                       <Route path="/channel/:channelId" element={<Channel />} />
                       <Route path="/dashboard" element={<Dashboard />} />
                       {/* Redirect legacy links if any */}
                       <Route path="*" element={<Navigate to="/" />} />
                   </Routes>
              </main>
          </div>
          <GlobalUploadProgress />
        </div>
    );
}

const App = () => {
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  // Auth State - Defaulting to null to demonstrate sign-in page
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const startUpload = (file: string) => {
    setIsUploading(true);
    setFileName(file);
    setProgress(0);
    
    // Simulate upload
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(() => setIsUploading(false), 5000); // Wait longer to show "Done"
                return 100;
            }
            return prev + Math.floor(Math.random() * 15) + 5;
        });
    }, 400);
  };

  const login = (credentials: any) => {
      // Mock login - strictly using credentials for show
      console.log("Logging in with", credentials);
      setCurrentUser(CURRENT_USER);
  };

  const signup = (data: any) => {
      // Mock signup
      console.log("Signing up with", data);
      const newUser: UserType = {
          id: `u${Date.now()}`,
          name: data.username,
          avatar: data.avatar,
          banner: data.banner,
          subscribers: '0',
          description: 'New creator'
      };
      setCurrentUser(newUser);
  };

  const logout = () => {
      setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
        <UploadContext.Provider value={{ isUploading, progress, startUpload, fileName }}>
          <Router>
            <AppLayout />
          </Router>
        </UploadContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;