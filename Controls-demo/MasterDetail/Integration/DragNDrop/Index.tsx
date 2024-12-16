import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { instanceOfModule } from 'Core/core-instance';
import { Model } from 'Types/entity';
import { CrudEntityKey, LOCAL_MOVE_POSITION, Memory } from 'Types/source';
import {
    Container as DragNDropContainer,
    DraggingTemplate as BaseDraggingTemplate,
    ItemsEntity,
    ListItems,
} from 'Controls/dragnDrop';
import {
    IDataConfig,
    IListDataFactoryArguments,
    IListState,
    ListSlice,
} from 'Controls/dataFactory';
import { ISelectionObject } from 'Controls/interface';
import { useSlice } from 'Controls-DataEnv/context';
import { Base as MasterDetail } from 'Controls/masterDetail';
import { Container as ScrolContainer } from 'Controls/scroll';
import { View as TreeGridView } from 'Controls/treeGrid';
import { ColumnTemplate, IColumn, View as GridView } from 'Controls/grid';

import Data from './Data';
import 'css!Controls-demo/MasterDetail/Integration/DragNDrop/DragNDrop';

interface IDraggingTemplateProps extends TInternalProps {
    entity: ItemsEntity;
}

const DraggingTemplateRef = React.forwardRef(function DraggingTemplate(
    props: IDraggingTemplateProps,
    ref: React.ForwardedRef<any>
): React.ReactElement {
    return (
        <BaseDraggingTemplate
            {...props}
            ref={ref}
            mainText={props.entity._options.mainText}
            image={props.entity._options.image}
            additionalText={props.entity._options.additionalText}
        ></BaseDraggingTemplate>
    );
});

function Master(props: TInternalProps): React.ReactElement {
    const masterSlice: IListState & ListSlice = useSlice('master') as IListState & ListSlice;
    const detailSlice: IListState & ListSlice = useSlice('detail') as IListState & ListSlice;
    const gridColumns = React.useMemo<IColumn[]>(() => {
        return [
            {
                displayProperty: 'name',
                width: '1fr',
            },
        ];
    }, []);
    const masterListRef = React.useRef<TreeGridView>(null);

    const onDragStart = React.useCallback(
        (items: CrudEntityKey[]) => {
            const firstItem = masterSlice.items.getRecordById(items[0]);
            return new ListItems({
                items,
                mainText: firstItem.get('name'),
            });
        },
        [masterSlice]
    );

    const onDragEnd = React.useCallback(
        (entity: ItemsEntity, target: Model, position: LOCAL_MOVE_POSITION) => {
            let targetId: CrudEntityKey | null = null;
            const items = entity.getItems();

            // Пернос из правого реестра
            if (entity.getOptions().detail) {
                targetId = target.getKey();
                detailSlice.items.setEventRaising(false, true);
                items.forEach((key: string | number): void => {
                    const item = detailSlice.items.getRecordById(key);
                    item.set('parent', targetId);
                    detailSlice.source.update(item);
                });
                detailSlice.items.setEventRaising(true, true);
                detailSlice.setState({
                    selectedKeys: [],
                });
                detailSlice.reload();
            } else {
                const selection: ISelectionObject = {
                    selected: entity.getItems(),
                    excluded: [],
                };
                if (masterListRef.current) {
                    return masterListRef.current.moveItems(selection, target.getKey(), position);
                }
            }
        },
        [masterSlice, detailSlice, masterListRef]
    );

    const onDragEnter = React.useCallback((entity: ItemsEntity) => {
        return instanceOfModule(entity, 'Controls/dragnDrop:ListItems');
    }, []);

    const onItemMouseDown = React.useCallback(
        (item: Model) => {
            detailSlice.setState({
                filter: {
                    parent: item.getKey(),
                },
            });
        },
        [detailSlice]
    );

    return (
        <ScrolContainer className="demo-DragNDrop__MasterDetail_master">
            <TreeGridView
                {...props}
                ref={masterListRef}
                storeId="master"
                itemsDragNDrop={true}
                onCustomdragStart={onDragStart}
                onCustomdragEnd={onDragEnd}
                onCustomdragEnter={onDragEnter}
                onItemMouseDown={onItemMouseDown}
                style="master"
                expanderDisplayMode="adaptive"
                columns={gridColumns}
                draggingTemplate={DraggingTemplateRef}
            />
        </ScrolContainer>
    );
}

interface IColumnContentTemplateProps {
    item: Model;
}

const DetailColumnTemplateRef = React.forwardRef(function DetailColumnTemplate(
    props: IDraggingTemplateProps,
    ref: React.ForwardedRef<any>
): React.ReactElement {
    const contentTemplate = React.useMemo(() => {
        return React.forwardRef(
            (
                contentTemplateProps: IColumnContentTemplateProps,
                contentTemplatePRef: React.ForwardedRef<HTMLDivElement>
            ) => {
                const item = contentTemplateProps.item.getContents();
                return (
                    <div className="tw-flex tw-flex-grow" ref={contentTemplatePRef}>
                        <img
                            className="demo-DragNDrop__MasterDetail_item-personPhoto"
                            src={item.get('img')}
                        />
                        <div>
                            <div className="demo-DragNDrop__MasterDetail_item-personName">
                                {item.get('name')}
                            </div>
                            <div className="demo-DragNDrop__MasterDetail_item-task">
                                <div className="{{item.isNew ? 'demo-DragNDrop__MasterDetail_item-taskTypeNew'}}">
                                    {item.get('taskType')}
                                </div>
                                <div className="demo-DragNDrop__MasterDetail_item-taskMsg">
                                    {item.get('shortMsg')}
                                </div>
                            </div>
                        </div>
                        <div className="ws-flex-grow-1 demo-DragNDrop__MasterDetail_item-date">
                            {item.get('date')}
                        </div>
                    </div>
                );
            }
        );
    }, []);

    return (
        <ColumnTemplate
            forwardedRef={ref}
            {...props}
            contentTemplate={contentTemplate}
        ></ColumnTemplate>
    );
});

function Detail(props: TInternalProps): React.ReactElement {
    const detailSlice: IListState & ListSlice = useSlice('detail') as IListState & ListSlice;
    const gridColumns = React.useMemo<IColumn[]>(() => {
        return [
            {
                displayProperty: 'name',
                width: '1fr',
                template: DetailColumnTemplateRef,
            },
        ];
    }, []);

    const onDragStart = React.useCallback(
        (items: CrudEntityKey[]) => {
            const firstItem = detailSlice.items.getRecordById(items[0]);
            return new ListItems({
                items,
                mainText: firstItem.get('name'),
                image: firstItem.get('img'),
                additionalText: firstItem.get('shortMsg'),
                detail: true,
            });
        },
        [detailSlice]
    );

    const onDragEnd = React.useCallback((entity: ItemsEntity, target: Model, position: string) => {
        const selection: ISelectionObject = {
            selected: entity.getItems(),
            excluded: [],
        };
        this._children.detailList.moveItems(selection, target.getKey(), position);
    }, []);

    return (
        <ScrolContainer className="demo-DragNDrop__MasterDetail_master">
            <GridView
                {...props}
                storeId="detail"
                itemsDragNDrop={true}
                onCustomdragStart={onDragStart}
                onCustomdragEnd={onDragEnd}
                columns={gridColumns}
                draggingTemplate={DraggingTemplateRef}
            />
        </ScrolContainer>
    );
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <DragNDropContainer>
                <MasterDetail
                    className={'demo-DragNDrop__MasterDetail'}
                    master={Master}
                    detail={Detail}
                />
            </DragNDropContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: Data.master,
                    }),
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                    markerVisibility: 'visible',
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: Data.detail,
                    }),
                    filter: {
                        parent: '0',
                    },
                    markerVisibility: 'visible',
                },
            },
        };
    },
});
