import React from 'react';

interface FooterProps {
    onScrollToSection: (sectionId: string) => void;
    onNavigate: (path: string) => void;
}

/**
 * Footer público do site
 */
export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onNavigate }) => {
    return (
        <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 px-6 relative overflow-hidden">
            {/* Decorative background blur */}
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

                    {/* Coluna 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 text-white bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(212,17,50,0.4)]">
                                <span className="material-symbols-outlined text-xl">ink_pen</span>
                            </div>
                            <h2 className="font-tattoo text-2xl text-white tracking-wide">Ink Studio</h2>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Sua plataforma definitiva para agendar tatuagens e piercings com segurança. Conectamos você aos melhores artistas independentes do mercado.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
                                <span className="material-symbols-outlined text-lg">public</span>
                            </a>
                            <a href="#" className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                                <span className="material-symbols-outlined text-lg">alternate_email</span>
                            </a>
                        </div>
                    </div>

                    {/* Coluna 2: Links Úteis */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explorar</h3>
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={() => onScrollToSection('features')}
                                    className="text-text-muted hover:text-white text-sm transition-colors inline-block"
                                >
                                    Como funciona
                                </button>
                            </li>
                            <li>
                                <a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">
                                    Dúvidas Frequentes
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={() => onScrollToSection('gallery')}
                                    className="text-text-muted hover:text-white text-sm transition-colors inline-block"
                                >
                                    Galeria de Inspiração
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigate('/signup?type=artist')}
                                    className="text-primary font-bold text-sm transition-colors inline-flex items-center gap-2"
                                >
                                    Seja um Parceiro <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Legal */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Termos de Uso</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Política de Privacidade</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Diretrizes da Comunidade</a></li>
                            <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Segurança</a></li>
                        </ul>
                    </div>

                    {/* Coluna 4: Suporte */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Suporte</h3>
                        <div className="bg-surface-light/30 border border-white/5 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3 text-emerald-500">
                                <span className="material-symbols-outlined">headset_mic</span>
                                <span className="text-xs font-bold uppercase tracking-wider">100% Digital</span>
                            </div>
                            <p className="text-zinc-400 text-sm mb-4">
                                Precisa de ajuda com seu agendamento? Nossa equipe está online.
                            </p>
                            <a href="mailto:suporte@inkstudio.com" className="text-white font-bold hover:text-primary transition-colors text-sm break-all">
                                suporte@inkstudio.com
                            </a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} Ink Studio. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
