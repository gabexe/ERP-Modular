const timeOnDate = (time: string) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

export const initialAppointments = [
  {
    id: 1,
    title: "Reunión con Cliente ABC",
    client: "María González",
    date: timeOnDate("09:00"),
    duration: "1h",
    type: "reunión",
    status: "confirmada",
    location: "Oficina Central",
    phone: "+54 11 1234-5678"
  },
  {
    id: 2,
    title: "Inspección de Obra",
    client: "Constructora XYZ",
    date: timeOnDate("11:30"),
    duration: "2h",
    type: "inspección",
    status: "pendiente",
    location: "Av. Corrientes 1234",
    phone: "+54 11 8765-4321"
  },
  {
    id: 3,
    title: "Entrega de Materiales",
    client: "Carlos Ruiz",
    date: timeOnDate("15:00"),
    duration: "30min",
    type: "entrega",
    status: "en-curso",
    location: "Barrio Norte",
    phone: "+54 11 5555-0123"
  },
  {
    id: 4,
    title: "Llamada de seguimiento",
    client: "Ana López",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Mañana
    duration: "15min",
    type: "llamada",
    status: "pendiente",
    location: "Remoto",
    phone: "+54 11 2345-6789"
  }
];

export const initialInvoices = [
  {
    id: "INV-001",
    client: "Tech Solutions SA",
    date: "2024-01-20",
    total: 1500.00,
    status: "pagada",
  },
  {
    id: "INV-002",
    client: "Construcciones Del Norte",
    date: "2024-01-22",
    total: 3200.50,
    status: "pendiente",
  },
  {
    id: "INV-003",
    client: "InnovaTech",
    date: "2024-01-25",
    total: 850.75,
    status: "vencida",
  },
];

export const initialProjects = [
  {
    id: "PROJ-01",
    name: "Diseño de Nuevo Sitio Web",
    client: "Tech Solutions SA",
    status: "en-progreso",
    progress: 60,
    dueDate: "2024-02-28",
  },
  {
    id: "PROJ-02",
    name: "Construcción de Oficinas Centrales",
    client: "Construcciones Del Norte",
    status: "completado",
    progress: 100,
    dueDate: "2024-01-30",
  },
  {
    id: "PROJ-03",
    name: "Campaña de Marketing Digital",
    client: "InnovaTech",
    status: "en-progreso",
    progress: 30,
    dueDate: "2024-03-15",
  },
  {
    id: "PROJ-04",
    name: "Migración de Servidores a la Nube",
    client: "Servicios Integrales",
    status: "pendiente",
    progress: 0,
    dueDate: "2024-02-10",
  },
];
