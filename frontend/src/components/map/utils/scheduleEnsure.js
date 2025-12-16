export function makeScheduledEnsure(map, ensure) {
    let rafId = null;

    const schedule = () => {
        if (rafId != null) return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            if (map?.getStyle && map.getStyle()) ensure();
        });
    };

    const cleanup = () => {
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = null;
    };

    return { schedule, cleanup };
}
