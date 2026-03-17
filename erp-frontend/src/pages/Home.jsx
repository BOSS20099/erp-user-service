import {Link} from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home(){
  const [animateTitle, setAnimateTitle] = useState(false);
  
  useEffect(() => {
    setAnimateTitle(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Decorative gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Main Title */}
          <div className={`transition-all duration-1000 ${animateTitle ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Bienvenue dans ERP Users
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-2xl text-slate-300 font-light animate-slide-in-right">
            ✨ Gérez vos utilisateurs efficacement avec un design moderne
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8">
            {[
              { icon: '⚡', title: 'Rapide', desc: 'Gestion d\'utilisateurs ultra-rapide' },
              { icon: '🔒', title: 'Sécurisé', desc: 'Contrôle d\'accès basé sur les rôles' },
              { icon: '✨', title: 'Magnifique', desc: 'Interface moderne et intuitive' }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="card p-8 transform transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-8">
            <div className="flex gap-6 justify-center flex-wrap">
              <Link 
                to="/users" 
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  👥 Voir tous les utilisateurs
                </span>
              </Link>
              <Link 
                to="/users/create" 
                className="btn-success group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ➕ Créer un nouvel utilisateur
                </span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="pt-8 mt-8 border-t border-white border-opacity-20">
              <p className="text-slate-400 mb-4">Alimenté par les technologies modernes</p>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400">100%</div>
                  <div className="text-sm text-slate-400">Réactif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400">∞</div>
                  <div className="text-sm text-slate-400">Évolutif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-cyan-400">A+</div>
                  <div className="text-sm text-slate-400">Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
