import { Music } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.52 1.22 2.89 2.89 0 0 1 2.31-4.29V9.55a6.33 6.33 0 0 0-5.61 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.63a8.16 8.16 0 0 0 4.78 1.53V6.75a4.83 4.83 0 0 1-2.42-.06z"/>
  </svg>
);

function App() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-100/30 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-gold/40 to-navy-300/30 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <img
                  src="IMG_2950.jpg"
                  alt="Symphany"
                  className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <div className="bg-gradient-to-br from-gold to-gold-dark p-1.5 rounded-full">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title and Introduction */}
            <div className="text-center md:text-left flex-1">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-navy-900 tracking-tight mb-4">
                Symphany's <span className="text-gold-dark italic">Portfolio</span>
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="h-px w-12 bg-gold" />
                <span className="text-warmGray font-light tracking-widest text-sm uppercase">
                  Aspiring Cloud Security Engineer
                </span>
              </div>
              <p className="text-charcoal/80 font-light text-lg leading-relaxed max-w-xl">
                Hi! My name is Symphany. I'm currently a senior in high school and aspire to become a{' '}
                <span className="text-navy-700 font-medium">Cloud Security Engineer</span>.
                I'm participating in many programs to grow my knowledge for the future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent" />
          <div className="w-2 h-2 bg-gold rounded-full" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent" />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Projects Card */}
          <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-navy-100/50 hover:border-gold/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-navy-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-navy-900">Projects</h2>
            </div>
            <p className="text-charcoal/70 font-light leading-relaxed">
              So far, I've been working on many projects with{' '}
              <span className="text-gold-dark font-medium">The Knowledge House (TKH)</span>,
              such as building my own web page using CSS and HTML.
            </p>
          </div>

          {/* Interests Card */}
          <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-navy-100/50 hover:border-gold/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-display text-2xl text-navy-900">Interests</h2>
            </div>
            <p className="text-charcoal/70 font-light leading-relaxed mb-5">
              I enjoy playing electric guitar, flute, and playing sports.
            </p>
            <a
              href="https://www.tiktok.com/@symkaro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-navy-700 hover:text-gold-dark transition-colors font-medium group/link"
            >
              <TikTokIcon className="w-5 h-5" />
              <span>Follow me on TikTok @symkaro</span>
              <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold font-display text-2xl italic mb-2">Thank you!</p>
          <p className="text-cream/60 font-light text-sm">For visiting my portfolio</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
