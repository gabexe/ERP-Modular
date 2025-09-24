import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, AtSign, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  identifier: string; // username or email
  password: string;
}

interface RegisterForm {
  name: string;
  identifier: string; // username or email
  password: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ identifier: "", password: "" });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    identifier: "",
    password: "",
  });
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = loginForm.identifier.trim();
    if (!id) {
      toast({ title: "Usuario requerido", description: "Por favor ingresa usuario o email", variant: "destructive" });
      return;
    }
    if (id.includes("@") && !validateEmail(id)) {
      toast({ title: "Email inválido", description: "Por favor ingresa un email válido", variant: "destructive" });
      return;
    }
    if (!validatePassword(loginForm.password)) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
  // signIn expects (identifier, password) — backend should handle username or email
  await signIn(loginForm.identifier, loginForm.password);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Por favor intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre completo",
        variant: "destructive",
      });
      return;
    }
    const id = registerForm.identifier.trim();
    if (!id) {
      toast({ title: "Usuario requerido", description: "Por favor ingresa usuario o email", variant: "destructive" });
      return;
    }
    if (id.includes("@") && !validateEmail(id)) {
      toast({ title: "Email inválido", description: "Por favor ingresa un email válido", variant: "destructive" });
      return;
    }
    
    if (!validatePassword(registerForm.password)) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Enviar username o email según lo que el usuario haya ingresado
      const payload: any = {
        password: registerForm.password,
        name: registerForm.name,
      };
      if (registerForm.identifier.includes("@")) {
        payload.email = registerForm.identifier;
      } else {
        payload.username = registerForm.identifier;
      }
      await signUp(payload);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error al registrarse",
        description: error instanceof Error ? error.message : "Por favor intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (login: boolean) => {
    if (loading) return;
    setIsLogin(login);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 auth-gradient">
  <Card className="auth-card w-full max-w-md mx-auto relative overflow-visible backdrop-blur-sm bg-card/95 p-0">
        {/* Pestañas */}
        <div className="auth-tabs" role="tablist" aria-label="Auth tabs">
          <button
            onClick={() => handleTabChange(true)}
            disabled={loading}
            className={`auth-tab ${isLogin ? "active" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-selected={isLogin}
            role="tab"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => handleTabChange(false)}
            disabled={loading}
            className={`auth-tab ${!isLogin ? "active" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-selected={!isLogin}
            role="tab"
          >
            Registrarse
          </button>
        </div>

        <div className="auth-panel-viewport">
          <div
            className="auth-slider"
            style={{ transform: `translateX(${isLogin ? "0" : "-50%"})` }}
          >
            {/* Formulario de Login */}
            <div className="auth-slide">
              <CardHeader className="space-y-1 px-6 pt-6 pb-0">
                <CardTitle className="sr-only">Iniciar sesión</CardTitle>
                <CardDescription className="sr-only">Ingresa tus credenciales</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 flex-1">
                <form onSubmit={handleLoginSubmit} className="space-y-6 flex flex-col h-full">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier" className="sr-only">Usuario o email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="login-identifier"
                        placeholder="usuario1 / nombre@empresa.com"
                        type="text"
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                        className="pl-9"
                        required
                        disabled={loading}
                        aria-label="Usuario o email para iniciar sesión"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="sr-only">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="c0ntr4s3ñ4"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-9"
                        required
                        disabled={loading}
                        aria-label="Contraseña para iniciar sesión"
                      />
                    </div>
                  </div>
                  <div className="auth-actions">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center w-full">
                          Ingresar
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>

            {/* Formulario de Registro */}
            <div className="auth-slide">
              <CardHeader className="space-y-1 px-6 pt-6 pb-0">
                <CardTitle className="sr-only">Crear cuenta</CardTitle>
                <CardDescription className="sr-only">Proporciona la información necesaria</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 flex-1">
                <form onSubmit={handleRegisterSubmit} className="space-y-6 flex flex-col h-full">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="sr-only">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="register-name"
                        placeholder="Nombre completo"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="pl-9"
                        required
                        disabled={loading}
                        aria-label="Nombre completo para registro"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-identifier" className="sr-only">Usuario o email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="register-identifier"
                        placeholder="usuario1 / nombre@empresa.com"
                        type="text"
                        value={registerForm.identifier}
                        onChange={(e) => setRegisterForm({ ...registerForm, identifier: e.target.value })}
                        className="pl-9"
                        required
                        disabled={loading}
                        aria-label="Usuario o email para registro"
                      />
                    </div>
                  </div>
                  {/* Teléfono eliminado para diseño minimalista */}
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="sr-only">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="c0ntr4s3ñ4"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="pl-9"
                        required
                        disabled={loading}
                        aria-label="Contraseña para registro"
                      />
                    </div>
                  </div>
                  <div className="auth-actions">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center w-full">
                          Crear cuenta
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
