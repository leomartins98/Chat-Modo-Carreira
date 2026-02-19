import { Users, Star as StarIcon, Sprout, Shield } from 'lucide-react';

const roleConfig = {
    'THE STAR': { label: 'A ESTRELA', icon: StarIcon, color: 'from-amber-500 to-orange-500', highlight: 'bg-amber-50 text-amber-700' },
    'THE WONDERKID': { label: 'A JOIA', icon: Sprout, color: 'from-emerald-500 to-green-600', highlight: 'bg-emerald-50 text-emerald-700' },
    'THE VETERAN': { label: 'O VETERANO', icon: Shield, color: 'from-blue-500 to-indigo-600', highlight: 'bg-blue-50 text-blue-700' },
};

export default function SquadPillars({ data }) {
    if (!data || !data.length) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-neutral-500" />
                <h2 className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.2em]">Pilares do Elenco</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((player, i) => {
                    const config = roleConfig[player.role?.toUpperCase()] || roleConfig['THE STAR'];
                    const Icon = config.icon;

                    return (
                        <div key={i} className="bg-white rounded-2xl border border-neutral-200/60 p-5 flex items-center gap-4">
                            {/* Avatar do Jogador */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            {/* Info do Jogador */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                                    {config.label}
                                </div>
                                <div className="text-sm font-bold text-neutral-900 truncate">{player.name}</div>
                                <div className="text-[11px] text-neutral-500">
                                    {player.position} • {player.age} anos • {player.overall} OVR
                                </div>
                            </div>

                            {/* Destaque */}
                            <div className="text-right flex-shrink-0">
                                <div className="text-xl font-bold text-neutral-900">{player.highlight}</div>
                                <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider">{player.highlightLabel}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
