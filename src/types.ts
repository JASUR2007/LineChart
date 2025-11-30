export type Variation = { id?: number | string; name: string };
export type SourceRow = {
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
};
export type DataJson = {
    variations: Variation[];
    data: SourceRow[];
};

export type PreparedRow = {
    date: string;
    [key: string]: number | string | undefined;
};
