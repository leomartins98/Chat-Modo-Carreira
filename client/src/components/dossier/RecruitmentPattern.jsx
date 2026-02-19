import { Radar, Tag, UserCheck, ArrowDownUp } from 'lucide-react';

const FEE_COLOR = (fee) => {
    if (!fee) return 'text-neutral-400';
    const f = fee.toLowerCase();
    if (f.includes('livre') || f.includes('free')) return 'text-emerald-600';
    if (f.includes('emp') || f.includes('loan')) return 'text-blue-600';
    return 'text-neutral-700';
};

export default function RecruitmentPattern({ data }) {
    if (!data) return null;

    const { summary, lastSignings, patternTags, playerProfile } = data;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <Radar className="w-4 h-4 text-neutral-600" />
                <h2 className="text-sm font-bold text-neutral-900">Padrão Real de Contratação</h2>
            </div>

            {/* Summary */}
            {summary && (
                <p className="text-xs text-neutral-600 leading-relaxed mb-5 border-l-2 border-neutral-300 pl-3">
                    {summary}
                </p>
            )}

            {/* Pattern Tags */}
            {patternTags && patternTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {patternTags.map((tag, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200"
                        >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Last 10 Signings Table */}
            {lastSignings && lastSignings.length > 0 && (
                <div className="mb-5">
                    <div className="flex items-center gap-1.5 mb-2">
                        <ArrowDownUp className="w-3 h-3 text-neutral-400" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            Últimas Contratações Analisadas
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-neutral-100">
                        <table className="w-full text-[10px]">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-100">
                                    <th className="text-left px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider">Jogador</th>
                                    <th className="text-left px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Origem</th>
                                    <th className="text-left px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider">Nac.</th>
                                    <th className="text-center px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider">Pos</th>
                                    <th className="text-center px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider">Idade</th>
                                    <th className="text-center px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider hidden md:table-cell">Ano</th>
                                    <th className="text-right px-3 py-2 font-semibold text-neutral-400 uppercase tracking-wider">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lastSignings.map((s, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                                    >
                                        <td className="px-3 py-2 font-semibold text-neutral-800">{s.name}</td>
                                        <td className="px-3 py-2 text-neutral-500 hidden sm:table-cell">{s.from}</td>
                                        <td className="px-3 py-2 text-neutral-500">{s.nationality}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className="font-mono font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">
                                                {s.position}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center text-neutral-600">{s.age}</td>
                                        <td className="px-3 py-2 text-center text-neutral-400 hidden md:table-cell">{s.year}</td>
                                        <td className={`px-3 py-2 text-right font-semibold ${FEE_COLOR(s.fee)}`}>
                                            {s.fee}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Player Profile Archetype */}
            {playerProfile && (
                <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            Arquétipo do Jogador Contratado
                        </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{playerProfile}</p>
                </div>
            )}
        </div>
    );
}
