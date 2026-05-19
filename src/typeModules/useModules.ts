export interface Service {
    name: string
    duration: number
    price?: number
}

export interface Employee {
    id: number
    name: string
    role: string
    phone: string
    color: string
    services: string[]
}

export interface Booking {
    id: number
    clientName: string
    phone: string
    service: string
    duration: number
    date: string
    time: string
    status: 'Kutilmoqda' | 'Bajarildi' | 'Bekor'
    source: 'online' | 'staff'
    employeeId: number
    note?: string
}