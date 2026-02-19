import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const badgeStyles = {
    High: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200/60',
    Low: 'bg-orange-50 text-orange-700 border-orange-200/60',
    Deficit: 'bg-red-50 text-red-700 border-red-200/60',
};

const badgeIcons = {
    High: TrendingUp,
    Medium: Minus,
    Low: TrendingDown,
    Deficit: TrendingDown,
};

const badgeLabels = {
    High: 'Alto',
    Medium: 'Médio',
    Low: 'Baixo',
    Deficit: 'Déficit',
};

export default function FinancialStatus({ data }) {
    if (!data) return null;

    const BadgeIcon = badgeIcons[data.profitBadge] || Minus;

    return (
        <div className="bg-white rounded-2xl border border-neutral-200/60 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neutral-600" />
                    <h2 className="text-sm font-bold text-neutral-900">Status Financeiro</h2>
                </div>
                <span className="text-lg font-bold text-neutral-900">{data.transferBudget}</span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">{data.profitStatus}</p>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Orçamento de Transferências</span>
                    <span className="text-sm font-semibold text-neutral-800">{data.transferBudget}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Folha Salarial</span>
                    <span className="text-sm font-semibold text-neutral-800">{data.wageBudget}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Valor do Clube</span>
                    <span className="text-sm font-semibold text-neutral-800">{data.clubValue}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border ${badgeStyles[data.profitBadge] || 'bg-neutral-50 text-neutral-700 border-neutral-200'}`}>
                    <BadgeIcon className="w-3 h-3" />
                    Lucro projetado: {badgeLabels[data.profitBadge] || data.profitBadge}
                </div>
            </div>
        </div>
    );
}
