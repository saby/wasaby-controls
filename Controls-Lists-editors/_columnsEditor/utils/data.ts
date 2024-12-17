import { EditingFrameFacade } from 'FrameEditor/base';
import { JsonmlFrameFacade } from 'Frame/base';
import { ISiteEditorLoadSettings } from 'FrameEditor/interfaces';
import { IOpenColumnsEditorProps, IColumnsProps } from '../interface';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { DataSet } from 'Types/source';
import { Query, SbisService } from 'Types/source';
import { adapter, Record } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import {
    FIRST_COLUMN,
    END_ROW,
    START_ROW,
    SECONDARY_COLUMN_DEFAULT_PARAMS,
    DEFAULT_COLUMN_PARAMS,
    FAKE_COLUMN,
    FAKE_HEADER,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import {
    validateColumnWidth,
    parseColumnWidth,
    buildNewWidth,
} from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import {
    addNewFolderAction,
    deleteSelectedColumnsAction,
} from 'Controls-Lists-editors/_columnsEditor/actions/utils';

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
    // Удалить фейковую колонку
    result.pop();
    return result;
}
/**
 * Переводит данные заголовков со значений, понятных редактору в стандартные
 * @param header
 */
export function validateEditedHeader(header: THeaderForCtor): THeaderForCtor {
    const result = [...header];
    // Удалить фейковый заголовок
    result.pop();
    return result;
}

export function addFakeColumn(columns: TColumnsForCtor) {
    columns.push({
        key: FAKE_COLUMN,
        width: '0px',
    });
}

export function addFakeHeader(headers: THeaderForCtor) {
    let maxEndRow = 2;
    let maxEndColumn = 2;
    headers.map((header) => {
        if (header.endRow > maxEndRow) {
            maxEndRow = header.endRow;
        }
        if (header.endColumn > maxEndColumn) {
            maxEndColumn = header.endColumn;
        }
    });
    headers.push({
        key: FAKE_HEADER,
        startRow: 1,
        endRow: maxEndRow,
        startColumn: maxEndColumn,
        endColumn: maxEndColumn + 1,
    });
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
        const isMainColumn = columnIndex === 0;
        column.width = buildNewWidth(
            validateColumnWidth(parseColumnWidth(column.width), isMainColumn),
            isMainColumn
        );
        column.textOverflow = 'ellipsis';
    });
    addFakeColumn(result);
    return result;
}

function validateHeaderConfig(header: THeaderForCtor): THeaderForCtor {
    const result = [...header];
    result.map((header) => {
        header.textOverflow = 'ellipsis';
        if (!header.whiteSpace) {
            header.whiteSpace = 'normal';
        }
    });
    addFakeHeader(result);
    return result;
}

export const getContextDataConfig = (
    params: IGetContextDataConfigProps
): ISiteEditorLoadSettings => {
    const { widget, widgetProps, widgetMetaType } = params.editorProps;
    const getWidgetsMetaConfig = () => {
        const widgetsMetaConfig = {};
        widgetsMetaConfig[widget] = widgetMetaType;
        return widgetsMetaConfig;
    };
    const getMainFrameConfig = (value: IColumnsProps) => {
        return {
            mainFrame: {
                frameFacade: new EditingFrameFacade({
                    frame: new JsonmlFrameFacade([
                        'frame',
                        [
                            widget,
                            {
                                id: 'widget',
                                ...widgetProps,
                                editingColumns: validateColumnsConfig(value.columns),
                                editingHeaders: validateHeaderConfig(value.header),
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
        };
    };
    const installationParams: IColumnsProps = widgetMetaType.getDefaultValue();
    return {
        templateOptions: {
            frames: {
                ...getMainFrameConfig(params.value),
            },
            items: [
                {
                    id: 'mainFrame',
                    frameId: 'mainFrame',
                    toolbarItems: [
                        toolbarFactory.reset({ tooltip: 'Вернуть настройки по умолчанию' }),
                        toolbarFactory.undo(),
                        toolbarFactory.redo(),
                        addNewFolderAction,
                        deleteSelectedColumnsAction,
                    ],
                },
            ],
            selectedItemId: 'mainFrame',
            installationFrames: {
                ...getMainFrameConfig({
                    columns: [...installationParams.columns],
                    header: [...installationParams.header],
                }),
            },
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
            width: SECONDARY_COLUMN_DEFAULT_PARAMS.width,
            textOverflow: DEFAULT_COLUMN_PARAMS.textOverflow,
            align: SECONDARY_COLUMN_DEFAULT_PARAMS.align,
        };
        allColumns.push(column);
        const header = {
            caption: initElement.get('Title'),
            startColumn: index,
            endColumn: index + 1,
            startRow: START_ROW,
            endRow: END_ROW,
            whiteSpace: SECONDARY_COLUMN_DEFAULT_PARAMS.whiteSpace,
            textOverflow: DEFAULT_COLUMN_PARAMS.textOverflow,
            align: SECONDARY_COLUMN_DEFAULT_PARAMS.align,
        };
        allHeader.push(header);
        index += 1;
    }
    return {
        columns: allColumns,
        header: allHeader,
    };
}

