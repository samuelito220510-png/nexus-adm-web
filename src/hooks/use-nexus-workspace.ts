import { useCallback, useMemo, useState } from 'react';

export type WorkspaceRole = 'client' | 'worker';
export type RequestStatus = 'received' | 'in_progress' | 'completed';

export type Service = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  specialist: string;
  specialistRole: string;
  specialistInitials: string;
};

export type ServiceRequest = {
  id: string;
  serviceId: string;
  clientName: string;
  company: string;
  summary: string;
  createdAt: string;
  status: RequestStatus;
};

export type ChatMessage = {
  id: string;
  requestId: string;
  sender: 'client' | 'specialist';
  text: string;
  time: string;
};

export type CartItem = { packageId: string; quantity: number };

export const serviceCatalog: Service[] = [
  { id: 'ley-594', number: '01', title: 'Ley 594 / gestión documental', shortTitle: 'Ley 594', description: 'Orden, trazabilidad y sentido para tus documentos.', specialist: 'Stefania Córdoba Buitrón', specialistRole: 'Técnico 1', specialistInitials: 'SC' },
  { id: 'calidad', number: '02', title: 'Control y calidad del servicio', shortTitle: 'Control y calidad', description: 'Estándares prácticos para convertir buenas intenciones en procesos consistentes.', specialist: 'Camilo Soto López', specialistRole: 'Técnico 2', specialistInitials: 'CS' },
  { id: 'digitalizacion', number: '03', title: 'Digitalización contable y comercial', shortTitle: 'Digitalización', description: 'Soportes y transacciones a la mano para decidir con información.', specialist: 'Vida Isachy', specialistRole: 'Técnico 3', specialistInitials: 'VI' },
];

export const shopPackages = [
  { id: 'esencial', label: 'Esencial', price: 78000, detail: 'Una base confiable para comenzar.', included: ['Selección de fibras', 'Bandeja de extensiones', 'Implementos de aplicación'] },
  { id: 'profesional', label: 'Profesional', price: 146000, detail: 'Para elevar cada cita y cada resultado.', included: ['Mix de fibras', 'Pinzas de precisión', 'Implementos de aplicación', 'Organizador de trabajo'] },
  { id: 'estudio', label: 'Estudio', price: 228000, detail: 'Una operación beauty que se siente lista.', included: ['Selección completa de fibras', 'Kit de pinzas profesionales', 'Implementos de aplicación', 'Organizador', 'Reposición de insumos'] },
];

const seedRequests: ServiceRequest[] = [
  { id: 'NX-104', serviceId: 'ley-594', clientName: 'Valentina Ruiz', company: 'Taller Vértice', summary: 'Queremos ordenar el archivo de contratos y facturas del último año.', createdAt: 'Hoy, 08:42', status: 'in_progress' },
  { id: 'NX-103', serviceId: 'digitalizacion', clientName: 'Nicolás Torres', company: 'Casa Nómada', summary: 'Necesito pasar los soportes de ventas a un registro digital.', createdAt: 'Ayer, 16:18', status: 'received' },
];

const seedMessages: ChatMessage[] = [
  { id: 'm-1', requestId: 'NX-104', sender: 'specialist', text: 'Hola Valentina. Revisé tu solicitud de gestión documental. Podemos comenzar por clasificar contratos, facturas y soportes de proveedores.', time: '08:48' },
  { id: 'm-2', requestId: 'NX-104', sender: 'client', text: 'Perfecto, Stefania. Tenemos los documentos en carpetas separadas, pero no un criterio único.', time: '09:03' },
  { id: 'm-3', requestId: 'NX-104', sender: 'specialist', text: 'Ese es un buen punto de partida. Te enviaré una primera estructura para validar hoy.', time: '09:11' },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local prototype can continue without storage */ }
}

export function useNexusWorkspace() {
  const [requests, setRequests] = useState<ServiceRequest[]>(() => readStorage('nexus-requests', seedRequests));
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStorage('nexus-messages', seedMessages));
  const [cart, setCart] = useState<CartItem[]>(() => readStorage('nexus-cart', []));
  const [role, setRoleState] = useState<WorkspaceRole>(() => readStorage('nexus-demo-role', 'client'));

  const setRole = useCallback((nextRole: WorkspaceRole) => {
    setRoleState(nextRole);
    writeStorage('nexus-demo-role', nextRole);
  }, []);

  const createRequest = useCallback((serviceId: string, summary: string, clientName: string, company: string) => {
    const request: ServiceRequest = { id: `NX-${Math.floor(105 + Math.random() * 800)}`, serviceId, summary, clientName, company, createdAt: 'Ahora', status: 'received' };
    setRequests((current) => { const next = [request, ...current]; writeStorage('nexus-requests', next); return next; });
    const service = serviceCatalog.find((item) => item.id === serviceId);
    const greeting: ChatMessage = { id: `m-${Date.now()}`, requestId: request.id, sender: 'specialist', text: `Hola ${clientName.split(' ')[0]}. Soy ${service?.specialist ?? 'tu especialista'} y ya recibí tu solicitud sobre ${service?.shortTitle ?? 'el servicio'}. La revisaremos contigo paso a paso.`, time: 'Ahora' };
    setMessages((current) => { const next = [greeting, ...current]; writeStorage('nexus-messages', next); return next; });
    return request;
  }, []);

  const updateStatus = useCallback((requestId: string, status: RequestStatus) => {
    setRequests((current) => { const next = current.map((item) => item.id === requestId ? { ...item, status } : item); writeStorage('nexus-requests', next); return next; });
  }, []);

  const sendMessage = useCallback((requestId: string, text: string, sender: 'client' | 'specialist') => {
    const message: ChatMessage = { id: `m-${Date.now()}`, requestId, sender, text, time: 'Ahora' };
    setMessages((current) => { const next = [...current, message]; writeStorage('nexus-messages', next); return next; });
  }, []);

  const addToCart = useCallback((packageId: string) => {
    setCart((current) => {
      const exists = current.find((item) => item.packageId === packageId);
      const next = exists ? current.map((item) => item.packageId === packageId ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { packageId, quantity: 1 }];
      writeStorage('nexus-cart', next); return next;
    });
  }, []);

  const changeCartQuantity = useCallback((packageId: string, delta: number) => {
    setCart((current) => {
      const next = current.map((item) => item.packageId === packageId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0);
      writeStorage('nexus-cart', next); return next;
    });
  }, []);

  const removeFromCart = useCallback((packageId: string) => {
    setCart((current) => { const next = current.filter((item) => item.packageId !== packageId); writeStorage('nexus-cart', next); return next; });
  }, []);

  const getService = useCallback((serviceId: string) => serviceCatalog.find((item) => item.id === serviceId) ?? serviceCatalog[0], []);
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (shopPackages.find((pkg) => pkg.id === item.packageId)?.price ?? 0) * item.quantity, 0), [cart]);

  return { role, setRole, requests, messages, createRequest, updateStatus, sendMessage, cart, cartCount, cartTotal, addToCart, changeCartQuantity, removeFromCart, getService };
}

export function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}