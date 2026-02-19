import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import ClubHeader from '../components/dossier/ClubHeader';
import HistoryDNA from '../components/dossier/HistoryDNA';
import Legacy from '../components/dossier/Legacy';
import FinancialStatus from '../components/dossier/FinancialStatus';
import BoardExpectations from '../components/dossier/BoardExpectations';
import SquadPillars from '../components/dossier/SquadPillars';
import TransferPhilosophy from '../components/dossier/TransferPhilosophy';
import Roadmap from '../components/dossier/Roadmap';
import RecruitmentPattern from '../components/dossier/RecruitmentPattern';
import ScoutingReport from '../components/dossier/ScoutingReport';

export default function Dossier() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, clubName } = location.state || {};

    useEffect(() => {
        if (!data) navigate('/');
    }, [data, navigate]);

    if (!data) return null;

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col">
            <Header clubName={clubName} />

            <main className="flex-1 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
                {/* Linha 1: Cabeçalho do Clube + História e DNA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 animate-fade-in">
                    <ClubHeader data={data.club} />
                    <HistoryDNA data={data.historyDNA} />
                </div>

                {/* Linha 2: Legado + Financeiro + Diretoria */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4" style={{ animationDelay: '100ms' }}>
                    <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <Legacy data={data.legacy} />
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <FinancialStatus data={data.financialStatus} />
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                        <BoardExpectations data={data.boardExpectations} />
                    </div>
                </div>

                {/* Linha 3: Pilares do Elenco */}
                <div className="mb-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <SquadPillars data={data.squadPillars} />
                </div>

                {/* Linha 4: Filosofia de Transferências + Roadmap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <TransferPhilosophy data={data.transferPhilosophy} />
                    <Roadmap data={data.roadmap} />
                </div>

                {/* Linha 5: Padrão Real de Contratação */}
                {data.recruitmentPattern && (
                    <div className="mb-4 animate-slide-up" style={{ animationDelay: '350ms' }}>
                        <RecruitmentPattern data={data.recruitmentPattern} />
                    </div>
                )}

                {/* Linha 6: Relatório de Olheiros */}
                <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <ScoutingReport data={data.scoutingReport} />
                </div>
            </main>

            {/* Rodapé */}
            <footer className="px-6 py-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 tracking-wider border-t border-neutral-200/60">
                <span>Dossiê Gerado</span>
                <span className="uppercase">processado por gemini 2.5 flash</span>
            </footer>
        </div>
    );
}
