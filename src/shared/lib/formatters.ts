export function maskCurp(curp?: string) {
  if (!curp) return 'Sin CURP';
  return `${curp.slice(0, 4)}**********${curp.slice(-4)}`;
}

export function maskPhone(phone?: string) {
  if (!phone) return 'Sin teléfono';
  const visible = phone.replace(/\D/g, '').slice(-4);
  return visible ? `******${visible}` : 'Teléfono protegido';
}

export function protectName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return 'Nombre protegido';
  return `${parts[0]} ${parts[1]?.charAt(0) ?? ''}.`;
}

export function formatDate(date?: string) {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(date));
}
