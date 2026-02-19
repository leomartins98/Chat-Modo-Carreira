import { ArrowRightLeft, TrendingUp, GraduationCap, Globe2 } from 'lucide-react';

const iconMap = {
    'sell-high': TrendingUp,
    'pipeline': Globe2,
    'graduates': GraduationCap,
};

export default function TransferPhilosophy({ data }) {
    if (!data || !data.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <ArrowRightLeft className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">Filosofia de Transferências</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.map((rule, i) => {
                    const Icon = iconMap[rule.icon] || TrendingUp;

                    return (
                        <div key={i} className="text-center p-4 bg-surface-50 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-neutral-100">
                                <Icon className="w-5 h-5 text-neutral-600" />
                            </div>
                            <h3 className="text-xs font-bold text-neutral-900 mb-1.5">{rule.title}</h3>
                            <p className="text-[10px] text-neutral-500 leading-relaxed">{rule.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
