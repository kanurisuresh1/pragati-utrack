
export interface States {
    state_id: string;
    state: string;
    vehicles_count: number;
}

export interface StateResponse {
    status: boolean;
    message: string;
    data: States[];
}



