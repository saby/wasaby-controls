import { IListState, ListSlice } from 'Controls/dataFactory';
import { createFieldsRecordSet, createFieldsSource, IFieldItem } from './FieldsSource';
import { RecordSet } from 'Types/collection';

export interface IDataFactoryParams {
    fields: IFieldItem[];
    fieldType: unknown[];
}

export interface IFieldListState extends IListState {
    fields: IFieldItem[];
}

export interface IFieldLoadResult {
    items: RecordSet;
}

async function loadData(config: IDataFactoryParams): Promise<IFieldLoadResult> {
    return Promise.resolve({
        items: createFieldsRecordSet(config.fields),
    });
}

// TODO: поправить проблемы с зависимостью модуля от enum с типом полей
// https://online.sbis.ru/doc/b6132bb4-6fc8-470f-9159-e1679f32a7b8?client=3
type FieldTypes = unknown;
const LIST_TYPE = 'list';

/**
 * Слайс для списка полей, работающий с внешним хранилищем полей.
 */
export class FieldListSlice extends ListSlice<IFieldListState> {
    protected _initState(
        loadResult: IFieldLoadResult,
        initConfig: IDataFactoryParams
    ): IFieldListState {
        const fields = this._filterByType(
            this._filterFields(initConfig.fields || []),
            initConfig.fieldType
        );
        return {
            ...super._initState(
                { ...loadResult, items: createFieldsRecordSet(fields) },
                initConfig
            ),
            fields,
            source: createFieldsSource(fields),
        };
    }

    /**
     * Метод предварительной фильтрации полей
     * @param fields
     * @protected
     */
    protected _filterFields(fields: IFieldItem[]): IFieldItem[] {
        //Скрываем все поля, которые являются колонками
        const result = fields.filter((field) => {
            if (!!field.Parent && fields.find((p) => p.Id === field.Parent)?.View === 'list') {
                return false;
            }

            return true;
        });

        result.forEach((field) => {
            if (field.View === 'list') {
                field.Parent_ = false;
            }
        });

        //Скрываем поля без дочерних элементов, которые оказались без типа
        return result.filter((field) => {
            if (!!field.FieldType) {
                return true;
            }

            return result.some((x) => x.Parent === field.Id);
        });
    }

    private _filterByType(fields: IFieldItem[], types: FieldTypes[] = []): IFieldItem[] {
        if (!types.length) {
            return fields;
        }

        const result = [] as IFieldItem[];
        for (const node of getNodesByType(getLeafNodes(fields), types)) {
            buildNodeHierarchy({
                buildFor: node,
                allNodes: fields,
                nodeAccumulator: result,
                types,
            });
        }

        return result.sort((a, b) => {
            if (a.Parent_ && b.Parent_) {
                return 0;
            }
            if (a.Parent_ && !b.Parent_) {
                return 1;
            }
            if (!a.Parent_ && b.Parent_) {
                return -1;
            }
        });
    }

    protected _beforeApplyState(
        nextState: IFieldListState
    ): Promise<IFieldListState> | IFieldListState {
        if (nextState.fields !== this.state.fields) {
            nextState.fields = this._filterFields(nextState.fields);
            nextState.source = createFieldsSource(nextState.fields);
        }
        return super._beforeApplyState(nextState);
    }
}

/*
 * Возвращает концевые узлы дерева (листья)
 */
function getLeafNodes(nodes: IFieldItem[]): IFieldItem[] {
    return nodes.filter((field) => field.Parent_ === false);
}

/*
 * Возвращает узлы, соответсвующие указанному типу
 */
function getNodesByType(nodes: IFieldItem[], types: FieldTypes[]): IFieldItem[] {
    const includeList = types.includes(LIST_TYPE);
    return nodes.filter((node) => {
        if (includeList && node.View === 'list') {
            return true;
        }
        return types.includes(getNodeType(node));
    });
}

function getNodeType(node: IFieldItem): FieldTypes | undefined {
    if (!node) {
        return undefined;
    }
    if (!node.Type && node.View === LIST_TYPE) {
        return LIST_TYPE;
    }
    return node.Type?.toLowerCase();
}

interface IHierarchyBuilderParams {
    /**
     * Узел, для которого восстанавливаем иерархию
     */
    buildFor: IFieldItem;
    /**
     * Справочник всех доступных узлов
     */
    allNodes: IFieldItem[];
    /*
     * Аккумулятор обработанных узлов
     */
    nodeAccumulator: IFieldItem[];
    /*
     * Типы для проверки отбираемых данных
     */
    types: FieldTypes[];
}
/*
 * Восстанавливает иерархию узлов начиная с конечного
 * @remark если тип родителя отсутствует в types, то удаляем у него режим отображения (делаем узел недоступным для выбора)
 */
function buildNodeHierarchy({
    buildFor,
    allNodes,
    nodeAccumulator,
    types,
}: IHierarchyBuilderParams): IFieldItem[] {
    pushNode(nodeAccumulator, buildFor);
    const parent = getParentNode(allNodes, buildFor);
    if (!parent) {
        return nodeAccumulator;
    }
    if (!types.includes(getNodeType(parent))) {
        parent.View = null;
    }
    if (!!parent.Parent) {
        buildNodeHierarchy({
            buildFor: parent,
            nodeAccumulator,
            types,
            allNodes,
        });
    } else {
        // достигли корня дерева
        pushNode(nodeAccumulator, parent);
    }
    return nodeAccumulator;
}

/*
 * Добавляет узел в дерево, предварительно проверяет существует ли нода
 * @param store
 * @param node
 */
function pushNode(store: IFieldItem[], node: IFieldItem): IFieldItem[] {
    if (store.some((x) => x.Id === node.Id)) {
        return store;
    }
    store.push(node);
}

function getParentNode(nodes: IFieldItem[], node: IFieldItem): IFieldItem | null {
    return nodes.find((x) => x.Id === node.Parent);
}

export default {
    loadData,
    slice: FieldListSlice,
};
