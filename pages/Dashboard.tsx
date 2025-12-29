
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RatingDisplay } from '../components/RatingDisplay';

interface Review {
    id: number;
    rating: number;
    comment: string;
    date: string;
    service: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);

    // States for Artist Dashboard
    const [monthlyGoal, setMonthlyGoal] = useState<number>(15000);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempGoal, setTempGoal] = useState<string>("15000");

    // Review Modal States
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');

    const currentRevenue = 12500; // Mock current revenue

    // Mock Reviews Data (Expanded)
    const reviews: Review[] = [
        { id: 1, rating: 5, comment: "Trabalho impecável! O traço é muito fino e o ambiente super limpo.", date: "Há 2 dias", service: "Tatuagem Fine Line" },
        { id: 2, rating: 5, comment: "Profissional extremamente atencioso. Adorei o resultado final.", date: "Há 5 dias", service: "Realismo" },
        { id: 3, rating: 4, comment: "Muito bom, mas a sessão atrasou um pouco.", date: "Há 1 semana", service: "Old School" },
        { id: 4, rating: 5, comment: "Melhor experiência que já tive em um estúdio.", date: "Há 2 semanas", service: "Piercing" },
        { id: 5, rating: 3, comment: "O resultado ficou bom, mas achei o valor final um pouco acima do combinado.", date: "Há 3 semanas", service: "Cobertura" },
        { id: 6, rating: 5, comment: "Mãos de fada! Não senti quase nada de dor.", date: "Há 1 mês", service: "Tatuagem Minimalista" },
        { id: 7, rating: 4.7, comment: "Gostei do atendimento, voltarei em breve.", date: "Há 1 mês", service: "Retoque" },
        { id: 8, rating: 2, comment: "A cicatrização não foi muito boa, tive que voltar.", date: "Há 2 meses", service: "Colorido" },
    ];

    const filteredReviews = reviewFilter === 'all'
        ? reviews
        : reviews.filter(r => r.rating >= (reviewFilter as number) && r.rating < (reviewFilter as number) + 1);

    useEffect(() => {
        const userRole = localStorage.getItem('ink_role');
        setRole(userRole);
    }, []);

    const handleSaveGoal = () => {
        const value = parseFloat(tempGoal);
        if (isNaN(value) || value < 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }
        setMonthlyGoal(value);
        setIsEditingGoal(false);
    };

    const percentage = Math.min(100, Math.round((currentRevenue / monthlyGoal) * 100));

    const adminCards = [
        {
            title: "Solicitações",
            count: "3 Pendentes",
            description: "Gerencie novas candidaturas de tatuadores.",
            icon: "person_add",
            path: "/admin/requests",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "hover:border-blue-500/50"
        },
        {
            title: "Clientes",
            count: "350 Ativos",
            description: "Visualize, adicione ou remova clientes.",
            icon: "groups",
            path: "/admin/clients",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "hover:border-emerald-500/50"
        },
        {
            title: "Tatuadores",
            count: "4 Membros",
            description: "Gerencie a equipe do estúdio.",
            icon: "badge",
            path: "/admin/staff",
            color: "text-primary",
            bg: "bg-primary/10",
            border: "hover:border-primary/50"
        }
    ];

    if (role === 'artist') {
        return (
            <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="font-tattoo text-4xl text-white mb-2">Visão Geral Financeira</h1>
                    <p className="text-text-muted text-sm">Acompanhe seu desempenho e faturamento deste mês.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-emerald-500">payments</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Faturamento Bruto</p>
                            <h2 className="text-3xl font-display font-bold text-white mb-4">R$ {currentRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +15% vs mês anterior
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-primary">store</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Taxa do Estúdio (40%)</p>
                            <h2 className="text-3xl font-display font-bold text-white mb-4 text-opacity-80">R$ {(currentRevenue * 0.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                            <p className="text-xs text-text-muted">Custos operacionais.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-surface-dark border border-primary/30 rounded-2xl p-6 relative overflow-hidden group shadow-lg shadow-primary/10">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">account_balance_wallet</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-primary-hover text-xs font-bold uppercase tracking-widest mb-1">Lucro Líquido</p>
                            <h2 className="text-4xl font-display font-bold text-white mb-4">R$ {(currentRevenue * 0.6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-white text-lg">Meta Mensal</h3>
                            </div>
                            {!isEditingGoal ? (
                                <button onClick={() => { setTempGoal(monthlyGoal.toString()); setIsEditingGoal(true); }} className="text-text-muted hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditingGoal(false)} className="text-red-500 hover:text-red-400">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                    <button onClick={handleSaveGoal} className="text-emerald-500 hover:text-emerald-400">
                                        <span className="material-symbols-outlined">check</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditingGoal ? (
                            <div className="mb-4">
                                <input type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} className="bg-background-dark border border-border-dark rounded px-2 py-1 text-white w-full focus:border-primary" autoFocus />
                            </div>
                        ) : (
                            <div className="relative h-4 bg-surface-light rounded-full overflow-hidden mb-2">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-primary rounded-full shadow-[0_0_10px_rgba(212,17,50,0.5)] transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                            </div>
                        )}

                        <div className="flex justify-between text-xs text-text-muted mt-2 font-bold">
                            <span>Atual: R$ {currentRevenue.toLocaleString('pt-BR')}</span>
                            <span className="text-white">{percentage}% Concluído</span>
                            <span>Meta: R$ {monthlyGoal.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg mb-1">Qualidade do Serviço</h3>
                                <p className="text-text-muted text-xs">Baseado em {reviews.length} avaliações.</p>
                            </div>
                            <div className="size-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined">hotel_class</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            {/* Usando o componente de Rating fracionado com estrelas azuis conforne referência */}
                            <RatingDisplay rating={4.8} count={2899} size="24px" activeColor="text-blue-500" />
                            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">Excelente Performance</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-2xl">reviews</span>
                            <h2 className="text-xl font-bold text-white">Avaliações Recentes</h2>
                        </div>
                        <button onClick={() => setIsReviewsModalOpen(true)} className="text-primary hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            Ver todas
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.slice(0, 4).map((review) => (
                            <div key={review.id} className="bg-background-dark border border-border-dark p-4 rounded-xl hover:border-white/20 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <RatingDisplay rating={review.rating} size="14px" showText={false} activeColor="text-blue-500" />
                                    <span className="text-[10px] font-bold text-text-muted bg-surface-light px-2 py-0.5 rounded uppercase">{review.date}</span>
                                </div>
                                <p className="text-white text-sm mb-3 italic">"{review.comment}"</p>
                                <div className="flex justify-between items-center pt-3 border-t border-border-dark">
                                    <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">person_off</span>
                                        Anônimo
                                    </span>
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{review.service}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isReviewsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-4xl shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-border-dark flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Todas as Avaliações</h2>
                                <button onClick={() => setIsReviewsModalOpen(false)} className="text-text-muted hover:text-white">
                                    <span className="material-symbols-outlined text-2xl">close</span>
                                </button>
                            </div>
                            <div className="p-4 border-b border-border-dark bg-background-dark/50 flex flex-wrap gap-2">
                                <button onClick={() => setReviewFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all ${reviewFilter === 'all' ? 'bg-primary text-white border-primary' : 'bg-surface-light text-text-muted border-border-dark'}`}>Todas</button>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <button key={star} onClick={() => setReviewFilter(star)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all flex items-center gap-1 ${reviewFilter === star ? 'bg-blue-500/20 text-blue-500 border-blue-500' : 'bg-surface-light text-text-muted border-border-dark'}`}>{star} ★</button>
                                ))}
                            </div>
                            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredReviews.map((review) => (
                                    <div key={review.id} className="bg-background-dark border border-border-dark p-4 rounded-xl h-fit">
                                        <div className="flex justify-between items-start mb-3">
                                            <RatingDisplay rating={review.rating} size="14px" showText={false} activeColor="text-blue-500" />
                                            <span className="text-[10px] font-bold text-text-muted bg-surface-light px-2 py-0.5 rounded uppercase">{review.date}</span>
                                        </div>
                                        <p className="text-white text-sm mb-3 italic">"{review.comment}"</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-border-dark">
                                            <span className="text-xs font-bold text-text-muted">Cliente Anônimo</span>
                                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{review.service}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
            <div className="mb-12 text-center md:text-left">
                <h1 className="font-tattoo text-4xl md:text-6xl text-white mb-4">Gerenciamento</h1>
                <p className="text-text-muted font-display text-lg tracking-wide max-w-2xl">Acesse as ferramentas administrativas do Ink Studio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {adminCards.map((card, idx) => (
                    <button key={idx} onClick={() => navigate(card.path)} className={`flex flex-col items-start p-8 bg-surface-dark border border-border-dark rounded-2xl transition-all group hover:-translate-y-2 hover:shadow-2xl ${card.border}`}>
                        <div className={`size-16 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}><span className="material-symbols-outlined text-4xl">{card.icon}</span></div>
                        <h2 className="text-3xl font-bold text-white mb-2">{card.title}</h2>
                        <span className={`text-sm font-bold uppercase tracking-wider mb-4 ${card.color}`}>{card.count}</span>
                        <p className="text-text-muted text-left mb-8 flex-1">{card.description}</p>
                        <div className="w-full flex items-center justify-between pt-6 border-t border-border-dark group-hover:border-white/10"><span className="text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4">Acessar</span><span className="material-symbols-outlined text-white transition-transform group-hover:translate-x-1">arrow_forward</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
