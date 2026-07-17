import { ref, type Ref } from 'vue'; // Import "type Ref"
import { defineStore } from 'pinia';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// --- INTERFACES ---
export interface Booking { id: string; service: string; date: string; time: string; duration: number; employeeId: string; source: 'online' | 'manual'; status: string; phone: string; clientId?: string; clientName?: string; }
export interface Service { id: string; name: string; price: number; duration: number; }
export interface Employee { id: string; name: string; role: string; color: string; services: string[]; }

export const useFirebaseStore = defineStore('firebase', () => {
  // --- STATE ---
  const services = ref<Service[]>([]);
  const employees = ref<Employee[]>([]);
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setError = (message: string, e: any) => {
    console.error(message, e);
    error.value = `${message}. Tafsilotlar uchun konsolni tekshiring.`;
  };

  // Corrected line 24: Use "Ref<T[]>" type
  const _fetchCollection = async <T>(collectionName: string, targetRef: Ref<T[]>) => {
    if (targetRef.value.length > 0) return; // Don't re-fetch if already populated
    loading.value = true;
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      targetRef.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
    } catch (e) {
      setError(`${collectionName} yuklashda xatolik`, e);
    } finally {
      loading.value = false;
    }
  };

  // --- SERVICE ACTIONS ---
  async function fetchServices() { await _fetchCollection<Service>('services', services); }
  async function addService(data: Omit<Service, 'id'>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      const docRef = await addDoc(collection(db, 'services'), data);
      services.value.push({ id: docRef.id, ...data });
      return true;
    } catch (e) { setError("Xizmat qo'shishda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function updateService(id: string, data: Partial<Service>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await updateDoc(doc(db, 'services', id), data);
      const index = services.value.findIndex(s => s.id === id);
      if (index !== -1) services.value[index] = { ...services.value[index], ...data };
      return true;
    } catch (e) { setError("Xizmatni yangilashda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function deleteService(id: string): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await deleteDoc(doc(db, 'services', id));
      services.value = services.value.filter(s => s.id !== id);
      return true;
    } catch (e) { setError("Xizmatni o'chirishda xatolik", e); return false; }
    finally { loading.value = false; }
  }

  // --- EMPLOYEE ACTIONS ---
  async function fetchEmployees() { await _fetchCollection<Employee>('employees', employees); }
  async function addEmployee(data: Omit<Employee, 'id'>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      const docRef = await addDoc(collection(db, 'employees'), data);
      employees.value.push({ id: docRef.id, ...data });
      return true;
    } catch (e) { setError("Xodim qo'shishda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function updateEmployee(id: string, data: Partial<Employee>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await updateDoc(doc(db, 'employees', id), data);
      const index = employees.value.findIndex(e => e.id === id);
      if (index !== -1) employees.value[index] = { ...employees.value[index], ...data };
      return true;
    } catch (e) { setError("Xodimni yangilashda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function deleteEmployee(id: string): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await deleteDoc(doc(db, 'employees', id));
      employees.value = employees.value.filter(e => e.id !== id);
      return true;
    } catch (e) { setError("Xodimni o'chirishda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  
  // --- BOOKING ACTIONS ---
  async function fetchAllBookings() { await _fetchCollection<Booking>('bookings', bookings); }
  async function fetchClientBookings(clientId: string) {
    loading.value = true;
    try {
      const q = query(collection(db, "bookings"), where("clientId", "==", clientId));
      const querySnapshot = await getDocs(q);
      bookings.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
    } catch (e) {
      setError("Mijoz navbatlarini yuklashda xatolik", e);
    } finally {
      loading.value = false;
    }
  }
  async function addBooking(data: Omit<Booking, 'id'>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      const docRef = await addDoc(collection(db, 'bookings'), data);
      bookings.value.push({ id: docRef.id, ...data } as Booking);
      return true;
    } catch (e) { setError("Navbat qo'shishda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function updateBooking(id: string, data: Partial<Booking>): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await updateDoc(doc(db, 'bookings', id), data);
      const index = bookings.value.findIndex(b => b.id === id);
      if (index !== -1) bookings.value[index] = { ...bookings.value[index], ...data };
      return true;
    } catch (e) { setError("Navbatni yangilashda xatolik", e); return false; }
    finally { loading.value = false; }
  }
  async function deleteBooking(id: string): Promise<boolean> {
    loading.value = true; error.value = null;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      bookings.value = bookings.value.filter(b => b.id !== id);
      return true;
    } catch (e) { setError("Navbatni o'chirishda xatolik", e); return false; }
    finally { loading.value = false; }
  }

  return {
    services, employees, bookings, loading, error,
    fetchServices, addService, updateService, deleteService,
    fetchEmployees, addEmployee, updateEmployee, deleteEmployee,
    fetchAllBookings, fetchClientBookings, addBooking, updateBooking, deleteBooking
  };
});
