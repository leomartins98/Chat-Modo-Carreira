import { useState } from 'react';
import { useAuth } from '../App';
import { Shield, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Auth() {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            login(data.token, data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-100 grid-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Clean Analyst</h1>
                            <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">v1.0</span>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-500 mt-4">Plataforma de Inteligência Futebolística</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-8">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-surface-100 rounded-lg p-1">
                        <button
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                                }`}
                        >
                            Cadastrar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="analista@clube.com"
                                required
                                className="w-full px-4 py-3 bg-surface-50 border border-neutral-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                  placeholder:text-neutral-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-surface-50 border border-neutral-200 rounded-xl text-sm
                    focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300
                    placeholder:text-neutral-400 transition-all pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5 border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium
                hover:bg-neutral-800 transition-all flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Acessar Centro de Comando' : 'Criar Conta'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-neutral-400 mt-6 font-mono">
                    SEGURO · CRIPTOGRAFADO · CLASSIFICADO
                </p>
            </div>
        </div>
    );
}
