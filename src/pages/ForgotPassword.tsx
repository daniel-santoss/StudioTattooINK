
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulação de envio de e-mail de recuperação
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    const handleResend = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Simula reenvio
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-0 bg-[url('/images/tattooPiercing/tattooRealista1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
                {!sent ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                            </div>
                            <h1 className="font-tattoo text-4xl text-white mb-2">Recuperar Senha</h1>
                            <p className="text-text-muted text-sm font-display tracking-wide">
                                Informe seu e-mail para receber as instruções de recuperação.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted group-focus-within:text-white transition-colors">mail</span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 text-white placeholder-zinc-700 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-400 text-lg">error</span>
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_25px_rgba(212,17,50,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        Enviar Instruções
                                        <span className="material-symbols-outlined text-lg">send</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Login Link */}
                        <div className="mt-8 text-center border-t border-border-dark pt-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-text-muted hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Voltar para o Login
                            </button>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="text-center py-4">
                        <div className="size-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                            <span className="material-symbols-outlined text-green-400 text-4xl">mark_email_read</span>
                        </div>
                        <h2 className="font-tattoo text-3xl text-white mb-3">E-mail Enviado!</h2>
                        <p className="text-text-muted text-sm font-display tracking-wide mb-2">
                            Enviamos as instruções de recuperação para:
                        </p>
                        <p className="text-white font-medium mb-6 bg-background-dark px-4 py-2 rounded-lg inline-block border border-border-dark">
                            {email}
                        </p>

                        {/* Instructions */}
                        <div className="bg-background-dark border border-border-dark rounded-xl p-5 text-left mb-6">
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">info</span>
                                Próximos Passos
                            </h3>
                            <ul className="space-y-2 text-sm text-text-muted">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    Verifique sua caixa de entrada
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    Clique no link enviado no e-mail
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    Crie uma nova senha segura
                                </li>
                            </ul>
                            <p className="text-xs text-text-muted mt-4 pt-3 border-t border-border-dark">
                                <span className="material-symbols-outlined text-yellow-500 text-sm align-middle mr-1">schedule</span>
                                O link expira em 30 minutos.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="w-full bg-surface-light hover:bg-zinc-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                        Reenviando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">refresh</span>
                                        Reenviar E-mail
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full border border-border-dark hover:border-primary text-text-muted hover:text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Voltar para o Login
                            </button>
                        </div>

                        {/* Support */}
                        <p className="text-xs text-text-muted mt-6">
                            Não recebeu o e-mail? Verifique a pasta de spam ou{' '}
                            <a href="#" className="text-primary hover:text-white transition-colors">
                                entre em contato conosco
                            </a>
                            .
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
