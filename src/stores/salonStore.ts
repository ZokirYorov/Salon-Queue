import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {Booking, Employee, Service} from "@/typeModules/useModules";



export const useSalonStore = defineStore('salon', () => {

    const state = ref({
        services: [] as Service[],
        bookings: [] as Booking[],
        employees: [] as Employee[],

    })
  const services = ref<Service[]>([
    { name: 'Soch olish',     duration: 30, price: 50_000  },
    { name: "Soch bo'yash",   duration: 90, price: 150_000 },
    { name: 'Soqol olish',    duration: 20, price: 25_000  },
  ])

  const employees = ref<Employee[]>([
    { id: 1, name: 'Jasur',   role: 'Sartarosh',   phone: '+998901111111', color: '#6366f1', services: ['Soch olish', 'Soqol olish'] },
    { id: 2, name: 'Nodir',  role: 'Sartarosh', phone: '+998902222222', color: '#ec4899', services: ['Soch olish'] },
    { id: 3, name: 'Sherzod', role: 'Sartarosh',   phone: '+998903333333', color: '#0ea5e9', services: ['Soch olish', "Soch bo'yash", 'Soqol olish'] },
    { id: 4, name: 'Maruf',   role: 'Sartarosh',  phone: '+998904444444', color: '#10b981', services: ["Soch bo'yash", 'Soch olish'] },
  ])

  const today = new Date().toISOString().split('T')[0]

  const bookings = ref<Booking[]>([
    { id: 1, clientName: 'Aziz Karimov',    phone: '+998901234567', service: 'Soch olish',     duration: 30, date: today, time: '09:00', status: 'Kutilmoqda', source: 'online', employeeId: 1 },
    { id: 2, clientName: 'Mansur Rahimov', phone: '+998932345678', service: 'Soch olish',       duration: 60, date: today, time: '09:00', status: 'Kutilmoqda', source: 'staff',  employeeId: 2 },
    { id: 3, clientName: 'Jamshid Toshev',  phone: '+998933456789', service: 'Soqol olish',    duration: 20, date: today, time: '10:00', status: 'Bajarildi',  source: 'online', employeeId: 3 },
    { id: 4, clientName: 'Sarvar',        phone: '+998935678901', service: 'Soch buyash',     duration: 20, date: today, time: '10:30', status: 'Kutilmoqda', source: 'online', employeeId: 4 },
    { id: 5, clientName: 'Bobur',           phone: '+998936789012', service: "Soch bo'yash",   duration: 90, date: today, time: '11:00', status: 'Kutilmoqda', source: 'staff',  employeeId: 3 },
  ])

    const timeSlots = ref([
        '09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
        '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'
    ])
  // const timeSlots: string[] = (() => {
  //   const slots: string[] = []
  //   for (let h = 9; h < 19; h++) {
  //     for (const m of [0, 30]) {
  //       slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  //     }
  //   }
  //   return slots
  // })()

  /** "09:30" → 570 (daqiqa) */
  function toMins(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  /** "09:00" + 45 → "09:45" */
  function addMinutes(time: string, mins: number): string {
    const [h, m] = time.split(':').map(Number)
    const d = new Date(2000, 0, 1, h, m + mins)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  /**
   * Berilgan slot band yoki yo'qligini tekshiradi.
   * Faqat shu xodim (employeeId) bo'yicha qaraydi — boshqa xodimga ta'sir qilmaydi.
   */
  function isSlotBusy(
    slot: string,
    date: string,
    svcName: string,
    empId: number,
    excludeId: number | null
  ): boolean {
    if (!date || !empId) return false
    const svc   = services.value.find(s => s.name === svcName)
    const dur   = svc?.duration ?? 30
    const start = toMins(slot)
    const end   = start + dur

    return bookings.value.some(b => {
      if (b.date !== date || b.employeeId !== empId) return false
      if (excludeId !== null && b.id === excludeId) return false
      const bs = toMins(b.time)
      const be = bs + b.duration
      // Vaqt oralig'i kesishuvini tekshirish
      return start < be && end > bs
    })
  }


  /** Xodimning berilgan kunda barcha navbatlari (jadval sarlavhasi uchun) */
  function getCellBookingsForDate(date: string, empId: number): Booking[] {
    return bookings.value.filter(b => b.date === date && b.employeeId === empId)
  }

  /** Berilgan slot boshlanuvchi navbatlarni qaytaradi (jadval uchun) */
  function getCellBookings(slot: string, date: string, empId: number): Booking[] {
    return bookings.value.filter(
      b => b.date === date && b.employeeId === empId && b.time === slot
    )
  }

  /** Xodim uchun bo'sh slotlar soni */
  function freeSlotCount(empId: number, date: string, svcName: string): number {
    return timeSlots.value.filter(t => !isSlotBusy(t, date, svcName, empId, null)).length
  }

  /** Xodim o'sha kuni nechta navbatga ega */
  function busyCount(empId: number, date: string): number {
    return bookings.value.filter(b => b.date === date && b.employeeId === empId).length
  }

  /** Xodim shu xizmatni bajara oladimi va hali bo'sh sloti bormi */
  function isEmployeeFull(empId: number, date: string, svcName: string): boolean {
    return freeSlotCount(empId, date, svcName) === 0
  }

  /** ID bo'yicha xodimni topadi */
  function getEmployee(id: number): Employee | undefined {
    return employees.value.find(e => e.id === id)
  }

  /** Shu xizmatni bajara oladigan xodimlar ro'yxati */
  function employeesForService(svcName: string): Employee[] {
    return employees.value.filter(
      e => e.services.length === 0 || e.services.includes(svcName)
    )
  }

  const todayBookings = computed(() =>
    bookings.value.filter(b => b.date === today)
  )

  function addBooking(booking: Omit<Booking, 'id'>): Booking {
    const newBooking: Booking = { id: Date.now(), ...booking }
    bookings.value.unshift(newBooking)
    return newBooking
  }

  function updateBookingStatus(id: number, status: Booking['status']) {
    const b = bookings.value.find(b => b.id === id)
    if (b) b.status = status
  }

  function deleteBooking(id: number) {
    bookings.value = bookings.value.filter(b => b.id !== id)
  }

  function addEmployee(emp: Omit<Employee, 'id'>) {
    employees.value.push({ id: Date.now(), ...emp })
  }

  function deleteEmployee(id: number) {
    employees.value = employees.value.filter(e => e.id !== id)
  }


  function formatPrice(price: number): string {
    return price.toLocaleString('uz-UZ') + " so'm"
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return ''
      const date = new Date(dateStr)
      const day = date.getDate().toString()
      const month = (date.getMonth() + 1).toString()
      const year = date.getFullYear().toString()

      return `${day}.${month}.${year}`
  }

  function formatDateShort(dateStr: string): string {
    if (!dateStr) return ''
    const data = new Date(dateStr);

    if (isNaN(data.getTime())) return ''

      const day = data.getDate().toString().padStart(2, '0');
      const month = (data.getMonth() + 1).toString().padStart(2, '0');
      const year = data.getFullYear()

      return `${day}-${month}-${year}`
  }

  function serviceIcon(name: string): string {
    if (name.includes('Soch')) return '✂️'
    if (name.includes('Manikyur')) return '💅'
    if (name.includes('Qosh')) return '✨'
    if (name.includes("bo'yash")) return '🎨'
    if (name.includes('Yuz')) return '🌸'
    if (name.includes('Soqol')) return '🪒'
    return '💈'
  }

  function chipClass(b: Booking): string {
    if (b.status === 'Bekor')     return 'chip--cancel'
    if (b.status === 'Bajarildi') return 'chip--done'
    return b.source === 'online' ? 'chip--online' : 'chip--manual'
  }

  function statusClass(status: string): string {
    if (status === 'Bajarildi') return 'st--done'
    if (status === 'Bekor')     return 'st--cancel'
    return 'st--pending'
  }

  return {
      state,
      services, employees, bookings, today, timeSlots,
      todayBookings,
      toMins, addMinutes,
      isSlotBusy, getCellBookings, getCellBookingsForDate,
      freeSlotCount, busyCount, isEmployeeFull,
      getEmployee, employeesForService,
      addEmployee, deleteEmployee,

      addBooking, updateBookingStatus, deleteBooking,
      formatPrice, formatDate, formatDateShort,
      serviceIcon, chipClass, statusClass,
  }
})
