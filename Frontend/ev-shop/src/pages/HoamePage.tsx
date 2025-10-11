import React, { useState, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

// --- AUTHENTICATION CONTEXT ---

export type UserRole = "user" | "admin" | "seller" | "finance";

interface User {
  userid: string;
  name: string;
  role: UserRole[]; // multiple roles
  activeRole: UserRole; // currently active role
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => UserRole[];
  logout: () => void;
  addRole: (newRole: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
        const stored = localStorage.getItem("authUser");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
  });

  useEffect(() => {
    if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
    } else {
        localStorage.removeItem("authUser");
    }
  }, [user]);

  const login = (username: string, password: string): UserRole[] => {
    if (username === "user@example.com" && password === "password123") {
      const newUser: User = {
        userid: "u1",
        name: "Normal User",
        role: ["user"],
        activeRole: "user",
      };
      setUser(newUser);
      return newUser.role;
    }
     if (username === "admin@example.com" && password === "admin123") {
      const newUser: User = {
        userid: "a1",
        name: "Admin User",
        role: ["admin", "user"],
        activeRole: "admin",
      };
      setUser(newUser);
      return newUser.role;
    }
    throw new Error("Invalid credentials. Please try again.");
  };

  const logout = () => setUser(null);

  const addRole = (newRole: UserRole) => {
    if (!user || user.role.includes(newRole)) return;
    const updatedUser = { ...user, role: [...user.role, newRole]};
    setUser(updatedUser);
  };

  const hasRole = (role: UserRole) => user?.role.includes(role) ?? false;

  const setActiveRole = (role: UserRole) => {
    if (user && user.role.includes(role)) {
      setUser({ ...user, activeRole: role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addRole, hasRole, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


// --- TYPE DEFINITIONS ---
type Page = 'Welcome' | 'Models' | 'Charging' | 'Discover' | 'Contact' | 'TestDrive' | 'ForgotPassword' | 'Login';

interface EVCardProps {
  imageUrl: string;
  modelName: string;
  price: string;
  range: string;
  acceleration: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}


// --- ICONS (as SVG components) ---
const ZapIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const LeafIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h4l2 4h4a2 2 0 0 1 2 2v4a7 7 0 0 1-7 7z"></path><path d="M11 20A7 7 0 0 1 4 13V8"></path></svg>
);
const GaugeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const EyeSlashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>
);

const Logo = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <button onClick={() => onNavigate('Welcome')} className="flex items-center space-x-2">
        <ZapIcon className="h-8 w-8 text-blue-500" />
        <span className="text-2xl font-bold text-gray-800">EV-Charge</span>
    </button>
);


// --- MOCK AUTH SERVICE & PLACEHOLDER COMPONENTS ---
const forgetPassword = (email: string) => new Promise(resolve => setTimeout(resolve, 1000));
const verifyOTP = (email: string, otp: string) => new Promise(resolve => setTimeout(resolve, 1000));
const resetPassword = (email: string, pass: string) => new Promise(resolve => setTimeout(resolve, 1000));

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => <label {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${props.className}`} />;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className}`} />;
const Loader = ({ size = 8, color = "#4f46e5" }: { size?: number, color?: string }) => <div style={{ width: `${size*4}px`, height: `${size*4}px`, border: `${size/2}px solid ${color}`, borderBottomColor: "transparent" }} className="rounded-full inline-block box-border animate-spin"></div>;


// --- FOLDER: components ---
const Header: React.FC<{ onNavigate: (page: Page) => void, currentPage: Page }> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const navItems: { page: Page, title: string }[] = [
    { page: 'Models', title: 'Models'}, { page: 'Charging', title: 'Charging'},
    { page: 'Discover', title: 'Discover'}, { page: 'Contact', title: 'Contact'},
  ];

  const handleLogout = () => {
    logout();
    onNavigate('Welcome');
  }

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Logo onNavigate={onNavigate} />
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <button key={item.page} onClick={() => onNavigate(item.page)} className={`text-gray-600 hover:text-blue-500 transition-colors ${currentPage === item.page ? 'text-blue-600 font-semibold' : ''}`}>{item.title}</button>
          ))}
        </div>
        <div className="hidden md:flex items-center space-x-4">
            {user ? (
                <>
                    <span className="font-semibold text-gray-700">Welcome, {user.name}!</span>
                    <button onClick={handleLogout} className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => onNavigate('Login')} className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Login</button>
                    <button onClick={() => onNavigate('TestDrive')} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">Test Drive</button>
                </>
            )}
        </div>
        <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </nav>
    </header>
  );
};

// ... Other components (EVCard, FeatureCard, Footer, PageHeader) remain the same ...
const EVCard: React.FC<EVCardProps> = ({ imageUrl, modelName, price, range, acceleration }) => ( <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 ease-in-out"> <img src={imageUrl} alt={modelName} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"/> <div className="p-6"> <h3 className="text-2xl font-bold text-gray-800 mb-2">{modelName}</h3> <p className="text-lg font-semibold text-blue-600 mb-4">{price}</p> <div className="flex justify-between text-gray-600 text-sm"> <div className="text-center"><p className="font-bold text-lg">{range}</p><p>Range (EPA est.)</p></div> <div className="text-center"><p className="font-bold text-lg">{acceleration}</p><p>0-60 mph</p></div> </div> <button className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">Learn More</button> </div> </div> );
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => ( <div className="bg-white p-8 rounded-2xl shadow-md text-center flex flex-col items-center"> <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">{icon}</div> <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3> <p className="text-gray-600">{description}</p> </div> );
const Footer: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => { return ( <footer className="bg-gray-900 text-white"> <div className="container mx-auto px-6 py-12"> <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> <div> <Logo onNavigate={onNavigate}/> <p className="mt-4 text-gray-400">Driving the future, sustainably.</p> </div> <div> <h3 className="text-lg font-semibold mb-4">Models</h3> <ul className="space-y-2"> <li><button onClick={() => onNavigate('Models')} className="text-gray-400 hover:text-white">Sedan S</button></li> <li><button onClick={() => onNavigate('Models')} className="text-gray-400 hover:text-white">SUV X</button></li> <li><button onClick={() => onNavigate('Models')} className="text-gray-400 hover:text-white">Roadster R</button></li> </ul> </div> <div> <h3 className="text-lg font-semibold mb-4">Company</h3> <ul className="space-y-2"> <li><button onClick={() => onNavigate('Discover')} className="text-gray-400 hover:text-white">About Us</button></li> <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li> <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li> </ul> </div> <div> <h3 className="text-lg font-semibold mb-4">Newsletter</h3> <p className="text-gray-400 mb-4">Stay up to date with the latest EV news.</p> <div className="flex"> <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 text-gray-800 rounded-l-lg focus:outline-none" /> <button className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">Go</button> </div> </div> </div> <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500"><p>&copy; {new Date().getFullYear()} EV-Charge. All Rights Reserved.</p></div> </div> </footer> ); };
const PageHeader = ({title, subtitle}: {title: string, subtitle: string}) => ( <div className="bg-gray-100 py-16 text-center"> <div className="container mx-auto px-6"> <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">{title}</h1> <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p> </div> </div> );

// --- FOLDER: pages ---
// ... Other pages (Welcome, Models, etc.) remain the same ...
const WelcomePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => { return ( <main> <section className="relative h-[80vh] min-h-[500px] text-white"> <div className="absolute inset-0 bg-black opacity-50 z-10"></div> <img src="https://placehold.co/1920x1080/000000/FFFFFF?text=Scenic+EV+Drive" alt="Futuristic electric car on a scenic road" className="absolute inset-0 w-full h-full object-cover"/> <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center"> <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">The Future is Electric.</h1> <p className="text-lg md:text-xl max-w-2xl mb-8">Experience unparalleled performance, cutting-edge technology, and a sustainable drive. Your journey begins now.</p> <button onClick={() => onNavigate('Models')} className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">Explore Models</button> </div> </section> <section className="py-20 bg-gray-100"><div className="container mx-auto px-6"><h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Our Featured Vehicles</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> {[ { imageUrl: 'https://placehold.co/600x400/E2E8F0/334155?text=EV+Sedan+S', modelName: 'Aura Sedan S', price: 'Starting at $38,990', range: '330 mi', acceleration: '3.1 s' }, { imageUrl: 'https://placehold.co/600x400/94A3B8/FFFFFF?text=EV+SUV+X', modelName: 'Odyssey SUV X', price: 'Starting at $42,990', range: '310 mi', acceleration: '3.8 s' }, { imageUrl: 'https://placehold.co/600x400/334155/E2E8F0?text=EV+Roadster+R', modelName: 'Velocity R', price: 'Starting at $55,990', range: '400 mi', acceleration: '1.9 s' }, ].map((car, index) => (<EVCard key={index} {...car} />))} </div></div></section> <section className="py-20 bg-white"><div className="container mx-auto px-6 text-center"><h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">The EV-Charge Advantage</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-10"> <FeatureCard icon={<GaugeIcon className="h-8 w-8"/>} title="Unmatched Performance" description="Instant torque and seamless acceleration for a thrilling driving experience."/> <FeatureCard icon={<LeafIcon className="h-8 w-8"/>} title="Eco-Friendly" description="Drive with a clear conscience. Zero emissions means a cleaner planet for all."/> <FeatureCard icon={<ZapIcon className="h-8 w-8"/>} title="Rapid Charging" description="Our expansive network gets you back on the road faster than ever."/> </div></div></section> </main> );};
const ModelsPage: React.FC = () => { return ( <main> <PageHeader title="Our Electric Fleet" subtitle="Discover the perfect EV-Charge vehicle for your lifestyle. High performance meets sustainable design." /> <div className="py-20 bg-white"><div className="container mx-auto px-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> {[ { imageUrl: 'https://placehold.co/600x400/E2E8F0/334155?text=Aura+Sedan', modelName: 'Aura Sedan S', price: 'Starting at $38,990', range: '330 mi', acceleration: '3.1 s' }, { imageUrl: 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Odyssey+SUV', modelName: 'Odyssey SUV X', price: 'Starting at $42,990', range: '310 mi', acceleration: '3.8 s' }, { imageUrl: 'https://placehold.co/600x400/334155/E2E8F0?text=Velocity+R', modelName: 'Velocity R', price: 'Starting at $55,990', range: '400 mi', acceleration: '1.9 s' }, { imageUrl: 'https://placehold.co/600x400/E2E8F0/334155?text=Compact+C', modelName: 'Ion Compact C', price: 'Starting at $29,990', range: '250 mi', acceleration: '5.6 s' }, { imageUrl: 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Luxury+L', modelName: 'Zenith Luxury L', price: 'Starting at $79,990', range: '380 mi', acceleration: '3.5 s' }, { imageUrl: 'https://placehold.co/600x400/334155/E2E8F0?text=Truck+T', modelName: 'Titan Truck T', price: 'Starting at $69,990', range: '500 mi', acceleration: '4.5 s' }, ].map((car, index) => ( <EVCard key={index} {...car} /> ))} </div></div></div> </main> );};
const ChargingPage: React.FC = () => { return ( <main> <PageHeader title="Power Your Journey" subtitle="Charging your EV-Charge is as easy as charging your phone. At home, at work, or on the road." /> <div className="py-20 bg-white"><div className="container mx-auto px-6 space-y-16"> <div className="flex flex-col md:flex-row items-center gap-10"><div className="md:w-1/2"><h2 className="text-3xl font-bold text-gray-800 mb-4">Home Charging</h2><p className="text-gray-600 leading-relaxed">The ultimate convenience. Wake up to a full charge every day. Our Wall Connector offers the fastest possible home charging speeds. Install it in your garage and plug in overnight.</p></div><div className="md:w-1/2"><img src="https://placehold.co/600x400/E2E8F0/334155?text=Home+Charging+Setup" alt="Home Charging" className="rounded-lg shadow-lg"/></div></div> <div className="flex flex-col md:flex-row-reverse items-center gap-10"><div className="md:w-1/2"><h2 className="text-3xl font-bold text-gray-800 mb-4">Supercharger Network</h2><p className="text-gray-600 leading-relaxed">The world’s fastest charging network. With over 50,000 global Superchargers, you can recharge up to 200 miles in just 15 minutes. Our network is conveniently placed along major travel routes.</p></div><div className="md:w-1/2"><img src="https://placehold.co/600x400/334155/E2E8F0?text=Supercharger+Station" alt="Supercharger Station" className="rounded-lg shadow-lg"/></div></div> </div></div> </main> );};
const DiscoverPage: React.FC = () => { return ( <main> <PageHeader title="Engineering the Future" subtitle="We're not just building cars; we're accelerating the world's transition to sustainable energy." /> <div className="py-20 bg-white"><div className="container mx-auto px-6 max-w-4xl text-lg text-gray-700 leading-relaxed space-y-8"> <p>At EV-Charge, our mission is to create the most compelling car company of the 21st century by driving the world's transition to electric vehicles. We design, develop, manufacture, and sell all-electric vehicles, and energy generation and storage systems.</p> <h3 className="text-2xl font-bold text-gray-800 pt-8">Our Vision</h3> <p>We believe that the faster the world stops relying on fossil fuels and moves towards a zero-emission future, the better. Our vehicles are not just environmentally friendly; they are safer, faster, and more fun to drive than gasoline-powered cars.</p> <img src="https://placehold.co/800x400/E2E8F0/334155?text=Our+Factory" alt="EV Factory" className="rounded-lg shadow-lg w-full"/> <h3 className="text-2xl font-bold text-gray-800 pt-8">Innovation at the Core</h3> <p>From our long-range battery technology to our in-house software development, innovation is at the heart of everything we do. We are constantly pushing the boundaries of what's possible to make our products better, safer, and more accessible to everyone.</p> </div></div> </main> );};
const ContactPage: React.FC = () => { return ( <main> <PageHeader title="Get In Touch" subtitle="We'd love to hear from you. Whether you have a question about our products, need assistance, or just want to talk, we are here." /> <div className="py-20 bg-white"><div className="container mx-auto px-6"><div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg"><h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2><form className="space-y-6"> <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div> <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" id="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div> <div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea id="message" rows={5} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea></div> <div><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">Submit</button></div> </form></div></div></div> </main> );};
const TestDrivePage: React.FC = () => { return ( <main> <PageHeader title="Schedule a Test Drive" subtitle="Experience the thrill of an EV-Charge vehicle first-hand. Select a model and book your appointment today." /> <div className="py-20 bg-white"><div className="container mx-auto px-6"><div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg"><h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Appointment</h2><form className="space-y-6"> <div><label htmlFor="model" className="block text-sm font-medium text-gray-700">Select Model</label><select id="model" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"><option>Aura Sedan S</option><option>Odyssey SUV X</option><option>Velocity R</option><option>Ion Compact C</option></select></div> <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div> <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" id="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div> <div><label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label><input type="date" id="date" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div> <div><button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">Request Test Drive</button></div> </form></div></div></div> </main> );};

const LoginPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            login(email, password);
            onNavigate('Welcome');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
    <main>
        <div className="h-[80vh] flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Please enter your details to sign in.</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input type="email" id="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <button type="button" onClick={() => onNavigate('ForgotPassword')} className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                    <div>
                       <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">
                           {loading ? <Loader size={5} color="#fff" /> : 'Sign In'}
                       </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
    )
};

const ForgotPasswordPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState("enter-email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ id: number; type: string; text: string; }| undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timerId = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendCooldown]);

  const showMessage = (text: string, type = "error") => {
    setMessage({ id: Date.now(), text, type });
    setTimeout(() => setMessage(undefined), 5000);
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    return `${local.slice(0, 3)}***@${domain}`;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address." }); return;
    }
    setErrors({}); setLoading(true);
    try {
      await forgetPassword(email);
      setStep("enter-otp");
      showMessage(`An OTP has been sent to ${maskEmail(email)}.`, "success");
      setResendCooldown(60);
    } catch (err: any) { showMessage("Failed to send OTP.", "error"); } 
    finally { setLoading(false); }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
        setErrors({ otp: "Please enter the complete 6-digit OTP." }); return;
    }
    setErrors({}); setLoading(true);
    try {
        await verifyOTP(email, enteredOtp);
        showMessage("OTP verified successfully!", "success");
        setStep("reset-password");
    } catch (err: any) { showMessage("Invalid OTP. Please try again.", "error"); }
    finally { setLoading(false); }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: { password?: string; confirmPassword?: string } = {};
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
        newErrors.password = "Password must be 8+ chars with uppercase, lowercase, number, & special character.";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      setLoading(true);
      try {
          await resetPassword(email, newPassword);
          showMessage("Password has been reset successfully!", "success");
          setStep("success");
      } catch (err: any) { showMessage("Failed to reset password.", "error"); }
      finally { setLoading(false); }
  };
  
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
        await forgetPassword(email);
        showMessage(`OTP has been resent to ${maskEmail(email)}.`, "success");
        setResendCooldown(60);
    } catch (err: any) { showMessage("Failed to resend OTP.", "error"); }
    finally { setLoading(false); }
  };
  
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const renderStepContent = () => {
    switch (step) {
        case "enter-email": return (
            <form onSubmit={handleSendOtp} className="space-y-6">
                <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required/>{errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}</div>
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${loading ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>{loading ? <Loader size={6} color="#4f46e5" /> : "Send OTP"}</button>
            </form>
        );
        case "enter-otp": return (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
                 <div className="flex justify-center gap-2">{otp.map((data, index) => (<input key={index} type="text" maxLength={1} value={data} onChange={(e) => handleOtpChange(e.target, index)} onFocus={(e) => e.target.select()} className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>))}</div>
                 {errors.otp && <p className="text-red-600 text-center text-xs mt-1">{errors.otp}</p>}
                 <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all ${loading ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>{loading ? <Loader size={6} color="#4f46e5"/> : "Verify OTP"}</button>
                 <p className="text-center text-sm text-gray-500">Didn't receive code? <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0} className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed">{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}</button></p>
            </form>
        );
        case "reset-password": return (
            <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative"><Input id="newPassword" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" /><button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}</button></div>
                    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative"><Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••"/><button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}</button></div>
                    {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{loading ? "Resetting..." : "Reset Password"}</button>
            </form>
        );
        case "success": return (
             <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Success!</h1>
                <p className="mt-2 text-sm text-gray-600">{message?.text}</p>
                <button onClick={() => onNavigate('Login')} className="mt-6 inline-block w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">Back to Login</button>
            </div>
        );
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <div className="hidden md:block md:w-1/2 bg-cover bg-center transition-all duration-700 ease-in-out auth-image" style={{ backgroundImage: `url(https://placehold.co/1000x1200/334155/FFFFFF?text=EV-Charge)` }} />
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          {message && <div className={`absolute top-5 left-1/2 -translate-x-1/2 w-[80%] text-center p-3 rounded-md font-medium shadow-lg z-10 text-sm animate-slide-down ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message.text}</div>}
          <div className="text-center pt-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {step === "enter-email" && "Forgot Password?"}
              {step === "enter-otp" && "Enter Verification Code"}
              {step === "reset-password" && "Reset Your Password"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {step === "enter-email" && "No worries, we'll send you reset instructions."}
              {step === "enter-otp" && `Enter the OTP sent to your email at ${maskEmail(email)}.`}
              {step === "reset-password" && "Please enter a new password."}
            </p>
          </div>
          <div className="animate-fade-in-up">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- App Entry Point ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Welcome');
  const [animationClass, setAnimationClass] = useState('anim-fade-in');
  const auth = useAuth();

  const handleNavigate = (page: Page) => {
    if (page === currentPage) return;
    setAnimationClass('anim-fade-out');
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0); 
      setAnimationClass('anim-fade-in');
    }, 300);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Models': return <ModelsPage />;
      case 'Charging': return <ChargingPage />;
      case 'Discover': return <DiscoverPage />;
      case 'Contact': return <ContactPage />;
      case 'TestDrive': return <TestDrivePage />;
      case 'Login': return <LoginPage onNavigate={handleNavigate} />;
      case 'ForgotPassword': return <ForgotPasswordPage onNavigate={handleNavigate} />;
      default: return <WelcomePage onNavigate={handleNavigate} />;
    }
  };

  if (currentPage === 'ForgotPassword' || (currentPage === 'Login' && !auth.user)) {
    return renderPage();
  }

  return (
    <div className="bg-gray-50 font-sans">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
        .anim-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .anim-fade-out { animation: fadeOut 0.3s ease-in forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
        .auth-image { animation: fadeIn 1s ease-out forwards; }
      `}</style>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <div className={animationClass}>
        {renderPage()}
      </div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

// --- ROOT WRAPPER ---
const Root: React.FC = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default Root;

