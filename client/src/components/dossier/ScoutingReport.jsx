import { Radar } from 'lucide-react';

const priorityStyles = {
    'HIGH PRIORITY': 'bg-red-500 text-white',
    'ALTA PRIORIDADE': 'bg-red-500 text-white',
    'WATCHLIST': 'bg-amber-100 text-amber-800 border border-amber-300',
    'LISTA DE OBSERVAÇÃO': 'bg-amber-100 text-amber-800 border border-amber-300',
    'TARGET': 'bg-emerald-500 text-white',
    'ALVO': 'bg-emerald-500 text-white',
};

export default function ScoutingReport({ data }) {
    if (!data || !data.length) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Radar className="w-4 h-4 text-neutral-500" />
                <h2 className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.2em]">Relatório de Olheiros</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((player, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-neutral-200/60 p-5 hover:shadow-md transition-shadow">
                        {/* Cabeçalho do Jogador */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600">
                                    {player.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-neutral-900">{player.name}</div>
                                    <div className="text-[10px] text-neutral-500">{player.club} • {player.position}</div>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${priorityStyles[player.priority?.toUpperCase()] || 'bg-neutral-100 text-neutral-600'}`}>
                                {player.priority}
                            </span>
                        </div>

                        {/* Justificativa do Olheiro */}
                        <div className="mb-4">
                            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Justificativa do Olheiro</div>
                            <p className="text-[11px] text-neutral-600 leading-relaxed italic">"{player.justification}"</p>
                        </div>

                        {/* Estatísticas */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                            <div>
                                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Valor Est.</div>
                                <div className="text-sm font-bold text-neutral-900">{player.estimatedFee}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Potencial</div>
                                <div className="text-sm font-bold text-neutral-900">{player.potential}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
