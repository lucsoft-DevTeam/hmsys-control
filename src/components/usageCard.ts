import type { HeadlessCard } from '@lucsoft/webgen/bin/lib/Cards';

export function usageCard(test: { RAM: number, CPU: number }): HeadlessCard
{
    const holder = document.createElement('div');

    const progressToStrokeWidth = (value: number) =>
        map_range(value, 0, 100, 246, 0) + "px";

    const map_range = (value: number, low1: number, high1: number, low2: number, high2: number) =>
        low2 + (high2 - low2) * (value - low1) / (high1 - low1);


    holder.style.padding = "1.1rem 1.45rem";
    holder.style.display = "flex";
    holder.style.gap = "1.5rem";
    (Object.keys(test) as any).forEach((x: "RAM" | "CPU") =>
    {
        holder.innerHTML += `<svg class="progress" width="90" height="90" viewBox="0 0 90 90">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${x}</text>
        <circle class="progressMeter" cx="45" cy="45" r="39" fill="none" stroke-width="12" />
        <circle class="progressValue" style="stroke-dashoffset: ${progressToStrokeWidth(test[ x ] ?? 0)}" cx="45" cy="45" r="39" fill="none" stroke-width="12" />
        </svg>`
    })

    return {
        type: "less",
        html: holder
    };
}