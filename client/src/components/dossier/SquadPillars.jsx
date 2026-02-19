import { Star, Crown, Heart, Sprout, Zap, TrendingUp, Shield, Users } from 'lucide-react';

const roleConfig = {
    'THE STAR': {
        label: 'A ESTRELA',
        icon: Star,
        gradient: 'from-amber-400 to-orange-500',
        badge: 'bg-amber-50 border-amber-200 text-amber-700',
        ring: 'ring-amber-200',
    },
    'THE ICON': {
        label: 'O ÍDOLO',
        icon: Crown,
        gradient: 'from-purple-500 to-violet-600',
        badge: 'bg-purple-50 border-purple-200 text-purple-700',
        ring: 'ring-purple-200',
    },
    'THE LOYAL': {
        label: 'O LEAL',
        icon: Heart,
        gradient: 'from-rose-500 to-pink-600',
        badge: 'bg-rose-50 border-rose-200 text-rose-700',
        ring: 'ring-rose-200',
    },
    'THE ACADEMY': {
        label: 'DA BASE',
        icon: Shield,
        gradient: 'from-emerald-500 to-teal-600',
        badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        ring: 'ring-emerald-200',
    },
    'THE ENGINE': {
        label: 'O MOTOR',
        icon: Zap,
        gradient: 'from-blue-500 to-cyan-600',
        badge: 'bg-blue-50 border-blue-200 text-blue-700',
        ring: 'ring-blue-200',
    },
    'THE WONDERKID': {
        label: 'A JOIA',
        icon: Sprout,
        gradient: 'from-lime-500 to-green-600',
        badge: 'bg-lime-50 border-lime-200 text-lime-700',
        ring: 'ring-lime-200',
    },
    'THE CAPTAIN': {
        label: 'O CAPITÃO',
        icon: TrendingUp,
        gradient: 'from-slate-600 to-slate-800',
        badge: 'bg-slate-50 border-slate-200 text-slate-700',
        ring: 'ring-slate-200',
    },
};

const defaultConfig = roleConfig['THE STAR'];

export default function SquadPillars({ data }) {
    if (!data || !data.length) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-neutral-500" />
                <h2 className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.2em]">
                    Pilares do Elenco
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.map((player, i) => {
                    const roleKey = player.role?.toUpperCase();
                    const config = roleConfig[roleKey] || defaultConfig;
                    const Icon = config.icon;

                    return (
                        <div
                            key={i}
                            className={`bg-white rounded-2xl border border-neutral-200/60 p-4 flex flex-col gap-3 ring-1 ${config.ring} ring-offset-0 hover:shadow-md transition-shadow`}
                        >
                            {/* Topo: avatar + nome + posição */}
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`inline-flex items-center text-[8px] font-bold px-2 py-0.5 rounded-full border mb-1 ${config.badge}`}>
                                        {config.label}
                                    </div>
                                    <div className="text-sm font-bold text-neutral-900 truncate leading-tight">{player.name}</div>
                                    <div className="text-[10px] text-neutral-400 font-mono">
                                        {player.position} · {player.age} anos · {player.overall} OVR
                                    </div>
                                </div>
                            </div>

                            {/* Contexto de identidade */}
                            {player.context && (
                                <p className="text-[10px] text-neutral-500 leading-relaxed border-l-2 border-neutral-200 pl-2">
                                    {player.context}
                                </p>
                            )}

                            {/* Rodapé: destaque + tempo de clube */}
                            <div className="flex items-end justify-between pt-1 border-t border-neutral-100">
                                <div>
                                    <div className="text-lg font-bold text-neutral-900 leading-none">{player.highlight}</div>
                                    <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                                        {player.highlightLabel}
                                    </div>
                                </div>
                                {player.yearsAtClub != null && (
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-neutral-700 leading-none">
                                            {player.yearsAtClub} {player.yearsAtClub === 1 ? 'ano' : 'anos'}
                                        </div>
                                        <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">
                                            no clube {player.clubSince ? `(${player.clubSince})` : ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
