import type { BaseControl as TBaseControl, IBaseControlOptions } from 'Controls/baseList';
import type { CrudEntityKey } from 'Types/source';
import type { IEditableCollectionItem } from 'Controls/display';

// 4. Методы с постфиксом Compatible.
//  Во-первых, это методы, которые возвращают опцию в слйсовой
//  и результат метода в безслайсовой схеме.
//  Так сделано, т.к. не было времени разбираться как динамически ссгенерить
//  типобезопасный геттер. Например, список читает _options.markedKey.
//  Появляется _options.getMarkedKeyCompatible, который либо берет стейт слайса,
//  либо идет в методы старого BaseControl.
//  Во-вторых, тут методы, которые нужны старому списку для корректной работы, но
//  еще не реализованы в полной мере.
//  Также тут спорные методы, которые просто непонятно где будут находиться.
//  например onViewDragStart.
//  Может, оно распадется на два, одно будет во вьюхе, другое
//  в слайсе.
//  А может это будет обертка над вьюхой, позволяющая драгать и
//  регистрирующая все события.
export type TCompatibilityForUndoneAspects = {
    // FIXME: Переделать на геттер markedKey,
    //  должно синхронизироваться в каждой схеме одинаково.
    getMarkedKeyCompatible: (
        control: TBaseControl,
        options: IBaseControlOptions
    ) => CrudEntityKey | undefined | null;

    isSourceControllerLoadingNow: (control: TBaseControl, options: IBaseControlOptions) => boolean;

    onViewDragStartCompatible: (
        key: CrudEntityKey,
        control: TBaseControl,
        options: IBaseControlOptions
    ) => void;

    onAfterPagingCompatible: (
        key: CrudEntityKey,
        control: TBaseControl,
        options: IBaseControlOptions
    ) => void;

    onAfterEndEditCallbackCompatible: (
        item: IEditableCollectionItem,
        isAdd: boolean,
        willSave: boolean,
        control: TBaseControl,
        options: IBaseControlOptions
    ) => void;
};
