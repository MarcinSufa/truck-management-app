export type TruckStatus = "LOADING" | "TO_JOB" | "AT_JOB" | "RETURNING" | "OUT_OF_SERVICE";

export type Truck = {
    id: string,
    code: string,
    name: string,
    status: TruckStatus,
    description: string,
}
