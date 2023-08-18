import { TColumns } from 'Controls/grid';
import * as ColumnTimerTemplate from 'wml!Controls-demo/HorizontalScroll/content/Grid/resources/columns/ColumnTimerTemplate';

export const getColumns = (count: number, withControls: boolean = false) => {
    const result: TColumns = [];
    result.push({
        displayProperty: 'title',
        width: '300px',
    });
    for (let i = 0; i < count - 1; i++) {
        result.push({
            displayProperty: `column_${i}`,
            width: '100px',
            template: withControls ? ColumnTimerTemplate : undefined,
        });
    }
    return result;
};
