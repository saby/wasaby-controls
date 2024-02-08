import { EditingFrameFacade } from 'FrameEditor/base';
import { JsonmlFrameFacade } from 'Frame/base';
import { ISiteEditorLoadSettings } from 'FrameEditor/interfaces';
import { IOpenColumnsEditorProps } from './interface';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { DataSet } from 'Types/source';
import { Query, SbisService } from 'Types/source';
import { adapter, Record } from 'Types/entity';
import { Logger } from 'UICommon/Utils';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';

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

const START_ROW = 1;
const END_ROW = 2;
const FIRST_COLUMN = 1;
const DEFAULT_COLUMN_WIDTH = '120px';
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
                                    selectedColumns: params.columns,
                                    selectedHeaders: params.header,
                                    allColumns: params.allColumns,
                                    allHeader: params.allHeader,
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
                    toolbarItems: [toolbarFactory.undo(), toolbarFactory.redo()],
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
            width: DEFAULT_COLUMN_WIDTH,
        };
        allColumns.push(column);
        const header = {
            caption: initElement.get('Title'),
            startColumn: index,
            endColumn: index + 1,
            startRow: START_ROW,
            endRow: END_ROW,
        };
        allHeader.push(header);
        index += 1;
    }
    return {
        columns: allColumns,
        header: allHeader,
    };
}
