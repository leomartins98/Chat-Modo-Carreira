import { Target } from 'lucide-react';

const priorityStyles = {
    CRITICAL: 'bg-red-50 text-red-600 border-red-200/60',
    HIGH: 'bg-orange-50 text-orange-600 border-orange-200/60',
    MEDIUM: 'bg-blue-50 text-blue-600 border-blue-200/60',
    LOW: 'bg-green-50 text-green-600 border-green-200/60',
};

const priorityLabels = {
    CRITICAL: 'CRÍTICO',
    HIGH: 'ALTO',
    MEDIUM: 'MÉDIO',
    LOW: 'BAIXO',
};

const dotColors = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-green-500',
};

export default function BoardExpectations({ data }) {
    if (!data || !data.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">Expectativas da Diretoria</h2>
            </div>

            <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColors[item.priority] || 'bg-neutral-400'}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-neutral-800">{item.category}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider border ${priorityStyles[item.priority] || 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
                                    {priorityLabels[item.priority] || item.priority}
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
