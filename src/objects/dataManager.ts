export interface dataManager
{
    name: string,
    type: "Production" | "Development" | "Testing";
    currentStats: publicStatusReport;
}

export interface publicStatusReport
{
    lastUpdate: number,
    userCount: number,
    uptime: number,
    host: {
        uptime: string,
        loadAverage: number[]
    },
    moduleCount: number
}