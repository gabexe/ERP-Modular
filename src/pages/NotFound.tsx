import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Registro de error 404, manteniendo la lógica original.
    console.error("404 Error: El usuario intentó acceder a una ruta que no existe:", location.pathname);

    // Lógica para la navegación con las teclas Esc y Enter
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.history.back(); // Vuelve a la página anterior
      } else if (event.key === 'Enter') {
        window.location.href = '/'; // Va a la página de inicio
      }
    };

    // Añade el event listener al cargar el componente
    window.addEventListener('keydown', handleKeyDown);

    // Limpia el event listener al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location.pathname]);

  return (
    <div className="bg-black text-[#00ff00] min-h-screen flex flex-col items-center justify-center p-8 box-border font-mono vt323-font">
      <style>
        {`
        .vt323-font {
          font-family: 'VT323', monospace;
        }
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        .desktop-content {
          display: none;
        }

        .mobile-content {
          display: none;
        }
        
        @media (min-width: 768px) {
          .desktop-content {
            display: flex;
          }
        }
        
        @media (max-width: 767px) {
          .mobile-content {
            display: flex;
          }
        }
        `}
      </style>

      {/* Contenido para escritorio */}
      <div className="container desktop-content flex-col items-start text-left w-full max-w-[900px] p-8">
        <p className="error-code text-2xl mb-2">NOMETRIA ERROR 0x00000404</p>
        <h1 className="error-message text-2xl font-bold mb-4">PAGE_NOT_FOUND — El archivo que buscas se fue por el camino equivocado.</h1>
        <p className="error-description text-lg leading-6 mb-8">
          Ha ocurrido una excepción fatal en el módulo navigation.exe.
          <br />
          Se intentó acceder a una ruta que no existe.
        </p>
        <div className="memory-dump text-base mt-4">
          <p className="flex items-center before:content-['>'] before:mr-2">Iniciando volcado de memoria...</p>
          <p className="flex items-center before:content-['>'] before:mr-2">Guardando traza de pila en /beach/missing.html</p>
          <p className="flex items-center before:content-['>'] before:mr-2">Activando protocolo de redirección...</p>
        </div>
        <div className="press-instructions mt-8 text-base">
          <p className="mb-2">Presiona <span className="bg-[#00ff00] text-black px-2 py-1 font-bold">Esc</span> para volver a la página anterior.</p>
          <p>Presiona <span className="bg-[#00ff00] text-black px-2 py-1 font-bold">Enter</span> para ir a la página de inicio.</p>
        </div>
      </div>

      {/* Contenido para móviles */}
      <div className="container mobile-content flex-col items-start text-left w-full p-4">
        <h1 className="error-code text-2xl mb-2">NOMETRIA ERROR 0x00000404</h1>
        <p className="error-message text-2xl font-bold mb-4">PAGE_NOT_FOUND — El archivo que buscas se fue por el camino equivocado.</p>
        <p className="error-description text-lg leading-6 mb-8">
          Ha ocurrido una excepción fatal en el módulo navigation.exe.
          <br />
          Se intentó acceder a una ruta que no existe.
        </p>
        <div className="memory-dump text-base mt-4">
          <p className="flex items-center before:content-['>'] before:mr-2">INICIANDO VOLCADO DE MEMORIA...</p>
          <p className="flex items-center before:content-['>'] before:mr-2">Guardando traza de pila en <br />/beach/missing.html</p>
          <p className="flex items-center before:content-['>'] before:mr-2">Activando protocolo de redirección...</p>
        </div>
        <a href="/" className="home-link underline mt-8 text-lg">Volver a la página de inicio</a>
      </div>
    </div>
  );
};

export default NotFound;
