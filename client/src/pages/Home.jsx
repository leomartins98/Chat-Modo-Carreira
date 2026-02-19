import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Header from '../components/Header';
import {
    Search, Sparkles, Loader2, Clock, X
} from 'lucide-react';

const quickScouts = [
    { name: 'Real Madrid', emoji: '⚪' },
    { name: 'Wrexham', emoji: '🔴' },
    { name: 'Napoli', emoji: '🔵' },
    { name: 'SL Benfica', emoji: '🦅' },
    { name: 'Borussia Dortmund', emoji: '🟡' },
    { name: 'Ajax', emoji: '🔴' },
];

export default function Home() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [clubName, setClubName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (name) => {
        const query = name || clubName;
        if (!query.trim()) return;
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/scout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ clubName: query.trim() }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            navigate('/dossier', { state: { data: result.data, clubName: query.trim(), cached: result.cached } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-100 grid-bg flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
                {/* Title */}
                <div className="text-center mb-8 animate-fade-in">
                    <p className="text-[11px] font-mono text-neutral-400 tracking-[0.3em] uppercase mb-2">
                        Centro de Comando // Aguardando
                    </p>
                </div>

                {/* Search Box */}
                <div className="w-full max-w-xl animate-slide-up">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Digite o nome do clube (ex: Brighton & Hove Albion)..."
                            disabled={loading}
                            className="w-full pl-14 pr-12 py-4 bg-white border border-neutral-200/80 rounded-2xl
                text-sm text-neutral-800 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-300
                placeholder:text-neutral-400 transition-all disabled:opacity-60"
                        />
                        {clubName && !loading && (
                            <button
                                onClick={() => setClubName('')}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Quick Scout Pills */}
                    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                        <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase mr-1">
                            Scout Rápido:
                        </span>
                        {quickScouts.map((club) => (
                            <button
                                key={club.name}
                                onClick={() => { setClubName(club.name); handleSearch(club.name); }}
                                disabled={loading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200
                  rounded-full text-xs font-medium text-neutral-700
                  hover:border-neutral-300 hover:shadow-sm transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                <span>{club.emoji}</span>
                                {club.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading || !clubName.trim()}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl
                text-sm font-medium hover:bg-neutral-800 transition-all
                disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]
                shadow-lg shadow-neutral-900/10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Gerando Dossiê...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Gerar Dossiê
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-5 py-3 border border-red-100 text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="mt-12 text-center animate-fade-in">
                        <div className="relative w-64 h-40 mx-auto bg-white/60 border border-neutral-200/50 rounded-2xl overflow-hidden">
                            <div className="scanner-line" />
                            <div className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-8 bg-neutral-300 rounded-full animate-pulse"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                                    Analisando Informações...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="px-6 py-4 flex items-center justify-between text-[10px] font-mono text-neutral-400 tracking-wider">
                <div className="flex items-center gap-4">
                    <span>Base de Dados v24.3</span>
                    <span>Rede de Olheiros</span>
                </div>
                <span className="uppercase">Aguardando Consulta...</span>
            </footer>
        </div>
    );
}
