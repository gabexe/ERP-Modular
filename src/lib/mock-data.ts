export const timeOnDate = (time: string) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
};

export const initialAppointments: any[] = [];
export const initialInvoices: any[] = [];
export const initialProjects: any[] = [];
