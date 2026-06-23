'use client';

import React, { useState } from 'react';

// Seletor de data/hora no estilo do site (substitui o datetime-local nativo).
// Emite "YYYY-MM-DDTHH:mm" via onChange quando dia + hora + minuto estão definidos.

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTOS = ['00', '15', '30', '45'];

const pad = (n: number) => String(n).padStart(2, '0');

const DateTimePicker: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [hora, setHora] = useState('');
    const [minuto, setMinuto] = useState('');

    const ano = viewDate.getFullYear();
    const mes = viewDate.getMonth();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const primeiroDia = new Date(ano, mes, 1).getDay();

    const emit = (day: string | null, h: string, m: string) => {
        onChange(day && h && m ? `${day}T${h}:${m}` : '');
    };

    const selecionarDia = (d: number) => {
        const dayStr = `${ano}-${pad(mes + 1)}-${pad(d)}`;
        setSelectedDay(dayStr);
        emit(dayStr, hora, minuto);
    };

    const isPast = (d: number) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return new Date(ano, mes, d) < hoje;
    };
    const isSel = (d: number) => selectedDay === `${ano}-${pad(mes + 1)}-${pad(d)}`;

    return (
        <div className="bg-background-dark border border-border-dark rounded-xl p-4 select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={() => setViewDate(new Date(ano, mes - 1, 1))} className="text-zinc-400 hover:text-white p-1">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-white font-bold text-sm capitalize">{MESES[mes]} {ano}</span>
                <button type="button" onClick={() => setViewDate(new Date(ano, mes + 1, 1))} className="text-zinc-400 hover:text-white p-1">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {DIAS_SEMANA.map((d, i) => <span key={i} className="text-[10px] font-black text-zinc-600">{d}</span>)}
            </div>

            {/* Grade de dias */}
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: primeiroDia }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: diasNoMes }).map((_, i) => {
                    const d = i + 1;
                    const past = isPast(d);
                    const sel = isSel(d);
                    return (
                        <button
                            key={d}
                            type="button"
                            disabled={past}
                            onClick={() => selecionarDia(d)}
                            className={`size-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${sel
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : past
                                    ? 'text-zinc-700 cursor-not-allowed'
                                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {d}
                        </button>
                    );
                })}
            </div>

            {/* Horário */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-dark">
                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                <select value={hora} onChange={(e) => { setHora(e.target.value); emit(selectedDay, e.target.value, minuto); }} className="bg-surface-dark border border-border-dark rounded-lg py-2 px-3 text-white text-sm flex-1 focus:border-primary outline-none">
                    <option value="">Hora</option>
                    {HORAS.map(h => <option key={h} value={h}>{h}h</option>)}
                </select>
                <span className="text-zinc-500 font-bold">:</span>
                <select value={minuto} onChange={(e) => { setMinuto(e.target.value); emit(selectedDay, hora, e.target.value); }} className="bg-surface-dark border border-border-dark rounded-lg py-2 px-3 text-white text-sm flex-1 focus:border-primary outline-none">
                    <option value="">Min</option>
                    {MINUTOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
        </div>
    );
};

export default DateTimePicker;
