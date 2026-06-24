'use client';

import React, { useState } from 'react';

// Botão de copiar para a área de transferência, com feedback rápido ("Copiado!").
const CopyButton: React.FC<{ value: string; title?: string }> = ({ value, title = 'Copiar' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard pode não estar disponível (contexto inseguro); falha silenciosa
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copiado!' : title}
            className="inline-flex items-center text-text-muted hover:text-white transition-colors"
        >
            <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
        </button>
    );
};

export default CopyButton;
