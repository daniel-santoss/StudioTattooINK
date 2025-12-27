
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Matchmaker: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    serviceType: '', 
    style: '',
    placement: '',
    color: ''
  });

  // Estado para o Modal
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);

  // Dados dos artistas (Mock)
  const artists = [
    { 
        id: 1, 
        name: "Alex Rivera", 
        styles: ["Realismo", "Preto e Cinza", "Retratos", "Tatuagem"], 
        img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400",
        rating: 4.7,
        ratingCount: 2899,
        summary: "Muitos clientes elogiaram a precisão cirúrgica nos retratos e a leveza da mão durante sessões longas.",
        portfolio: [
            { title: "Olhar Profundo", desc: "Estudo detalhado de olho humano com texturas de pele hiper-realistas em preto e cinza.", img: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600" },
            { title: "Guerreiro Nórdico", desc: "Retrato de viking com armadura detalhada. Foco em contraste e iluminação dramática.", img: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600" },
            { title: "Moto Custom", desc: "Realismo mecânico, destacando reflexos metálicos e detalhes do motor.", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    { 
        id: 2, 
        name: "Sarah Vane", 
        styles: ["Neo Tradicional", "Colorido", "Botânico", "Tatuagem", "Piercing"], 
        img: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=400",
        rating: 5.0,
        ratingCount: 1450,
        summary: "Avaliada positivamente pela saturação incrível das cores e também realiza perfurações básicas e avançadas.",
        portfolio: [
            { title: "Lady Rose", desc: "Rosto feminino estilizado com rosas vermelhas vibrantes.", img: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600" },
            { title: "Adaga & Coração", desc: "Clássico Neo Tradicional com paleta de cores outonal.", img: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600" },
            { title: "Piercing Helix", desc: "Aplicação de joia em titânio com pedras swarovski.", img: "https://images.unsplash.com/photo-1606707764560-61d02bd93523?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    { 
        id: 3, 
        name: "Mike Chen", 
        styles: ["Oriental", "Irezumi", "Dragões", "Tatuagem"], 
        img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=400",
        rating: 4.8,
        ratingCount: 920,
        summary: "Clientes destacam o respeito às tradições orientais e a fluidez como os desenhos se encaixam no corpo.",
        portfolio: [
            { title: "Dragão Ryu", desc: "Fechamento de costas completo com Dragão japonês.", img: "https://images.unsplash.com/photo-1565507724810-75460290137d?auto=format&fit=crop&q=80&w=600" },
            { title: "Máscara Hannya", desc: "Máscara Hannya em meio a flores de cerejeira.", img: "https://images.unsplash.com/photo-1621112904891-2867e0ce5854?auto=format&fit=crop&q=80&w=600" },
            { title: "Carpa Koi", desc: "Símbolo de perseverança, subindo a cachoeira.", img: "https://images.unsplash.com/photo-1614948592934-7772740a8570?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    { 
        id: 4, 
        name: "Elena Rosa", 
        styles: ["Fine Line", "Minimalismo", "Escrita", "Tatuagem", "Piercing"], 
        img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400&auto=format&fit=crop",
        rating: 4.9,
        ratingCount: 1105,
        summary: "Frequentemente citada pela delicadeza do traço fino e procedimentos de piercing delicados.",
        portfolio: [
            { title: "Floral Delicado", desc: "Ramo de lavanda traço fino no antebraço.", img: "https://images.unsplash.com/photo-1560707303-4e980c5c855c?auto=format&fit=crop&q=80&w=600" },
            { title: "Septo", desc: "Perfuração de septo com joia dourada minimalista.", img: "https://images.unsplash.com/photo-1574926054530-540288c8e678?auto=format&fit=crop&q=80&w=600" },
            { title: "Borboleta", desc: "Geometria sagrada misturada com natureza.", img: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    { 
        id: 5, 
        name: "Lucas Silva", 
        styles: ["Blackwork", "Geométrico", "Pontilhismo", "Tatuagem"], 
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        rating: 4.7,
        ratingCount: 320,
        summary: "Elogiado pela solidez do preto e pela simetria perfeita nas formas geométricas complexas.",
        portfolio: [
            { title: "Mandala", desc: "Pontilhismo detalhado no ombro.", img: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600" },
            { title: "Bracelete Geo", desc: "Linhas sólidas e formas geométricas.", img: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600" },
            { title: "Blackout", desc: "Cobertura sólida em preto.", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    { 
        id: 6, 
        name: "Mariana Costa", 
        styles: ["Aquarela", "Colorido", "Sketch", "Tatuagem"], 
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        rating: 4.8,
        ratingCount: 580,
        summary: "Clientes adoram a mistura de cores vibrantes e o efeito de pintura fluida que ela consegue criar na pele.",
        portfolio: [
            { title: "Raposa", desc: "Estilo sketch com manchas de aquarela.", img: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600" },
            { title: "Universo", desc: "Galáxia colorida em formato de triângulo.", img: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600" },
            { title: "Beija-flor", desc: "Cores vibrantes e movimento.", img: "https://images.unsplash.com/photo-1578301978693-85ea9ec2a20c?auto=format&fit=crop&q=80&w=600" }
        ]
    }
  ];

  const handleSelect = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // Lógica para pular steps dependendo da escolha
    if (key === 'serviceType' && value === 'Piercing') {
        // Se for piercing, avança para style (step 2)
        setStep(2);
    } else if (key === 'style' && preferences.serviceType === 'Piercing') {
        // Se for piercing, ao escolher o tipo/local (Step 2), PULA o local genérico (Step 3) e cor (Step 4), vai para resultados (Step 5)
        setStep(5);
    } else {
        // Fluxo normal Tatuagem: 0 -> 1 -> 2 -> 3 -> 4 -> 5
        setStep(prev => prev + 1);
    }
  };

  const getRecommendations = () => {
    // Filtragem base
    let results = artists.filter(artist => {
        // Primeiro filtro: O artista faz o serviço? (Tatuagem vs Piercing)
        if (preferences.serviceType === 'Piercing' && !artist.styles.includes('Piercing')) {
            return false;
        }

        // Se for tatuagem, filtra por estilo
        if (preferences.serviceType === 'Tatuagem') {
            return artist.styles.some(s => s.toLowerCase().includes(preferences.style.toLowerCase())) || (preferences.style === 'Outros');
        }

        return true;
    });
    
    // Se sobrar poucos, preenche com os melhores avaliados (respeitando o tipo de serviço)
    if (results.length < 3) {
        const remaining = artists
            .filter(a => !results.includes(a) && (preferences.serviceType === 'Tatuagem' ? !a.styles.includes('PiercingOnly') : a.styles.includes('Piercing')))
            .sort((a, b) => b.rating - a.rating);
        results = [...results, ...remaining].slice(0, 3);
    }
    
    return results;
  };

  const recommendations = getRecommendations();

  // Opções de Tatuagem
  const tattooStyles = [
    { label: "Realismo", icon: "face" },
    { label: "Fine Line", icon: "edit" },
    { label: "Oriental", icon: "dragon" },
    { label: "Old School", icon: "anchor" },
    { label: "Neo Tradicional", icon: "local_florist" },
    { label: "Outros", icon: "more_horiz" },
  ];

  // Opções de Piercing (Adaptando o step de "Estilo" para "Tipo/Local")
  const piercingTypes = [
    { label: "Orelha (Lóbulo/Helix)", icon: "hearing" },
    { label: "Facial (Nariz/Sobranc.)", icon: "face_3" },
    { label: "Oral (Labret/Língua)", icon: "sentiment_satisfied" },
    { label: "Corporal (Umbigo/Mamilo)", icon: "accessibility_new" },
    { label: "Genital", icon: "wc" },
    { label: "Microdermal", icon: "diamond" },
  ];

  return (
    <div className="min-h-screen py-12 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
             <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl w-full relative z-10">
            {/* Step 0: Intro */}
            {step === 0 && (
                <div className="text-center animate-fade-in max-w-3xl mx-auto">
                    <div className="size-20 bg-surface-light border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10">
                        <span className="material-symbols-outlined text-4xl text-primary">auto_fix_high</span>
                    </div>
                    <h1 className="font-tattoo text-5xl md:text-6xl text-white mb-6">Encontre seu Artista</h1>
                    <p className="text-xl text-text-muted mb-10 max-w-xl mx-auto">
                        Responda a algumas perguntas rápidas e nossa inteligência indicará o profissional perfeito para transformar sua ideia em realidade.
                    </p>
                    <button 
                        onClick={() => setStep(1)}
                        className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(212,17,50,0.3)] hover:shadow-[0_0_40px_rgba(212,17,50,0.5)] transition-all transform hover:-translate-y-1"
                    >
                        Começar Agora
                    </button>
                </div>
            )}

            {/* Step 1: Service Type Selection */}
            {step === 1 && (
                <div className="animate-fade-in max-w-3xl mx-auto">
                    <button onClick={() => setStep(0)} className="text-text-muted hover:text-white mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined">arrow_back</span> Voltar
                    </button>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">O que você deseja fazer?</h2>
                    <p className="text-text-muted mb-8">Escolha o tipo de serviço que está procurando.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={() => handleSelect('serviceType', 'Tatuagem')}
                            className="group h-48 bg-surface-dark hover:bg-surface-light border border-border-dark hover:border-primary/50 rounded-2xl transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <span className="material-symbols-outlined text-5xl text-white relative z-10 drop-shadow-lg">ink_pen</span>
                            <span className="text-2xl font-bold text-white uppercase tracking-widest relative z-10 group-hover:scale-105 transition-transform">Tatuagem</span>
                        </button>

                        <button 
                            onClick={() => handleSelect('serviceType', 'Piercing')}
                            className="group h-48 bg-surface-dark hover:bg-surface-light border border-border-dark hover:border-blue-500/50 rounded-2xl transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574926054530-540288c8e678?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <span className="material-symbols-outlined text-5xl text-white relative z-10 drop-shadow-lg">diamond</span>
                            <span className="text-2xl font-bold text-white uppercase tracking-widest relative z-10 group-hover:scale-105 transition-transform">Piercing</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Style (Tattoo) OR Type (Piercing) */}
            {step === 2 && (
                <div className="animate-fade-in max-w-3xl mx-auto">
                    <button onClick={() => setStep(1)} className="text-text-muted hover:text-white mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined">arrow_back</span> Voltar
                    </button>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">
                        {preferences.serviceType === 'Tatuagem' ? 'Qual o estilo da tatuagem?' : 'Qual o local do Piercing?'}
                    </h2>
                    <p className="text-text-muted mb-8">Selecione o que mais se aproxima da sua ideia.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(preferences.serviceType === 'Tatuagem' ? tattooStyles : piercingTypes).map((opt) => (
                            <button 
                                key={opt.label}
                                onClick={() => handleSelect('style', opt.label)}
                                className="group h-40 w-full bg-surface-dark hover:bg-surface-light border border-border-dark hover:border-primary/50 p-6 rounded-2xl transition-all text-left flex flex-col justify-between"
                            >
                                <span className="material-symbols-outlined text-3xl text-text-muted group-hover:text-primary transition-colors">{opt.icon}</span>
                                <span className="font-bold text-white text-lg leading-tight group-hover:translate-x-1 transition-transform">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3: Placement (Generic Placement - Only for Tattoo) */}
            {step === 3 && (
                <div className="animate-fade-in max-w-3xl mx-auto">
                    <button onClick={() => setStep(2)} className="text-text-muted hover:text-white mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined">arrow_back</span> Voltar
                    </button>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Onde será a aplicação?</h2>
                    <p className="text-text-muted mb-8">Isso nos ajuda a entender a complexidade.</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {["Braço / Antebraço", "Perna / Coxa", "Costas", "Peito", "Mãos / Pés", "Pescoço / Rosto"].map((place) => (
                            <button 
                                key={place}
                                onClick={() => handleSelect('placement', place)}
                                className="p-4 rounded-xl border border-border-dark bg-surface-dark hover:bg-surface-light hover:border-white/30 text-white font-medium transition-all text-left"
                            >
                                {place}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 4: Color (Only for Tattoo) */}
            {step === 4 && (
                <div className="animate-fade-in max-w-3xl mx-auto">
                     <button onClick={() => setStep(3)} className="text-text-muted hover:text-white mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined">arrow_back</span> Voltar
                    </button>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Preferência de Cor</h2>
                    <p className="text-text-muted mb-8">Como você imagina o resultado final?</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={() => handleSelect('color', 'Black & Grey')}
                            className="h-40 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-border-dark hover:border-white transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="size-12 rounded-full bg-gray-800 border border-gray-600"></div>
                            <span className="font-bold text-white text-lg">Preto e Cinza</span>
                        </button>
                        <button 
                            onClick={() => handleSelect('color', 'Colorido')}
                            className="h-40 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-border-dark hover:border-primary transition-all flex flex-col items-center justify-center gap-3 group"
                        >
                             <div className="size-12 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-primary"></div>
                            <span className="font-bold text-white text-lg">Colorido</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 5: Results (Grid Cards) */}
            {step === 5 && (
                <div className="animate-fade-in">
                    <div className="text-center mb-12">
                        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Resultado da Análise</p>
                        <h2 className="text-4xl md:text-5xl font-tattoo text-white">Recomendamos para você</h2>
                        <p className="text-text-muted mt-2">
                            {preferences.serviceType} • <span className="text-white">{preferences.style}</span>
                            {/* Mostra local apenas se tiver (Tattoo) */}
                            {preferences.placement && <> • <span className="text-white">{preferences.placement}</span></>}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {recommendations.map((artist) => (
                             <div key={artist.id} className="bg-[#121212] border border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 transition-all group flex flex-col shadow-lg hover:shadow-2xl hover:shadow-primary/5">
                                {/* Imagem e Nota Overlay */}
                                <div className="h-56 overflow-hidden relative">
                                    <img src={artist.img} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white leading-tight mb-1">{artist.name}</h3>
                                            <div className="flex flex-wrap gap-1">
                                                {artist.styles.slice(0, 3).map((s: string) => (
                                                    <span key={s} className="text-[9px] uppercase font-bold text-white/90 bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/5">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 shadow-lg">
                                            <span className="material-symbols-outlined text-amber-500 text-sm fill-current">star</span>
                                            <span className="text-white font-bold text-sm">{artist.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* AI Summary Block */}
                                    <div className="bg-surface-light/30 rounded-xl p-4 mb-6 border border-white/5 relative flex-1">
                                        <div className="absolute -top-3 left-3 bg-surface-dark px-2 py-0.5 rounded border border-primary/30 flex items-center gap-1 shadow-sm">
                                             <span className="material-symbols-outlined text-primary text-[12px]">auto_awesome</span>
                                             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Resumo IA</span>
                                        </div>
                                        <p className="text-sm text-zinc-300 italic leading-relaxed pt-2">
                                            "{artist.summary}"
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigate(`/book?artistId=${artist.id}`)}
                                            className="flex-1 bg-white text-black hover:bg-gray-200 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20"
                                        >
                                            Agendar Sessão
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                        <button 
                                            onClick={() => setSelectedArtist(artist)}
                                            className="size-[48px] flex items-center justify-center rounded-xl border border-white/10 hover:bg-white/10 text-white transition-all bg-surface-light/50 group/eye"
                                            title="Ver Portfólio"
                                        >
                                            <span className="material-symbols-outlined text-lg group-hover/eye:scale-110 transition-transform">visibility</span>
                                        </button>
                                    </div>
                                </div>
                             </div>
                        ))}
                        {recommendations.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-border-dark rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-text-muted mb-4">sentiment_dissatisfied</span>
                                <h3 className="text-xl font-bold text-white mb-2">Nenhum artista encontrado</h3>
                                <p className="text-text-muted">Tente mudar seus filtros para encontrar um profissional.</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <button onClick={() => setStep(0)} className="text-text-muted hover:text-white text-sm font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-2 mx-auto">
                            <span className="material-symbols-outlined">refresh</span>
                            Refazer Teste
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Modal Portfólio Refinado */}
        {selectedArtist && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedArtist(null)}>
                 <div className="bg-[#121212] border border-border-dark rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-border-dark flex items-center justify-between sticky top-0 bg-[#121212] z-10">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img src={selectedArtist.img} alt={selectedArtist.name} className="size-[64px] rounded-full object-cover border-[3px] border-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white leading-tight mb-1">{selectedArtist.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-sm">{selectedArtist.rating}</span>
                                    <div className="flex text-amber-500">
                                        {[1,2,3,4,5].map(s => (
                                            <span key={s} className="material-symbols-outlined text-sm fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        ))}
                                    </div>
                                    <span className="text-text-muted text-sm ml-1">({selectedArtist.ratingCount.toLocaleString('pt-BR')})</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedArtist(null)} className="size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Grid de Imagens */}
                    <div className="p-6 md:p-8 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {selectedArtist.portfolio.map((item: any, idx: number) => (
                                <div key={idx} className="aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-border-dark group relative shadow-lg">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    
                                    {/* Overlay com Texto */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                        <h3 className="text-white font-black text-lg mb-2 leading-tight">{item.title}</h3>
                                        <div className="w-10 h-0.5 bg-primary mb-3"></div>
                                        <p className="text-zinc-300 text-xs font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {/* Caso precise preencher visualmente se tiver poucas fotos */}
                            {selectedArtist.portfolio.length < 3 && (
                                <div className="aspect-[3/4] rounded-2xl bg-surface-dark/50 border border-border-dark border-dashed flex items-center justify-center">
                                    <span className="text-text-muted text-sm font-bold uppercase tracking-widest">Mais em breve</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 md:p-8 border-t border-border-dark bg-[#0d0d0d] flex flex-col md:flex-row justify-between items-center mt-auto gap-4">
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden md:block">INK STUDIO • ARTIST PORTFOLIO</span>
                         <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                             <button 
                                onClick={() => navigate(`/artist-profile?id=${selectedArtist.id}`)} 
                                className="px-6 py-4 border border-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                             >
                                VER PERFIL COMPLETO
                             </button>
                             <button 
                                onClick={() => navigate(`/book?artistId=${selectedArtist.id}`)} 
                                className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/10 hover:shadow-primary/30"
                             >
                                AGENDAR COM ESTE ARTISTA
                             </button>
                         </div>
                    </div>
                 </div>
             </div>
        )}
    </div>
  );
};

export default Matchmaker;
