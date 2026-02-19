import { useAuth } from '../App';
import { Shield, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ clubName }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isDossier = location.pathname === '/dossier';

    return (
        <header className="px-6 py-3 flex items-center justify-between border-b border-neutral-200/60 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                {isDossier && (
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors font-mono mr-2"
                    >
                        ← Centro de Comando
                    </button>
                )}
                {isDossier && clubName && (
                    <>
                        <span className="text-neutral-300">/</span>
                        <span className="text-xs font-medium text-neutral-700">Dossiê: {clubName}</span>
                    </>
                )}
                {!isDossier && (
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-neutral-900 tracking-tight">Clean Analyst</span>
                            <span className="text-[9px] font-mono text-neutral-400 ml-1.5">v1.0</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-700 tracking-wider uppercase">Sistema Ativo</span>
                </div>
                <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all">
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={logout}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Sair"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
