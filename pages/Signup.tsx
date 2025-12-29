
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import DatePicker from '../components/DatePicker';

// --- Componente Reutilizável de Select com Busca ---
interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    name?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Selecione...",
    disabled = false,
    loading = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Encontra o label do valor atual para exibir
    const selectedLabel = options.find(opt => opt.value === value)?.label || "";

    // Atualiza o termo de busca quando o valor muda externamente ou quando fecha
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm(selectedLabel);
        }
    }, [isOpen, selectedLabel, value]);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(selectedLabel); // Reseta o texto para o valor selecionado
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedLabel]);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearchTerm(""); // Limpa ao focar para facilitar busca
                    }}
                    placeholder={loading ? "Carregando..." : placeholder}
                    className={`w-full bg-background-dark border border-border-dark rounded-lg p-2.5 pr-8 text-white focus:border-primary text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? 'ring-1 ring-primary border-primary' : ''}`}
                />
                <div className="absolute right-2.5 top-2.5 text-text-muted pointer-events-none">
                    {loading ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    ) : (
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    )}
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-surface-dark border border-border-dark rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in scrollbar-thin scrollbar-thumb-surface-light">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-light transition-colors ${opt.value === value ? 'text-primary font-bold bg-surface-light/30' : 'text-white'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-text-muted text-center">
                            Nenhuma opção encontrada.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
// ---------------------------------------------------

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState<'client' | 'artist'>('client');
    const [step, setStep] = useState(1); // Controla a etapa do formulário
    const [loading, setLoading] = useState(false);

    // Estado para listas de Cidades (carregado via API IBGE)
    // Agora armazenamos objetos {value, label} para o componente customizado
    const [cityOptions, setCityOptions] = useState<Option[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Estado de erro do CEP
    const [cepError, setCepError] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        birthDate: '', // New
        phone: '', // New
        password: '',
        confirmPassword: '',
        // Address (New)
        cep: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        // Hidden internal state for neighborhood in case we need it later or API returns it
        neighborhood: '',
        // Artist specific
        artistRole: 'Tatuador',
        portfolio: '',
        experience: '',
        styles: [] as string[],
        customStyle: '',
        // Client specific
        allergies: '',
        medicalNotes: ''
    });

    // Lista formatada para o Select
    const statesOptions: Option[] = [
        { value: "AC", label: "Acre - AC" },
        { value: "AL", label: "Alagoas - AL" },
        { value: "AP", label: "Amapá - AP" },
        { value: "AM", label: "Amazonas - AM" },
        { value: "BA", label: "Bahia - BA" },
        { value: "CE", label: "Ceará - CE" },
        { value: "DF", label: "Distrito Federal - DF" },
        { value: "ES", label: "Espírito Santo - ES" },
        { value: "GO", label: "Goiás - GO" },
        { value: "MA", label: "Maranhão - MA" },
        { value: "MT", label: "Mato Grosso - MT" },
        { value: "MS", label: "Mato Grosso do Sul - MS" },
        { value: "MG", label: "Minas Gerais - MG" },
        { value: "PA", label: "Pará - PA" },
        { value: "PB", label: "Paraíba - PB" },
        { value: "PR", label: "Paraná - PR" },
        { value: "PE", label: "Pernambuco - PE" },
        { value: "PI", label: "Piauí - PI" },
        { value: "RJ", label: "Rio de Janeiro - RJ" },
        { value: "RN", label: "Rio Grande do Norte - RN" },
        { value: "RS", label: "Rio Grande do Sul - RS" },
        { value: "RO", label: "Rondônia - RO" },
        { value: "RR", label: "Roraima - RR" },
        { value: "SC", label: "Santa Catarina - SC" },
        { value: "SP", label: "São Paulo - SP" },
        { value: "SE", label: "Sergipe - SE" },
        { value: "TO", label: "Tocantins - TO" }
    ];

    useEffect(() => {
        if (searchParams.get('type') === 'artist') {
            setRole('artist');
        }
    }, [searchParams]);

    // Efeito para carregar cidades quando o Estado muda
    useEffect(() => {
        if (formData.state) {
            setLoadingCities(true);
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios`)
                .then(res => res.json())
                .then(data => {
                    const cities = data.map((c: any) => ({ value: c.nome, label: c.nome })).sort((a: Option, b: Option) => a.label.localeCompare(b.label));
                    setCityOptions(cities);
                    setLoadingCities(false);
                })
                .catch(err => {
                    console.error("Erro ao carregar cidades", err);
                    setLoadingCities(false);
                    setCityOptions([]);
                });
        } else {
            setCityOptions([]);
        }
    }, [formData.state]);

    const availableStyles = [
        "Realismo", "Old School", "Neo Traditional", "Blackwork",
        "Fine Line", "Oriental", "Pontilhismo", "Aquarela", "Lettering", "Outros"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Máscara simples para CEP
        if (name === 'cep') {
            setCepError(false); // Limpa erro ao digitar
            const masked = value
                .replace(/\D/g, '') // Remove tudo que não é dígito
                .replace(/(\d{5})(\d)/, '$1-$2') // Coloca o hífen
                .substring(0, 9); // Limita tamanho
            setFormData(prev => ({ ...prev, [name]: masked }));
            return;
        }

        // Máscara simples para Telefone
        if (name === 'phone') {
            const masked = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 15);
            setFormData(prev => ({ ...prev, [name]: masked }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handlers específicos para os componentes customizados
    const handleStateChange = (value: string) => {
        setFormData(prev => ({ ...prev, state: value, city: '' }));
    };

    const handleCityChange = (value: string) => {
        setFormData(prev => ({ ...prev, city: value }));
    };

    // Função para buscar o CEP
    const checkCEP = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length === 8) {
            try {
                // Feedback visual simples mudando o cursor
                document.body.style.cursor = 'wait';

                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                document.body.style.cursor = 'default';

                if (!data.erro) {
                    setCepError(false);
                    // Atualiza o estado primeiro, o useEffect vai disparar o load das cidades.
                    // O React pode não renderizar a cidade imediatamente se a lista não estiver carregada,
                    // mas ao carregar a lista, o value 'data.localidade' será casado corretamente.
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        state: data.uf,
                        city: data.localidade, // ViaCEP retorna cidade correta
                        // Foca no número após preencher
                    }));
                    // Tenta focar no campo número após preencher
                    document.getElementById('numberInput')?.focus();
                } else {
                    setCepError(true);
                    // Limpa campos se CEP não encontrado
                    setFormData(prev => ({
                        ...prev,
                        street: '',
                        neighborhood: '',
                        state: '',
                        city: ''
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
                document.body.style.cursor = 'default';
                setCepError(true);
            }
        }
    };

    const handleStyleToggle = (style: string) => {
        setFormData(prev => {
            const newStyles = prev.styles.includes(style)
                ? prev.styles.filter(s => s !== style)
                : [...prev.styles, style];
            return { ...prev, styles: newStyles };
        });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Validação básica da etapa 1
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.birthDate || !formData.phone) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            // Alert mantido como fallback, mas a UI já mostrará o erro
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificação de erro no CEP antes de enviar
        if (cepError) {
            alert("Por favor, informe um CEP válido antes de concluir o cadastro.");
            document.querySelector<HTMLInputElement>('input[name="cep"]')?.focus();
            return;
        }

        setLoading(true);

        try {
            if (role === 'artist' && formData.styles.length === 0) {
                throw new Error("Selecione pelo menos um estilo de tatuagem.");
            }

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: role,
                        name: formData.name,
                        ...formData, // Save all other fields directly to metadata for now
                    }
                }
            });

            if (error) throw error;

            alert(role === 'artist' ? "Solicitação enviada! Entraremos em contato." : "Conta criada com sucesso!");
            navigate('/login');

        } catch (error: any) {
            alert(error.message || "Erro ao criar conta.");
            setLoading(false);
        }
    };

    // Helper para verificar senha
    const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="w-full max-w-2xl bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in my-8">
                <div className="text-center mb-8">
                    <h1 className="font-tattoo text-4xl text-white mb-2">Crie sua Conta</h1>
                    <p className="text-text-muted text-sm font-display tracking-wide">
                        {step === 1 ? 'Passo 1: Dados de Acesso' : 'Passo 2: Perfil e Localização'}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-surface-light mt-4 rounded-full overflow-hidden max-w-xs mx-auto">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        ></div>
                    </div>
                </div>

                {/* Role Switcher - Apenas visível no passo 1 */}
                {step === 1 && (
                    <div className="flex p-1 bg-background-dark rounded-lg border border-border-dark mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`flex-1 py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'client' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}
                        >
                            Cliente
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('artist')}
                            className={`flex-1 py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'artist' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}
                        >
                            Sou Profissional
                        </button>
                    </div>
                )}

                <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>

                    {/* ETAPA 1: DADOS BÁSICOS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome Completo <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail <span className="text-primary">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <DatePicker
                                        label="Data de Nascimento"
                                        required
                                        value={formData.birthDate}
                                        onChange={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Telefone <span className="text-primary">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Senha <span className="text-primary">*</span></label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirmar <span className="text-primary">*</span></label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full bg-background-dark border rounded-lg p-2.5 text-white focus:ring-1 transition-colors ${passwordsMismatch
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-border-dark focus:border-primary focus:ring-primary'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    {passwordsMismatch && (
                                        <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                                            <span className="material-symbols-outlined text-[14px]">error</span>
                                            As senhas não coincidem.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 2: ENDEREÇO + ESPECÍFICOS */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">

                            {/* Seção de Endereço (Comum para ambos) */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Localização</h3>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1 col-span-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">CEP <span className="text-primary">*</span></label>
                                        <input
                                            type="text"
                                            name="cep"
                                            required
                                            maxLength={9}
                                            value={formData.cep}
                                            onChange={handleChange}
                                            onBlur={checkCEP}
                                            className={`w-full bg-background-dark border rounded-lg p-2.5 text-white text-sm transition-colors ${cepError
                                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                                : 'border-border-dark focus:border-primary'
                                                }`}
                                            placeholder="00000-000"
                                        />
                                        {cepError && (
                                            <span className="text-[10px] text-red-500 font-bold block mt-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">error</span>
                                                CEP não encontrado
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Estado (UF) <span className="text-primary">*</span></label>
                                        <SearchableSelect
                                            options={statesOptions}
                                            value={formData.state}
                                            onChange={handleStateChange}
                                            placeholder="Selecione o Estado"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1 md:col-span-3">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Cidade <span className="text-primary">*</span></label>
                                        <SearchableSelect
                                            options={cityOptions}
                                            value={formData.city}
                                            onChange={handleCityChange}
                                            placeholder={formData.state ? "Digite a cidade..." : "Selecione o estado primeiro"}
                                            disabled={!formData.state}
                                            loading={loadingCities}
                                        />
                                    </div>
                                    {/* Ajuste de layout responsivo para o número */}
                                    <div className="space-y-1 md:col-span-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nº <span className="text-primary">*</span></label>
                                        <input
                                            id="numberInput"
                                            type="text"
                                            name="number"
                                            required
                                            value={formData.number}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Rua <span className="text-primary">*</span></label>
                                        <input
                                            type="text"
                                            name="street"
                                            required
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                            placeholder="Nome da rua"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                            Complemento <span className="text-[10px] lowercase font-normal opacity-70">(Opcional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="complement"
                                            value={formData.complement}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm placeholder-zinc-700"
                                            placeholder="Apto, Bloco, Bairro..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-border-dark my-4"></div>

                            {/* Dados Específicos do Cliente */}
                            {role === 'client' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <span className="material-symbols-outlined text-sm">medical_information</span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Ficha de Saúde</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Alergias / Medicamentos</label>
                                            <textarea
                                                name="allergies"
                                                value={formData.allergies}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700 text-sm"
                                                placeholder="Tem alergia a látex, tintas ou toma algum remédio controlado?"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Condições Médicas</label>
                                            <textarea
                                                name="medicalNotes"
                                                value={formData.medicalNotes}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700 text-sm"
                                                placeholder="Diabetes, problemas cardíacos, pele sensível, quelóides..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dados Específicos do Artista */}
                            {role === 'artist' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <span className="material-symbols-outlined text-sm">palette</span>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Perfil Profissional</h3>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="flex items-center gap-2 p-3 border border-border-dark rounded-lg bg-background-dark cursor-pointer hover:border-white/30 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.artistRole.includes('Piercer')}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    artistRole: e.target.checked ? 'Tatuador & Piercer' : 'Tatuador'
                                                })}
                                                className="rounded border-border-dark bg-surface-light text-primary focus:ring-primary"
                                            />
                                            <span className="text-xs font-bold text-white select-none">Também faz Piercer?</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Link do Portfólio <span className="text-primary">*</span></label>
                                            <input
                                                type="url"
                                                name="portfolio"
                                                required
                                                value={formData.portfolio}
                                                onChange={handleChange}
                                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                                placeholder="Instagram / Behance"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Experiência <span className="text-primary">*</span></label>
                                            <select
                                                name="experience"
                                                required
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                            >
                                                <option value="" disabled selected>Selecione...</option>
                                                <option value="beginner">Iniciante (Aprendiz)</option>
                                                <option value="1-3">1 a 3 anos</option>
                                                <option value="3-5">3 a 5 anos</option>
                                                <option value="5+">Mais de 5 anos</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">Especialidades (Múltipla escolha) <span className="text-primary">*</span></label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableStyles.map(style => (
                                                <button
                                                    type="button"
                                                    key={style}
                                                    onClick={() => handleStyleToggle(style)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.styles.includes(style)
                                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                        : 'bg-surface-light text-text-muted border-border-dark hover:border-white/30 hover:text-white'
                                                        }`}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.styles.includes('Outros') && (
                                            <div className="mt-2 animate-fade-in">
                                                <input
                                                    type="text"
                                                    name="customStyle"
                                                    value={formData.customStyle}
                                                    onChange={handleChange}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                                    placeholder="Especifique seu estilo..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 mt-8">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 rounded-lg border border-border-dark text-text-muted hover:text-white font-bold text-sm uppercase tracking-wide transition-colors"
                            >
                                Voltar
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (step === 1 && passwordsMismatch) || (step === 2 && cepError)}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_25px_rgba(212,17,50,0.5)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading
                                ? 'Processando...'
                                : (step === 1 ? 'Continuar' : (role === 'artist' ? 'Enviar Candidatura' : 'Concluir Cadastro'))
                            }
                            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center pt-6 border-t border-border-dark">
                    <p className="text-xs text-text-muted">
                        Já tem uma conta? <Link to="/login" className="text-white hover:text-primary transition-colors font-bold ml-1 underline">Faça Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
