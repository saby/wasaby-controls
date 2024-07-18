import { EditingFrameFacade } from 'FrameEditor/base';
import { JsonmlFrameFacade } from 'Frame/base';
import { ISiteEditorLoadSettings } from 'FrameEditor/interfaces';
import { IOpenColumnsEditorProps } from '../interface';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { DataSet } from 'Types/source';
import { Query, SbisService } from 'Types/source';
import { adapter, Record } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { IColumn, TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import {
    DEFAULT_COLUMN_PARAMS,
    FIRST_COLUMN,
    END_ROW,
    START_ROW,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    validateColumnWidth,
    parseColumnWidth,
    buildNewWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import { deleteSelectedColumnsAction } from 'Controls-Lists-editors/_columnsEditor/actions/DeleteSelectedColumns';

interface IGetContextDataConfigProps extends IOpenColumnsEditorProps {
    allColumns: TColumnsForCtor;
    allHeader: THeaderForCtor;
}

interface ICallQueryParams {
    filterSettings: IFilter;
}

interface IGetAllOptionsParams {
    objectName: string;
}

interface IGetAllOptions {
    columns: TColumnsForCtor;
    header: THeaderForCtor;
}

interface IFilter {
    ObjectName: string;
    Parent?: string;
    Fields?: string[];
    Types?: string[];
}

// Утилиты для работы с данными редактора колонок

/**
 * Переводит данные колонок со значений, понятных редактору в стандартные
 * @param columns
 */
export function validateEditedColumns(columns: TColumnsForCtor): TColumnsForCtor {
    const result = [...columns];
    result.map((column) => {
        const newColumnSeparatorSize = {};
        if (column.columnSeparatorSize?.left === 'bold') {
            newColumnSeparatorSize.left = 's';
        }
        if (column.columnSeparatorSize?.right === 'bold') {
            newColumnSeparatorSize.right = 's';
        }
        column.columnSeparatorSize = newColumnSeparatorSize;
    });
    return result;
}

/**
 * Переводит данные колонок в понятные редактору
 * @param columns
 */
function validateColumnsConfig(columns: TColumnsForCtor): TColumnsForCtor {
    const result = [...columns];
    result.map((column, columnIndex: number) => {
        if (column.columnSeparatorSize?.left) {
            column.columnSeparatorSize.left = 'bold';
            // Для корректной работы редактора, общие разделители у смежных колонок должны быть одинаковыми
            if (columnIndex - 1 >= 0) {
                columns[columnIndex - 1].columnSeparatorSize = {
                    ...columns[columnIndex - 1].columnSeparatorSize,
                    right: 'bold',
                };
            }
        }
        if (column.columnSeparatorSize?.right) {
            column.columnSeparatorSize.right = 'bold';
            if (columnIndex + 1 < columns.length) {
                columns[columnIndex + 1].columnSeparatorSize = {
                    ...columns[columnIndex + 1].columnSeparatorSize,
                    left: 'bold',
                };
            }
        }
        if (!column.textOverflow) {
            column.textOverflow = 'ellipsis';
        }
        column.width = buildNewWidth(
            validateColumnWidth(parseColumnWidth(column.width), columnIndex === 0)
        );
    });
    return result;
}

export const getContextDataConfig = (
    params: IGetContextDataConfigProps
): ISiteEditorLoadSettings => {
    const getWidgetsMetaConfig = () => {
        const widgetsMetaConfig = {};
        widgetsMetaConfig[params.widget] = params.widgetMetaType;
        return widgetsMetaConfig;
    };

    return {
        templateOptions: {
            frames: {
                mainFrame: {
                    frameFacade: new EditingFrameFacade({
                        frame: new JsonmlFrameFacade([
                            'frame',
                            [
                                params.widget,
                                {
                                    id: 'widget',
                                    ...params.widgetProps,
                                    editingColumns: validateColumnsConfig(params.columns),
                                    editingHeaders: params.header,
                                    allColumns: params.allColumns,
                                    allHeader: params.allHeader,
                                    draggable: false,
                                    removable: false,
                                    selectable: false,
                                    selectedColumnsIdxs: [],
                                },
                            ],
                        ]),
                    }),
                    meta: {
                        ...getWidgetsMetaConfig(),
                    },
                },
            },
            items: [
                {
                    id: 'mainFrame',
                    frameId: 'mainFrame',
                    toolbarItems: [
                        toolbarFactory.undo(),
                        toolbarFactory.redo(),
                        deleteSelectedColumnsAction,
                    ],
                },
            ],
            selectedItemId: 'mainFrame',
        },
    };
};

/**
 * Вызов метода получения структуры прикладного объекта в виде иерархического списка полей по имени прикладного объекта
 * @param params {ICallQueryParams}
 */
export async function callQuery(params: ICallQueryParams): Promise<DataSet> {
    const { filterSettings } = params;
    const query = new Query();
    try {
        const filter = new Record({
            format: {
                ObjectName: 'string',
                Parent: 'string',
                Fields: 'array',
                Types: 'array',
            },
            adapter: new adapter.Sbis(),
        });
        filter.set({
            ...filterSettings,
        });
        query.where(filter);
    } catch (error) {
        Logger.error(String(error));
    }

    const dataSource = new SbisService({
        endpoint: {
            contract: 'DataObject',
            address: '/service/',
        },
        binding: {
            query: 'FieldList',
        },
    });
    let response: DataSet = new DataSet({ rawData: [] });
    try {
        response = await dataSource.query(query);
    } catch (error) {
        Logger.error(`Не удалось загрузить данные. ${error}`);
    }
    return response;
}

export async function getAllOptions(params: IGetAllOptionsParams): Promise<IGetAllOptions> {
    const { objectName } = params;
    const response = await callQuery({
        filterSettings: { ObjectName: objectName },
    });
    const allColumns: TColumnsForCtor = [];
    const allHeader: THeaderForCtor = [];
    const enumerator = response.getAll().getEnumerator();
    let index = FIRST_COLUMN;
    while (enumerator.moveNext()) {
        const initElement = enumerator.getCurrent();
        const column = {
            displayProperty: initElement.get('ID'),
            width: `${DEFAULT_COLUMN_PARAMS.width}px`,
        };
        allColumns.push(column);
        const header = {
            caption: initElement.get('Title'),
            startColumn: index,
            endColumn: index + 1,
            startRow: START_ROW,
            endRow: END_ROW,
            textOverflow: DEFAULT_COLUMN_PARAMS.textOverflow,
            align: DEFAULT_COLUMN_PARAMS.align,
        };
        allHeader.push(header);
        index += 1;
    }
    return {
        columns: allColumns,
        header: allHeader,
    };
}

export function getInitialColumnConfig(
    column: IColumn,
    allColumns: TColumnsForCtor,
    allHeaders: THeaderForCtor
): IColumn | undefined {
    let result = {};
    allColumns.map((initColumn, columnIndex) => {
        if (initColumn.displayProperty === column.displayProperty) {
            result = allHeaders.find((initHeader) => {
                return initHeader.startColumn - 1 === columnIndex;
            });
        }
    });
    return result;
}
