
export interface FuelReportResponseData {
    weekDayName: string;
    s: number;
    d: number;
    la: string;
    lo: string;
    dt: string;
    c: number;
    t: string;
    ln: string;
    ld: string;
    f: number;
    fuel_avg: number;
}

export interface FuelReportResponse {
    status: boolean;
    message: string;
    exe_time: string;
    count: number;
    data: FuelReportResponseData[];

}

