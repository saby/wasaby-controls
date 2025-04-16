type ISeriesEntry = Record<string, unknown> & {
    name: string;
    valueProperty: string;
    displayProperty?: string;
    colorIndex?: number;
};

export { ISeriesEntry };
