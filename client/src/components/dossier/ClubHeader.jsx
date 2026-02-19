import { MapPin, Calendar, Building2 } from 'lucide-react';

export default function ClubHeader({ data }) {
    if (!data) return null;

    const initials = data.shortName || data.name?.substring(0, 3).toUpperCase();

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 flex gap-6">
            {/* Escudo do Clube */}
            <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                    <span className="text-white font-bold text-2xl tracking-wider">{initials}</span>
                </div>
            </div>

            {/* Informações do Clube */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 leading-tight">{data.name}</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">{data.league} • {data.country}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Fundação</div>
                        <div className="text-2xl font-bold text-neutral-900">{data.founded}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        <div>
                            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Estádio</div>
                            <div className="text-xs font-medium text-neutral-700">{data.stadium}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <div>
                            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Capacidade</div>
                            <div className="text-xs font-medium text-neutral-700">{data.capacity?.toLocaleString('pt-BR')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
