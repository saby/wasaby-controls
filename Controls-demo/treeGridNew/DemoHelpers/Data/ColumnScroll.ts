import { IColumn, IHeaderCell } from 'Controls/grid';
import { TemplateFunction } from 'UI/Base';

function createArray<T>(length: number, callback: (index: number) => T): T[] {
    const result: T[] = [];
    for (let i = 0; i < length; i++) {
        result.push(callback(i));
    }
    return result;
}

const DEFAULT_COLUMNS_LENGTH = 100;
const DEFAULT_ITEMS_LENGTH = 30;
const DEFAULT_STICKY_COLUMN_WIDTH = '150px';
const DEFAULT_SCROLLABLE_COLUMN_WIDTH = '1fr';

interface IConfig {
    stickyColumnsCount?: number;
    itemsCount?: number;
    columnsCount?: number;

    headerTemplate?: {
        sticky?: string | TemplateFunction;
        scrollable?: string | TemplateFunction;
    };
    columnTemplate?: {
        sticky?: string | TemplateFunction;
        scrollable?: string | TemplateFunction;
    };

    stickyColumnsWidth?: string[];
}

export const ColumnScroll = {
    create: (config: IConfig = {}) => {
        return {
            getHeader: () => {
                return createArray<IHeaderCell>(
                    config.columnsCount || DEFAULT_COLUMNS_LENGTH,
                    (index) => {
                        return {
                            caption:
                                (index < config.stickyColumnsCount ? 'Sticky header ' : 'Header ') +
                                (index + 1),
                            template:
                                index < config.stickyColumnsCount
                                    ? config?.headerTemplate?.sticky
                                    : config?.headerTemplate?.scrollable,
                        };
                    }
                );
            },
            getColumns: () => {
                return createArray<IColumn>(
                    config.columnsCount || DEFAULT_COLUMNS_LENGTH,
                    (index) => {
                        return {
                            displayProperty: 'index',
                            template:
                                index < config.stickyColumnsCount
                                    ? config?.columnTemplate?.sticky
                                    : config?.columnTemplate?.scrollable,
                            width:
                                index < config.stickyColumnsCount
                                    ? config?.stickyColumnsWidth
                                        ? config?.stickyColumnsWidth[index]
                                        : DEFAULT_STICKY_COLUMN_WIDTH
                                    : DEFAULT_SCROLLABLE_COLUMN_WIDTH,
                        };
                    }
                );
            },
            getData: () => {
                return createArray(config.itemsCount || DEFAULT_ITEMS_LENGTH, (index) => {
                    return {
                        key: index,
                        index,
                        parent: null,
                        nodeType: true,
                    };
                });
            },
        };
    },
};
