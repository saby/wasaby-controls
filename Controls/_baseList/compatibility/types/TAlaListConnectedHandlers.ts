import type {
    INewListSchemeHandlers,
    BaseControl as TBaseControl,
    IBaseControlOptions,
} from 'Controls/baseList';
import type {
    BaseTreeControl as TBaseTreeControl,
    IBaseTreeControlOptions,
} from 'Controls/baseTree';
import type * as React from 'react';
import type { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { TKey } from 'Controls/_interface/IItems';

type TGetAlaListConnectedHandler<
    T extends keyof INewListSchemeHandlers,
    TExtraArguments extends unknown[] = unknown[],
    TOverriddenReturnValue = ReturnType<INewListSchemeHandlers[T]>
> = (
    ...args: [...Parameters<INewListSchemeHandlers[T]>, ...TExtraArguments]
) => TOverriddenReturnValue;

// 1. AlaListConnectedHandlers -> ListConnected | OldLogic
// API, симметричное ListConnected'у, названия те же, но в параметрах
// передается еще старый BaseControl.
// Внутри метода определяется, может ли идти работа по слайсовой схеме.
// Если да, то проксируется вызов в ListConnected, если нет, то вызывается
// код старого BaseControl, вынесенный в отдельный загружаемый модуль.
// Модуль должны затягивать к себе гаранты построения в безслайсовой схеме,
// например, старый DataContainer.
// После отказа от браузера будет достаточно удалить параметры при вызове функции
// и подгружаемый модуль со старым кодом.
// Данная же обертка может быть удалена только ПОСЛЕ:
//  a) полного перевода пользователей на честные слайсы (storeId)
//  b) отказе от событий.
//  это не точно, есть еще вариант, обсуждаемо.
export type TAlaListConnectedHandlers = {
    setCollection: TGetAlaListConnectedHandler<'setCollection', [], boolean>;

    mark: TGetAlaListConnectedHandler<
        'mark',
        [control: TBaseControl, options: IBaseControlOptions]
    >;

    isExpanded: TGetAlaListConnectedHandler<
        'isExpanded',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions]
    >;

    isExpandAll: TGetAlaListConnectedHandler<
        'isExpandAll',
        [keys: TKey[] | undefined, control: TBaseTreeControl, options: IBaseTreeControlOptions]
    >;

    resetExpansion: TGetAlaListConnectedHandler<
        'resetExpansion',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions]
    >;

    toggleExpansion: TGetAlaListConnectedHandler<
        'toggleExpansion',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions],
        Promise<void>
    >;

    expand: TGetAlaListConnectedHandler<
        'expand',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions],
        Promise<void>
    >;

    collapse: TGetAlaListConnectedHandler<
        'collapse',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions],
        Promise<void>
    >;

    onExpanderClick: TGetAlaListConnectedHandler<
        'onExpanderClick',
        [control: TBaseTreeControl, options: IBaseTreeControlOptions]
    >;

    // FIXME: Переименовать в connect.
    onListMounted: (control: TBaseControl, options: IBaseControlOptions) => void;

    // FIXME! расхождение
    onActivatedNew: (
        params: {
            isTabPressed: boolean;
            isShiftKey: boolean;
            key?: React.KeyboardEvent['key'];
        },
        control: TBaseControl,
        options: IBaseControlOptions
    ) => void;

    // FIXME! расхождение
    onItemClickNew: (
        e: React.MouseEvent,
        item: Model | Model[],
        control: TBaseControl,
        options: IBaseControlOptions
    ) => void;

    onViewKeyDownArrowUpNew: TGetAlaListConnectedHandler<
        'onViewKeyDownArrowUpNew',
        [control: TBaseControl, options: IBaseControlOptions]
    >;
    onViewKeyDownArrowDownNew: TGetAlaListConnectedHandler<
        'onViewKeyDownArrowDownNew',
        [control: TBaseControl, options: IBaseControlOptions]
    >;
    onViewKeyDownArrowLeftNew: TGetAlaListConnectedHandler<
        'onViewKeyDownArrowLeftNew',
        [control: TBaseControl, options: IBaseControlOptions]
    >;
    onViewKeyDownArrowRightNew: TGetAlaListConnectedHandler<
        'onViewKeyDownArrowRightNew',
        [control: TBaseControl, options: IBaseControlOptions]
    >;
    onViewKeyDownSpaceNew: TGetAlaListConnectedHandler<
        'onViewMouseDownSpaceNew',
        [
            control: TBaseControl,
            options: IBaseControlOptions,
            markMethod: (key: CrudEntityKey) => void
        ]
    >;
    onViewKeyDownDelNew: TGetAlaListConnectedHandler<
        'onViewKeyDownDelNew',
        [control: TBaseControl, options: IBaseControlOptions]
    >;
};
