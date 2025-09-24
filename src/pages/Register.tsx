import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function validateUsername(username) {
  return /^[a-z0-9]{1,12}$/.test(username);
}

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!validateUsername(username)) {
      setError('El usuario solo puede contener minúsculas y números, máximo 12 caracteres.');
      return;
    }
    setLoading(true);
    const email = `${username}@nometria.erp`;
    const { error: signUpError, data } = await signUp(email, password);
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Guardar el nombre completo y username en la tabla profiles
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: data.user.id, username, full_name: fullName })
    });
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
        <Input
          type="text"
          placeholder="Usuario (solo minúsculas y números)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          maxLength={12}
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Nombre completo"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">¡Registro exitoso! Ahora puedes iniciar sesión.</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
    </div>
  );
}
