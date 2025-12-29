import React from 'react';

interface CalendarProps {
    /** Data de visualização do calendário (controla o mês/ano exibido) */
    viewDate: Date;
    /** Callback quando a data de visualização muda */
    onViewDateChange: (date: Date) => void;
    /** Data selecionada no formato ISO (YYYY-MM-DD) ou string de display */
    selectedDate?: string;
    /** Callback quando uma data é selecionada */
    onDateSelect: (day: number, displayDate: string, isoDate: string) => void;
    /** Verifica se um dia específico está selecionado */
    isDateSelected?: (day: number, viewDate: Date) => boolean;
    /** Tamanho das células do calendário */
    cellSize?: string;
    /** Estilo compacto para modais */
    compact?: boolean;
}

/**
 * Componente de calendário reutilizável
 */
export const Calendar: React.FC<CalendarProps> = ({
    viewDate,
    onViewDateChange,
    selectedDate,
    onDateSelect,
    isDateSelected,
    cellSize = "size-10",
    compact = false
}) => {
    const getDaysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const isPastDate = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return checkDate < today;
    };

    const isSelected = (day: number): boolean => {
        if (isDateSelected) {
            return isDateSelected(day, viewDate);
        }
        if (!selectedDate) return false;

        // Try to parse ISO format first
        if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [y, m, d] = selectedDate.split('-').map(Number);
            return viewDate.getFullYear() === y && viewDate.getMonth() + 1 === m && day === d;
        }

        // Fall back to display format comparison
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const checkStr = checkDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
        return selectedDate === checkStr;
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onViewDateChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onViewDateChange(newDate);
    };

    const handleDateClick = (day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const dateObj = new Date(year, month, day);
        const displayStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
        const isoStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        onDateSelect(day, displayStr, isoStr);
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    const cellClass = compact ? "size-7" : cellSize;
    const textSize = compact ? "text-xs" : "text-sm";

    return (
        <div className={`bg-[#121212] border border-zinc-800 rounded-2xl ${compact ? 'p-3' : 'p-6'} select-none`}>
            {/* Calendar Header */}
            <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-6'}`}>
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="text-zinc-400 hover:text-white p-2 rounded hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className={`text-white font-bold capitalize ${compact ? 'text-xs' : ''}`}>
                    {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="text-zinc-400 hover:text-white p-2 rounded hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Weekday Headers */}
            <div className={`grid grid-cols-7 gap-1 text-center ${compact ? 'mb-1' : 'mb-2'}`}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[10px] font-black text-zinc-600 uppercase">{d}</span>
                ))}
            </div>

            {/* Days Grid */}
            <div className={`grid grid-cols-7 ${compact ? 'gap-1' : 'gap-2'}`}>
                {/* Empty slots for start of month */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isPastDate(day);
                    const selected = isSelected(day);

                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleDateClick(day)}
                            className={`
                                ${cellClass} rounded-lg flex items-center justify-center ${textSize} font-bold transition-all duration-300
                                ${selected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                    : disabled
                                        ? 'text-zinc-700 cursor-not-allowed'
                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                }
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
