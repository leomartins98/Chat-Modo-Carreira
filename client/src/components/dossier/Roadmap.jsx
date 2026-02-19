import { Map } from 'lucide-react';

const yearColors = {
    1: 'bg-red-500',
    3: 'bg-amber-500',
    5: 'bg-emerald-500',
};

export default function Roadmap({ data }) {
    if (!data || !data.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Map className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">Planejamento</h2>
            </div>

            <div className="relative pl-6">
                {/* Linha do tempo */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-neutral-200" />

                <div className="space-y-5">
                    {data.map((item, i) => (
                        <div key={i} className="relative">
                            {/* Ponto */}
                            <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${yearColors[item.year] || 'bg-neutral-400'} border-[3px] border-white shadow-sm`} />

                            <div>
                                <span className="inline-flex items-center px-2 py-0.5 bg-surface-100 rounded text-[10px] font-mono font-bold text-neutral-700 tracking-wider uppercase mb-1">
                                    Ano {item.year}
                                </span>
                                <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
