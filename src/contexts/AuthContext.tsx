
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: string | null;
    loading: boolean;
    signIn: () => void; // Placeholder, atualizado nas páginas
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.role) {
                setRole(session.user.user_metadata.role);
                // Compatibilidade com código legado que usa localStorage
                localStorage.setItem('ink_role', session.user.user_metadata.role);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user?.user_metadata?.role) {
                setRole(session.user.user_metadata.role);
                localStorage.setItem('ink_role', session.user.user_metadata.role);
            } else {
                setRole(null);
                localStorage.removeItem('ink_role');
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('ink_role');
        setRole(null);
        setSession(null);
        setUser(null);
    };

    const signIn = () => {
        // Placeholder
    }

    const value = {
        session,
        user,
        role,
        loading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
