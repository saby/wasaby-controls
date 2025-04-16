export type TLegendVerticalPosition = 'top' | 'bottom';
export type THorizontalAlignment = 'start' | 'end' | 'center';

export default interface ILegend {
    legendVisible?: boolean;
    legendVerticalPosition?: TLegendVerticalPosition;
    legendHorizontalAlignment?: THorizontalAlignment;
}
