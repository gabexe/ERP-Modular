import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Accept identifier (username or email) and password
  const signIn = (identifier, password) => {
    const email = identifier.includes("@") ? identifier : `${identifier}@nometria.erp`;
    return supabase.auth.signInWithPassword({ email, password });
  };

  // signUp can accept either (email, password) or a payload { email|username, password, name }
  const signUp = (payload, passwordArg) => {
    if (typeof payload === 'string') {
      const identifier = payload;
      const email = identifier.includes("@") ? identifier : `${identifier}@nometria.erp`;
      const password = passwordArg;
      return supabase.auth.signUp({ email, password });
    }

    // payload is object
    const { email, username, password, name } = payload;
    let resolvedEmail = email;
    if (!resolvedEmail) {
      if (username) resolvedEmail = `${username}@nometria.erp`;
    }
    // Use supabase signUp; if name provided, try to pass in options.data (may vary by SDK)
    try {
      if (name) {
        return supabase.auth.signUp({ email: resolvedEmail, password, options: { data: { name } } });
      }
    } catch (e) {
      // fallback to basic call if options not supported
    }
    return supabase.auth.signUp({ email: resolvedEmail, password });
  };
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
