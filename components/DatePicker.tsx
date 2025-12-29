import React, { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    name?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    label,
    placeholder = "DD/MM/AAAA",
    required = false,
    name
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [displayValue, setDisplayValue] = useState('');

    // Parse initial value or use current date for view
    const initialDate = value ? new Date(value + 'T12:00:00') : new Date();
    const [viewDate, setViewDate] = useState(initialDate);

    // Mode: 'days', 'months', 'years'
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

    // Sync displayValue with prop value
    useEffect(() => {
        if (value) {
            const parts = value.split('-');
            if (parts.length === 3) {
                const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
                setDisplayValue(formatted);
            }
            setViewDate(new Date(value + 'T12:00:00'));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setViewMode('days');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDateClick = (day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(isoDate);
        setIsOpen(false);
    };

    const toggleViewMode = () => {
        if (viewMode === 'days') setViewMode('years');
        else setViewMode('days');
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIndex);
        setViewDate(newDate);
        setViewMode('days');
    };

    const handleYearSelect = (year: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        setViewDate(newDate);
        setViewMode('months');
    };

    const [validationError, setValidationError] = useState<string | null>(null);

    // Simple mask: only digits, auto-insert slashes at positions 2 and 5
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setValidationError(null);

        // Extract only digits
        const digits = raw.replace(/\D/g, '').slice(0, 8);

        // Build masked value
        let masked = '';
        for (let i = 0; i < digits.length; i++) {
            if (i === 2 || i === 4) masked += '/';
            masked += digits[i];
        }

        setDisplayValue(masked);

        // Validate complete date
        if (digits.length === 8) {
            const d = parseInt(digits.slice(0, 2));
            const m = parseInt(digits.slice(2, 4));
            const y = parseInt(digits.slice(4, 8));

            const date = new Date(y, m - 1, d);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if date is valid
            if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) {
                setValidationError('Data inválida');
                return;
            }

            // Check if date is in the future
            if (date > today) {
                setValidationError('A data não pode ser no futuro');
                return;
            }

            // Calculate age
            let age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                age--;
            }

            // Check minimum age (18 years)
            if (age < 18) {
                setValidationError('Você precisa ter pelo menos 18 anos');
                return;
            }

            // Check maximum age (120 years - avoid absurd dates)
            if (age > 120) {
                setValidationError('Data de nascimento inválida');
                return;
            }

            // All validations passed
            const isoDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            onChange(isoDate);
            setViewDate(date);
        } else if (digits.length === 0) {
            onChange('');
        }
    };

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-4">
            <button
                type="button"
                onClick={() => {
                    const newDate = new Date(viewDate);
                    if (viewMode === 'days') newDate.setMonth(newDate.getMonth() - 1);
                    if (viewMode === 'years') newDate.setFullYear(newDate.getFullYear() - 12);
                    setViewDate(newDate);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                disabled={viewMode === 'months'}
            >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            <button
                type="button"
                onClick={toggleViewMode}
                className="text-white font-bold text-sm hover:text-primary transition-colors capitalize"
            >
                {viewMode === 'days' && `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
                {viewMode === 'months' && `${viewDate.getFullYear()}`}
                {viewMode === 'years' && `${viewDate.getFullYear() - 6} - ${viewDate.getFullYear() + 5}`}
            </button>

            <button
                type="button"
                onClick={() => {
                    const newDate = new Date(viewDate);
                    if (viewMode === 'days') newDate.setMonth(newDate.getMonth() + 1);
                    if (viewMode === 'years') newDate.setFullYear(newDate.getFullYear() + 12);
                    setViewDate(newDate);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                disabled={viewMode === 'months'}
            >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
        </div>
    );

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

        const selectedParts = value ? value.split('-').map(Number) : null;
        const isSelected = (d: number) => selectedParts &&
            selectedParts[0] === viewDate.getFullYear() &&
            selectedParts[1] === (viewDate.getMonth() + 1) &&
            selectedParts[2] === d;

        return (
            <>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {days.map((d, i) => (
                        <span key={i} className="text-[10px] font-black text-zinc-600 uppercase">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const selected = isSelected(day);
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDateClick(day)}
                                className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
                                    ${selected
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                    }
                                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderMonths = () => (
        <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => (
                <button
                    key={m}
                    type="button"
                    onClick={() => handleMonthSelect(i)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all
                        ${viewDate.getMonth() === i
                            ? 'bg-primary text-white'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                >
                    {m.substring(0, 3)}
                </button>
            ))}
        </div>
    );

    const renderYears = () => {
        const currentYear = viewDate.getFullYear();
        const startYear = currentYear - 6;
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);

        return (
            <div className="grid grid-cols-3 gap-2">
                {years.map(year => (
                    <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={`p-2 rounded-lg text-xs font-bold transition-all
                            ${viewDate.getFullYear() === year
                                ? 'bg-primary text-white'
                                : 'text-zinc-300 hover:bg-zinc-800'
                            }`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-1 relative" ref={wrapperRef}>
            {label && <label className="text-xs font-bold text-text-muted uppercase tracking-widest">{label} {required && <span className="text-primary">*</span>}</label>}
            <div className="relative group">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute left-0 top-0 bottom-0 px-3 text-text-muted hover:text-white transition-colors z-10"
                >
                    <span className="material-symbols-outlined">calendar_month</span>
                </button>
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    maxLength={10}
                    className={`w-full bg-background-dark border rounded-lg py-2.5 pl-10 text-white placeholder-zinc-700 focus:ring-1 transition-all ${validationError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-dark focus:border-primary focus:ring-primary'}`}
                />
            </div>

            {validationError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {validationError}
                </p>
            )}
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 p-4 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl w-64 animate-fade-in">
                    {renderHeader()}
                    {viewMode === 'days' && renderDays()}
                    {viewMode === 'months' && renderMonths()}
                    {viewMode === 'years' && renderYears()}
                </div>
            )}
        </div>
    );
};

export default DatePicker;
