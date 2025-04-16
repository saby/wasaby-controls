/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import * as React from 'react';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { IFilterOptions, ISourceOptions, IStoreIdOptions } from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';
import { IListHandlers } from 'Controls/baseList';
import { ICompositeViewConfig } from 'Controls/_expandedCompositeTree/interface/ICompositeViewConfig';
import { ItemsEntity } from 'Controls/dragnDrop';
import { RecordSet } from 'Types/collection';
import { Record as EntityRecord } from 'Types/entity';

export interface IListEventHandlers {
    onCustomDragStart?: (dragItems: string[]) => ItemsEntity;
    onCustomDragEnd?: (
        entity: ItemsEntity,
        target: EntityRecord,
        position: string
    ) => Promise<void>;
    onChangeDragTarget?: (entity: ItemsEntity, target: EntityRecord) => boolean;
    itemsReadyCallback?: (items: RecordSet) => void;
    dataLoadCallback?: (items: RecordSet, direction: string) => void;
}

/**
 * Интерфейс контрола для отображения иерархии в развернутом виде и установке режима отображения элементов на каждом уровне вложенности
 * @public
 */
export interface IExpandedCompositeTree
    extends IControlOptions,
        IStoreIdOptions,
        ISourceOptions,
        IItemActionsOptions,
        IFilterOptions,
        IListHandlers,
        IListEventHandlers {
    /**
     * Уровень вложенности, начиная с которого узлы отображаются в виде составного элемента.
     * @cfg
     * @default 3
     */
    compositeNodesLevel?: number;
    /**
     * Конфигурация компонента, который используется для отображения записей-листов развёрнутого дерева.
     * @cfg
     */
    compositeViewConfig?: ICompositeViewConfig;
    /**
     * Шаблон, через который будут отображаться узлы развёрнутого дерева.
     * По умолчанию используется шаблон заголовков Controls/expandedCompositeTree:NodeItemTemplate
     * @cfg
     */
    itemTemplate?: TemplateFunction | React.FC;
    /**
     * Пользовательский шаблон отображения контрола без элементов.
     * @cfg
     * @demo Controls-demo/list_new/EmptyList/Default/Index
     * @default undefined
     */
    emptyTemplate?: TemplateFunction | React.FC;
}
