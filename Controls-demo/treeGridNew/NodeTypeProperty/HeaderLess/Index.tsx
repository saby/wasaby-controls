import * as React from 'react';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls-DataEnv/list';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { View } from 'Controls/treeGrid';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import { Model } from 'Types/entity';
import { ListItems } from 'Controls/dragnDrop';
import 'css!Controls-demo/treeGridNew/NodeTypeProperty/HeaderLess/style';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/HeaderLess/NodeFooterTemplate';
import { NodeFooterTemplate as NodeFooterBaseTemplate } from 'Controls/treeGrid';

const getData = () => {
    return [
        {
            key: 4,
            title: 'Пустая папка',
            parent: null,
            type: true,
            hasChild: true,
            nodeType: 'group',
            data: '',
            organization: '',
            cost: '',
            status: '',
        },
        {
            key: 1,
            title: 'Подписать',
            parent: null,
            type: true,
            hasChild: true,
            nodeType: 'group',
            data: '',
            organization: '',
            cost: '',
            status: '',
        },
        {
            key: 11,
            title: 'Документ 1',
            parent: 1,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '14.03.23',
            organization: 'ТД Аргус',
            cost: '280 600',
            status: 'Аннулирование',
        },
        {
            key: 12,
            title: 'Документ 2',
            parent: 1,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '13.03.23',
            organization: 'Аспект',
            cost: '24 456',
            status: 'Утверждение',
        },
        {
            key: 13,
            title: 'Документ 3',
            parent: 1,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '17.06.20',
            organization: 'ТД Аргус',
            cost: '3114',
            status: 'Принятие к бух. учету',
        },
        {
            key: 2,
            title: 'Обработанные',
            parent: null,
            type: true,
            hasChild: true,
            nodeType: 'group',
            data: '',
            organization: '',
            cost: '',
            status: '',
        },
        {
            key: 21,
            title: 'Документ 4',
            parent: 2,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '17.06.20',
            organization: 'Основа',
            cost: '3114',
            status: 'Принято',
        },
        {
            key: 22,
            title: 'Документ 5',
            parent: 2,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '10.06.19',
            organization: 'ТД Аспект',
            cost: '',
            status: 'Отказ',
        },
        {
            key: 3,
            title: 'Тур. организации',
            parent: null,
            type: true,
            hasChild: true,
            nodeType: 'group',
            data: '',
            organization: '',
            cost: '',
            status: '',
        },
        {
            key: 31,
            title: 'Доп. документ',
            parent: 3,
            type: null,
            hasChild: false,
            nodeType: null,
            data: '12.08.23',
            organization: 'Mountain guide',
            cost: '83 0000',
            status: 'Подтверждение',
        },
    ];
};

function NodeFooterTemplate(props) {
    return (
        <NodeFooterBaseTemplate {...props}>
            <div style={{ gridColumnStart: props.startColumn, gridColumnEnd: props.endColumn }}>
                {'Шаблон-функция'}
            </div>
        </NodeFooterBaseTemplate>
    );
}

function Demo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const treeGrid = React.useRef<View>(null);
    const columns = React.useMemo(() => {
        return [
            {
                displayProperty: 'title',
                width: '300px',
            },
        ];
    }, []);
    const onDragEnd = React.useCallback(
        (entity: ListItems, target: Model, position: LOCAL_MOVE_POSITION) => {
            const selection = {
                selected: entity.getItems(),
                excluded: [],
            };
            treeGrid.current?.moveItems(selection, target.getKey(), position).then(() => {
                return treeGrid.current?.reload();
            });
        },
        []
    );
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_widthFit controlsDemo_wrapper-treeGrid-base-treeGridView ControlsDemo_headerless_table"
        >
            <div>
                <span className={'ControlsDemo_headerless_text-bold'}>
                    {'Дерево без подвала развернутого узла'}
                </span>
                <View
                    ref={treeGrid}
                    rowSeparatorSize="s"
                    storeId={'HideFirstGroupSlice'}
                    columns={columns}
                    groupNodeViewMode={'headerless'}
                    itemsDragNDrop={true}
                    onCustomdragEnd={onDragEnd}
                    customEvents={['onCustomdragEnd']}
                />
            </div>
            <div className={'ControlsDemo_headerless_table_second'}>
                <span className={'ControlsDemo_headerless_text-bold'}>
                    {'Дерево с подвалом развернутого узла, переданного как шаблон-функция'}
                </span>
                <View
                    ref={treeGrid}
                    rowSeparatorSize="s"
                    storeId={'HideFirstGroupSlice'}
                    columns={columns}
                    groupNodeViewMode={'headerless'}
                    itemsDragNDrop={true}
                    onCustomdragEnd={onDragEnd}
                    customEvents={['onCustomdragEnd']}
                    nodeFooterTemplate={NodeFooterTemplate}
                />
            </div>
            <div className={'ControlsDemo_headerless_table_third'}>
                <span className={'ControlsDemo_headerless_text-bold'}>
                    {'Дерево с подвалом развернутого узла, переданного как строка'}
                </span>
                <View
                    ref={treeGrid}
                    rowSeparatorSize="s"
                    storeId={'HideFirstGroupSlice'}
                    columns={columns}
                    groupNodeViewMode={'headerless'}
                    itemsDragNDrop={true}
                    onCustomdragEnd={onDragEnd}
                    customEvents={['onCustomdragEnd']}
                    nodeFooterTemplate={Template}
                />
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HideFirstGroupSlice: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/NodeTypeProperty/HideTheOnlyGroup/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [null],
                    collapsedItems: [],
                    nodeTypeProperty: 'nodeType',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
