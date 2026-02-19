import { Dna, Star } from 'lucide-react';

const intensityColors = {
    CRIT: 'bg-red-500 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-yellow-500 text-white',
    LOW: 'bg-green-500 text-white',
};

const intensityLabels = {
    CRIT: 'CRÍTICO',
    HIGH: 'ALTO',
    MEDIUM: 'MÉDIO',
    LOW: 'BAIXO',
};

export default function HistoryDNA({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
            <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">História & DNA</h2>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">{data.description}</p>

            {/* Tags de Estilo de Jogo */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {data.playStyleTags?.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-surface-100 border border-neutral-200/60 rounded-md text-[11px] font-medium text-neutral-700">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Rivalidade & Reputação */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Intensidade da Rivalidade</div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${intensityColors[data.rivalryIntensity?.level] || 'bg-neutral-200 text-neutral-700'}`}>
                            {intensityLabels[data.rivalryIntensity?.level] || data.rivalryIntensity?.level}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                            vs {data.rivalryIntensity?.rival}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">Reputação Global</div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.floor(data.globalReputation || 0)
                                        ? 'text-amber-400 fill-amber-400'
                                        : star - 0.5 <= (data.globalReputation || 0)
                                            ? 'text-amber-400 fill-amber-200'
                                            : 'text-neutral-300'
                                    }`}
                            />
                        ))}
                        <span className="text-xs font-medium text-neutral-600 ml-1">{data.globalReputation}/5</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
