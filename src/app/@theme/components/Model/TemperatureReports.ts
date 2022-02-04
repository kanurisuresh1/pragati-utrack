
    export interface TemperatureDetails {
        s: number;
        la: string;
        lo: string;
        nt: number;
        t: string;
    }

    export interface TemperatureList {
        status: boolean;
        message: string;
        exe_time: string;
        count: number;
        data: TemperatureDetails[];
    }



