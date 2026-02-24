import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Search,
  Mic,
  FileQuestion,
  Sprout,
  Bug,
  CloudSun,
  Beaker,
  Phone,
  MessageSquare,
  Home,
  MessageCircleQuestion,
  List,
  User,
  ChevronDown,
  Wind,
  Droplets,
  ShieldAlert,
  MapPin,
  BellRing,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export const Route = createFileRoute("/")({
  component: MainPage,
});

function MainPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 md:pb-0">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-inner shadow-emerald-800">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-emerald-900 tracking-tight hidden sm:block">
              Farmer Query Support
            </h1>
            <h1 className="font-bold text-lg text-emerald-900 tracking-tight sm:hidden">
              FQS Portal
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200">
              English <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            <SignedOut>
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-full px-5" asChild>
                <Link to="/signin">Log in</Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <button className="relative text-slate-600 hover:text-emerald-700 transition-colors p-2 rounded-full hover:bg-slate-100">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        
        {/* Search Bar - Autocomplete style */}
        <div className="relative max-w-2xl mx-auto z-40 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm text-lg transition-all"
            placeholder="Search crop, disease, or problem..."
          />
          <button className="absolute inset-y-2 right-2 px-5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors hidden sm:block border border-emerald-100">
            Search
          </button>
          {/* Faked Autocomplete Dropdown - Shown on focus logically */}
          <div className="hidden group-focus-within:block absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested</div>
            <button className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700 font-medium">Wheat yellow rust treatment</span>
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl flex items-center gap-3">
               <Search className="w-4 h-4 text-slate-400" />
               <span className="text-slate-700 font-medium">Banana leaf spot disease</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-amber-50 rounded-3xl overflow-hidden shadow-sm border border-amber-200 flex flex-col md:flex-row max-w-6xl mx-auto">
          <div className="p-6 md:p-12 flex-1 flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Govt. Agriculture Help
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
              Ask your farming problem, get expert advice.
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg text-lg md:text-xl font-medium">
              Connect with local agricultural officers and scientists to resolve your crop issues quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-emerald-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-700/40 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg md:text-xl border border-emerald-500">
                <FileQuestion className="w-6 h-6" />
                Ask New Question
              </button>
              <button className="flex-1 bg-white text-emerald-800 border-2 border-emerald-200 font-bold py-4 px-6 rounded-2xl shadow-sm hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg md:text-xl">
                <Mic className="w-6 h-6 text-emerald-600" />
                Ask using Voice
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-amber-100 to-emerald-50 items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-amber-200/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-emerald-200/50 rounded-full blur-3xl"></div>
            
            {/* Friendly Illustration Stand-in */}
            <div className="relative z-10 w-full max-w-md aspect-[4/3] bg-white rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex flex-col group hover:shadow-emerald-200/50 transition-shadow duration-500">
              <div className="bg-emerald-100 h-3/5 flex items-center justify-center relative">
                 <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-emerald-200/50 to-transparent"></div>
                 <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 z-10">
                    <User className="w-16 h-16 text-emerald-600" />
                 </div>
                 <div className="absolute right-4 top-1/2 w-16 h-24 bg-white rounded-xl shadow border border-slate-100 rotate-12 flex flex-col gap-1 p-2">
                   <div className="w-full h-2 bg-slate-100 rounded"></div>
                   <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                   <div className="mt-auto w-full h-4 bg-emerald-500 rounded"></div>
                 </div>
              </div>
              <div className="bg-white h-2/5 p-4 flex flex-col justify-center items-center text-center">
                 <p className="font-bold text-slate-800 text-lg">Send Photo or Audio</p>
                 <p className="text-sm text-slate-500 font-medium">Get solutions in your local language</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Cards */}
        <section className="max-w-6xl mx-auto">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6 px-1 flex items-center gap-2">
            Quick Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-1">
            {[
              { label: "My Queries", icon: <FileQuestion className="w-8 h-8" />, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Crop Advice", icon: <Sprout className="w-8 h-8" />, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Pest & Disease", icon: <Bug className="w-8 h-8" />, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Weather", icon: <CloudSun className="w-8 h-8" />, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Schedule", icon: <Beaker className="w-8 h-8" />, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Call Officer", icon: <Phone className="w-8 h-8" />, color: "text-teal-600", bg: "bg-teal-50" },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 active:scale-95 transition-all group">
                <div className={`w-16 h-16 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:shadow-inner transition-all duration-300`}>
                  {action.icon}
                </div>
                <span className="text-sm md:text-base font-bold text-slate-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Latest Expert Answers */}
          <section className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  Latest Expert Answers
                </h3>
                <button className="text-sm text-emerald-600 font-bold hover:underline">View all</button>
             </div>
             <div className="space-y-4">
               {[
                 {
                   crop: "Wheat",
                   problem: "Yellowing of leaves in late stage",
                   answer: "This appears to be a nutrient deficiency, specifically nitrogen. Consider applying a quick-release nitrogen fertilizer at 20kg/acre followed by light irrigation...",
                   officer: "Dr. Sharma",
                   date: "Today"
                 },
                 {
                   crop: "Cotton",
                   problem: "Whitefly infestation in main field",
                   answer: "Immediate action required. Spray Neem oil (10000 ppm) @ 1 liter per acre mixed with 200 liters of water. If severe, consult for chemical alternative...",
                   officer: "A.O. Patil",
                   date: "Yesterday"
                 },
                 {
                   crop: "Banana",
                   problem: "Black spots on leaves, drying edges",
                   answer: "Symptoms indicate Sigatoka leaf spot. Remove severely infected leaves immediately. Spray Propiconazole 1 ml/liter of water...",
                   officer: "Dr. Deshmukh",
                   date: "2 Days ago"
                 }
               ].map((item, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase tracking-wider rounded-lg border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                        {item.crop}
                      </span>
                      <span className="text-sm text-slate-400 font-semibold">{item.date}</span>
                    </div>
                    <h4 className="font-extrabold text-lg text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{item.problem}</h4>
                    <p className="text-slate-600 text-base leading-relaxed mb-5 line-clamp-2">
                      {item.answer}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 border-t border-slate-100 pt-4">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                        <User className="w-4 h-4" />
                      </div>
                      Answered by <span className="text-slate-700">{item.officer}</span>
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Seasonal Advisory Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-800 px-1 flex items-center gap-2">
              <Wind className="w-6 h-6 text-amber-500" />
              This Week Advisory
            </h3>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase tracking-widest">Region: Maharashtra</span>
                <span className="flex items-center gap-1.5 text-xs text-amber-700 font-bold px-2 py-1 bg-amber-100/50 rounded-full"><MapPin className="w-3.5 h-3.5"/> Active</span>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <div className="mt-0.5"><ShieldAlert className="w-6 h-6 text-rose-500" /></div>
                  <div>
                    <h5 className="font-bold text-base text-rose-900">Heavy Rain Alert</h5>
                    <p className="text-sm text-rose-700 mt-1 font-medium">Expected thunderstorms in next 48 hours. Delay spraying activities immediately.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5"><Droplets className="w-6 h-6 text-blue-500" /></div>
                  <div>
                    <h5 className="font-bold text-base text-slate-900">Irrigation Advice</h5>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Stop irrigation for banana crops due to predicted moisture surplus in soil.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                  <div className="mt-0.5"><Sprout className="w-6 h-6 text-emerald-500" /></div>
                  <div>
                    <h5 className="font-bold text-base text-slate-900">Sowing Window</h5>
                    <p className="text-sm text-slate-600 mt-1 font-medium">Optimal time for Rabi sorghum sowing begins next week.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer / Help Section */}
      <footer className="bg-emerald-950 text-emerald-50 mt-16 pt-12 pb-24 md:pb-12 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 lg:gap-16">
           <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-emerald-800 p-2 rounded-xl border border-emerald-700">
                  <Sprout className="w-6 h-6 text-emerald-300" />
                </div>
                <h4 className="font-extrabold text-xl text-white">Farmer Query Support</h4>
              </div>
              <p className="text-emerald-200/80 text-base font-medium mb-8 max-w-sm leading-relaxed">
                A government-supported platform providing instant, expert agricultural advice to farmers nationwide in local languages.
              </p>
              <div className="flex items-center gap-4 border border-emerald-800/60 bg-emerald-900/30 p-4 rounded-2xl w-fit">
                 <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-xs font-black text-emerald-700 shadow-inner">
                   GOV
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Trusted & Verified</span>
                   <span className="text-sm text-white font-semibold">Dept. of Agriculture</span>
                 </div>
              </div>
           </div>

           <div className="space-y-5">
              <h5 className="font-bold text-lg text-white">Quick Links</h5>
              <ul className="space-y-3 text-base text-emerald-200 font-medium">
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><HelpCircle className="w-4 h-4"/> How to use this app</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><List className="w-4 h-4"/> Success Stories</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><MapPin className="w-4 h-4"/> Find Local Officer</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Privacy Policy</button></li>
              </ul>
           </div>

           <div className="space-y-5">
              <h5 className="font-bold text-lg text-white">Need Urgent Help?</h5>
              <div className="flex items-center gap-4 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800/80 hover:bg-emerald-800/60 transition-colors">
                <div className="bg-emerald-800/50 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-emerald-300 font-semibold mb-0.5">Toll-Free Helpline</div>
                  <div className="font-black text-xl text-white tracking-wider">1800-120-0000</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800/80 hover:bg-emerald-800/60 transition-colors">
                <div className="bg-emerald-800/50 p-3 rounded-xl">
                  <MessageCircleQuestion className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-emerald-300 font-semibold mb-0.5">WhatsApp Support</div>
                  <div className="font-black text-xl text-white tracking-wider">+91 98765 43210</div>
                </div>
              </div>
           </div>
        </div>
      </footer>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center h-[72px] px-2">
          <button className="flex flex-col items-center justify-center w-full h-full text-emerald-600 gap-1.5">
            <Home className="w-6 h-6" />
            <span className="text-[11px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-emerald-600 transition-colors gap-1.5">
            <List className="w-6 h-6" />
            <span className="text-[11px] font-bold">Queries</span>
          </button>
          <div className="relative -top-6 flex justify-center w-full z-10">
            <button className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-xl shadow-emerald-600/40 flex items-center justify-center hover:bg-emerald-700 transition-all border-[6px] border-slate-50 active:scale-95">
              <FileQuestion className="w-7 h-7" />
            </button>
          </div>
          <button className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-emerald-600 transition-colors gap-1.5">
            <BellRing className="w-6 h-6 relative">
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </BellRing>
            <span className="text-[11px] font-bold">Updates</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-emerald-600 transition-colors gap-1.5">
            <User className="w-6 h-6" />
            <span className="text-[11px] font-bold">Profile</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

export default MainPage;
