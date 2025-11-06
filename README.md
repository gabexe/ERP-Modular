# labiv - Sistema ERP para PyMES y Monotributistas

## Descripción General
Este proyecto es un Sistema ERP (Enterprise Resource Planning) diseñado para pequeñas y medianas empresas (PyMES) y monotributistas, ofreciendo una solución integral para la gestión de diversas áreas de negocio.

## Tecnologías Utilizadas

### Frontend
*   **Framework**: React.js
*   **Lenguaje**: TypeScript
*   **Build Tool**: Vite
*   **Estilado**:
    *   Tailwind CSS: Framework CSS utility-first para un estilado rápido y personalizable.
    *   PostCSS: Herramienta para transformar CSS con plugins de JavaScript.
    *   `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`: Utilidades para la gestión avanzada de clases CSS y animaciones.
*   **Componentes UI**:
    *   Shadcn/UI (basado en Radix UI): Colección de componentes de interfaz de usuario accesibles y personalizables.
    *   `vaul`: Componente de Drawer.
    *   `embla-carousel-react`: Componente de carrusel.
    *   `input-otp`: Componente para entrada de códigos OTP.
    *   `react-day-picker`: Selector de fechas.
    *   `sonner`: Librería para notificaciones tipo "toast".
*   **Gestión de Formularios**: React Hook Form
*   **Iconos**: Lucide React
*   **Gráficos**: Recharts
*   **Utilidades**: `date-fns` (manejo de fechas)

### Backend / Base de Datos
*   **Backend as a Service (BaaS)**: Supabase (para autenticación, base de datos y almacenamiento).

### Herramientas de Desarrollo
*   **Linting**: ESLint (para mantener la calidad y consistencia del código).
*   **Package Managers**: npm (Node Package Manager) y/o Bun.
*   **Deployment**: Vercel (inferido por la configuración del proyecto).

## Módulos Principales y Flujo

El sistema está estructurado en varios módulos clave, cada uno con su funcionalidad específica:

### 1. Autenticación y Gestión de Usuarios
*   **Función**: Permite a los usuarios registrarse, iniciar sesión y gestionar sus perfiles. Incluye roles de usuario y control de acceso.
*   **Flujo**:
    *   **Registro/Login**: Los usuarios acceden a través de las páginas `Auth.tsx`, `Login.tsx`, `Register.tsx`.
    *   **Gestión de Sesión**: `useAuth.tsx` maneja el estado de autenticación.
    *   **Perfiles y Roles**: `useProfile.ts` y `useRoles.tsx` gestionan la información del perfil del usuario y sus permisos.
    *   **Integración**: Utiliza `supabaseClient.ts` para interactuar con Supabase para la autenticación y la base de datos.

### 2. Dashboard
*   **Función**: Proporciona una vista general y rápida del estado del negocio con métricas clave y acciones rápidas.
*   **Flujo**:
    *   La página `Index.tsx` actúa como el panel principal.
    *   Componentes como `QuickActions.tsx`, `RecentActivities.tsx` y `StatsCards.tsx` muestran información relevante y permiten acciones directas.

### 3. CRM (Gestión de Relaciones con Clientes)
*   **Función**: Permite gestionar la información de los clientes, sus interacciones y el seguimiento.
*   **Flujo**:
    *   La página `CRM.tsx` es el punto central para la gestión de clientes.
    *   `ClientCard.tsx` muestra un resumen de cada cliente.
    *   `ClientModal.tsx` se utiliza para añadir o editar detalles de clientes.
    *   `useCrmStore.ts` gestiona el estado relacionado con los clientes.

### 4. Inventario
*   **Función**: Controla el stock de productos, entradas, salidas y detalles de cada artículo.
*   **Flujo**:
    *   La página `Inventario.tsx` muestra la lista de productos.
    *   `ProductModal.tsx` se usa para añadir, editar o ver detalles de productos.
    *   `useInventoryStore.ts` maneja el estado del inventario.

### 5. Facturación
*   **Función**: Generación y gestión de facturas, seguimiento de pagos y estados de cuenta.
*   **Flujo**:
    *   La página `Facturacion.tsx` es el módulo de facturación.
    *   `InvoiceModal.tsx` facilita la creación y edición de facturas.
    *   `useBillingStore.ts` gestiona el estado de la facturación.

### 6. Agenda y Citas
*   **Función**: Permite programar y gestionar citas, reuniones o eventos.
*   **Flujo**:
    *   La página `Agenda.tsx` muestra el calendario y las citas.
    *   `CitaDetalles.tsx` proporciona una vista detallada de una cita específica.
    *   `AppointmentModal.tsx` se utiliza para crear o modificar citas.
    *   `useAgendaStore.ts` gestiona el estado de la agenda.

### 7. Proyectos
*   **Función**: Gestión de proyectos, tareas, hitos y seguimiento del progreso.
*   **Flujo**:
    *   La página `Proyectos.tsx` centraliza la gestión de proyectos.
    *   `ProjectModal.tsx` permite la creación y edición de proyectos.
    *   `useProjectStore.ts` maneja el estado de los proyectos.

### 8. Reportes
*   **Función**: Generación de informes y análisis de datos para la toma de decisiones.
*   **Flujo**:
    *   La página `Reportes.tsx` presenta diversas opciones de informes.
    *   Utiliza la librería `recharts` para la visualización de datos.

### 9. Configuración
*   **Función**: Permite a los administradores o usuarios con permisos configurar aspectos del sistema.
*   **Flujo**:
    *   La página `Configuracion.tsx` ofrece opciones para ajustar las preferencias del sistema.

## Instalación

Para configurar el proyecto localmente, sigue estos pasos:

1.  **Clonar el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd labiv
    ```
2.  **Instalar dependencias**:
    Si usas npm:
    ```bash
    npm install
    ```
    Si usas Bun:
    ```bash
    bun install
    ```
3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Supabase y otras variables necesarias.
    ```
    VITE_SUPABASE_URL=tu_url_supabase
    VITE_SUPABASE_ANON_KEY=tu_anon_key_supabase
    # Otras variables de entorno
    ```
4.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    # o
    bun dev
    ```
    El proyecto se abrirá en tu navegador en `http://localhost:5173` (o el puerto configurado por Vite).

## Uso

Una vez instalado y ejecutado, puedes navegar por los diferentes módulos a través de la barra lateral (`AppSidebar.tsx`) y la cabecera (`TopHeader.tsx`). Cada módulo ofrece funcionalidades específicas para la gestión de tu negocio.
