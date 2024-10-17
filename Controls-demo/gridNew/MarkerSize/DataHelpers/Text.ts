import { IColumn } from 'Controls/grid';

export interface IData {
    key: number;
    px: string;
    fr1of3: string;
}

export const Text = {
    getData: (): IData[] => {
        return [
            {
                key: 1,
                px: 'Строго 150px',
                fr1of3:
                    '1/3 свободного пространства. fr - гибкая ширина. fr расчитывается как доля от' +
                    ' оставшегося свободного пространства внутри грида. Грубо говоря, сначала браузер' +
                    ' просчитает ширины всех остальных колонок, потом fr',
            },
            {
                key: 2,
                px: 'Ячейка 2/1',
                fr1of3: 'Ячейка 2/3',
            },
        ];
    },
    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'px',
                width: '150px',
            },
            {
                displayProperty: 'fr1of3',
                width: '400px',
            },
        ];
    },
};
