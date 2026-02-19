import { Trophy } from 'lucide-react';

export default function Legacy({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">Legado</h2>
            </div>

            {/* Troféus */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 text-center px-3 py-2.5 bg-surface-50 rounded-xl border border-neutral-100">
                    <div className="text-2xl font-bold text-neutral-900">{data.trophies?.league}</div>
                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">Liga</div>
                </div>
                <div className="flex-1 text-center px-3 py-2.5 bg-surface-50 rounded-xl border border-neutral-100">
                    <div className="text-2xl font-bold text-neutral-900">{data.trophies?.cup}</div>
                    <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mt-0.5">Copa</div>
                </div>
                <div className="flex-1 text-center px-3 py-2.5 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-xl border border-amber-200/50">
                    <div className="text-2xl font-bold text-amber-700">{data.trophies?.ucl}</div>
                    <div className="text-[9px] font-mono text-amber-500 uppercase tracking-wider mt-0.5">UCL</div>
                </div>
            </div>

            {/* Figuras Lendárias */}
            <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Figuras Lendárias</div>
            <div className="space-y-2">
                {data.legendaryFigures?.map((figure, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600 flex-shrink-0">
                            {figure.initials}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-medium text-neutral-800 truncate">{figure.name}</div>
                            <div className="text-[10px] text-neutral-400 italic">{figure.nickname}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
