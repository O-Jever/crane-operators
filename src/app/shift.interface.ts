export interface Shift {
    craneCount: number,
    fullName: string,
    start: string,
    end: string,
    cranes: Crane[],
    id?: number
}

type Crane = TruckInfo[]

interface TruckInfo {
    truck: string,
    loaded: string,
    unloaded: string
}
