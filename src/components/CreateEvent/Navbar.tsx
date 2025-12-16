export const Navbar = () => {
  return (
    <nav className="bg-white/10 text-white rounded-t-2xl ml-10">
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-[50px]">
          <div className="text-2xl font-bold lowercase" style={{ fontFamily: "'Syne', sans-serif" }}>let's hang</div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-200 text-xl transition-colors">Home</a>
            <a href="#" className="hover:text-blue-200 text-xl transition-colors">People</a>
            <a href="#" className="hover:text-blue-200 text-xl transition-colors">Search</a>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors border border-white/30">
          Sign in
        </button>
      </div>
    </nav>
  );
};

