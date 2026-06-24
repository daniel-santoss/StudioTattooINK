'use client';


import React, { useState } from 'react';

interface Report {
    id: string;
    type: 'client_report' | 'artist_report';
    reporterName: string;
    reporterImage: string;
    reportedName: string;
    reportedImage: string;
    date: string;
    category: string;
    description: string;
    status: 'Pendente' | 'Em Análise' | 'Resolvido';
    severity: 'Baixa' | 'Média' | 'Alta';
}

const Reports: React.FC<{ reports: Report[] }> = ({ reports }) => {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const [filterSeverity, setFilterSeverity] = useState('Todas');
    const [filterStatus, setFilterStatus] = useState('Todos');
    const [sortOrder, setSortOrder] = useState('newest');

    const handleOpenDetails = (report: Report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const getSeverityStyle = (sev: string) => {
        switch (sev) {
            case 'Alta': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Média': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Resolvido': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Em Análise': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-text-muted bg-surface-light border-border-dark';
        }
    };

    const parseDate = (dateStr: string) => {
        const months: { [key: string]: string } = {
            'Jan': 'Jan', 'Fev': 'Feb', 'Mar': 'Mar', 'Abr': 'Apr', 'Mai': 'May', 'Jun': 'Jun',
            'Jul': 'Jul', 'Ago': 'Aug', 'Set': 'Sep', 'Out': 'Oct', 'Nov': 'Nov', 'Dez': 'Dec'
        };
        const parts = dateStr.split(' '); // ["20", "Out,", "2024"]
        if (parts.length < 3) return 0;
        const day = parts[0];
        const monthRaw = parts[1].replace(',', '');
        const year = parts[2];
        const month = months[monthRaw] || monthRaw;
        return new Date(`${month} ${day} ${year}`).getTime();
    };

    const filteredReports = reports
        .filter(r => filterSeverity === 'Todas' || r.severity === filterSeverity)
        .filter(r => filterStatus === 'Todos' || r.status === filterStatus)
        .sort((a, b) => {
            const timeA = parseDate(a.date);
            const timeB = parseDate(b.date);
            return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
        });

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Ocorrências</h1>
                    <p className="text-text-muted text-sm">Gerencie reports enviados por clientes e equipe.</p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${showFilters
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-surface-light text-text-muted hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span className="material-symbols-outlined">filter_list</span>
                    Filtros
                    <span className={`material-symbols-outlined text-sm transition-transform ${showFilters ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-8 bg-surface-dark border border-border-dark rounded-xl p-6 animate-fade-in shadow-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Gravidade</label>
                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                            >
                                <option value="Todas">Todas</option>
                                <option value="Baixa">Baixa</option>
                                <option value="Média">Média</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Análise">Em Análise</option>
                                <option value="Resolvido">Resolvido</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Momento</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                            >
                                <option value="newest">Mais Recente</option>
                                <option value="oldest">Mais Antigo</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilterSeverity('Todas');
                                    setFilterStatus('Todos');
                                    setSortOrder('newest');
                                }}
                                className="w-full py-2.5 border border-border-dark hover:bg-white/5 text-text-muted hover:text-white rounded-lg font-bold text-sm transition-colors uppercase tracking-wide"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {filteredReports.length > 0 ? filteredReports.map((report) => (
                    <div key={report.id} className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-primary/30 transition-all group animate-fade-in">
                        <div className="flex flex-col items-center justify-center gap-2 min-w-[80px]">
                            <img
                                src={report.reporterImage}
                                alt={report.reporterName}
                                className="size-14 rounded-full object-cover border-2 border-surface-light shadow-lg"
                            />
                            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                                {report.type === 'client_report' ? 'Cliente' : 'Artista'}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h3 className="text-lg font-bold text-white">{report.category}</h3>
                                <span className="text-xs text-text-muted flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span> {report.date}
                                </span>
                            </div>

                            <p className="text-text-muted text-sm mb-4 line-clamp-2">{report.description}</p>

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-text-muted text-xs uppercase font-bold">Relator:</span>
                                    <span className="text-white font-bold">{report.reporterName}</span>
                                </div>
                                <span className="text-text-muted text-xs">→</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-text-muted text-xs uppercase font-bold">Reportado:</span>
                                    <div className="flex items-center gap-2 bg-surface-light px-2 py-1 rounded border border-white/5">
                                        <img src={report.reportedImage} alt={report.reportedName} className="size-5 rounded-full object-cover" />
                                        <span className="text-white font-bold">{report.reportedName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-border-dark pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border w-full text-center ${getSeverityStyle(report.severity)}`}>
                                {report.severity}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border w-full text-center ${getStatusStyle(report.status)}`}>
                                {report.status}
                            </span>
                            <button
                                onClick={() => handleOpenDetails(report)}
                                className="w-full py-1.5 text-xs font-bold text-text-muted hover:text-white border border-transparent hover:border-white/10 rounded transition-all uppercase tracking-wide"
                            >
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-text-muted mb-4">filter_list_off</span>
                        <h3 className="text-lg font-bold text-white mb-2">Nenhuma ocorrência</h3>
                        <p className="text-text-muted text-sm">Não há ocorrências para os filtros selecionados.</p>
                    </div>
                )}
            </div>

            {/* Modal Detail (somente leitura) */}
            {isModalOpen && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-border-dark">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <h3 className="text-xl font-bold text-white">Detalhes da Ocorrência</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6 bg-surface-light/20 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-bold mb-1">Motivo</p>
                                    <p className="text-lg font-bold text-white">{selectedReport.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-text-muted uppercase font-bold mb-1">Gravidade</p>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getSeverityStyle(selectedReport.severity)}`}>
                                        {selectedReport.severity}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs text-text-muted uppercase font-bold mb-2">Descrição Completa</p>
                                <div className="bg-background-dark border border-border-dark rounded-lg p-4 text-sm text-text-light leading-relaxed">
                                    "{selectedReport.description}"
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-bold mb-2">Quem Reportou</p>
                                    <div className="flex items-center gap-3">
                                        <img src={selectedReport.reporterImage} className="size-10 rounded-full border border-border-dark" />
                                        <div>
                                            <p className="text-sm font-bold text-white">{selectedReport.reporterName}</p>
                                            <p className="text-xs text-text-muted capitalize">{selectedReport.type === 'client_report' ? 'Cliente' : 'Tatuador'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted uppercase font-bold mb-2">Reportado</p>
                                    <div className="flex items-center gap-3 h-10 px-3 bg-surface-light rounded-lg border border-white/5">
                                        <img src={selectedReport.reportedImage} className="size-6 rounded-full object-cover" />
                                        <p className="text-sm font-bold text-white">{selectedReport.reportedName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ações de moderação ainda sem backend ("Em breve") */}
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark/50 rounded-b-2xl">
                            <button
                                disabled
                                title="Em breve"
                                className="px-4 py-2 border border-border-dark text-text-muted/40 rounded-lg font-bold text-sm cursor-not-allowed"
                            >
                                Marcar Em Análise
                            </button>
                            <button
                                disabled
                                title="Em breve"
                                className="px-6 py-2 bg-primary/40 text-white/60 rounded-lg font-bold text-sm cursor-not-allowed flex items-center gap-2"
                            >
                                Resolver Caso
                                <span className="text-[9px] tracking-wider border border-white/20 rounded px-1.5 py-0.5">Em breve</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
