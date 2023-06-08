/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { MutableRefObject } from 'react';
import {
    IStickyBlock,
    IStickyGroupedBlock,
} from 'Controls/_stickyBlock/interfaces/IStickyBlock';
import { IStickyGroup } from 'Controls/_stickyBlock/interfaces/IStickyGroup';

import Model = require('Controls/_stickyBlock/Model');

export interface IStickyContextModel {
    // Если зафиксировался replaceable заголовок, значит другой replaceable заголовок стал не виден и "отфиксировался".
    syntheticFixedPosition: {
        fixedPosition: FixedPosition;
        prevPosition: FixedPosition;
    };
    fixedPosition: FixedPosition;
    shadow: IStickyShadow;
    offset: IStickyOffset;
}

export interface IStickyContextModels {
    [id: string]: IStickyContextModel;
}

export interface IStickyDataContext {
    models: IStickyContextModels;
    registerCallback: Function;
    unregisterCallback: Function;
    modeChangedCallback: Function;
    offsetChangedCallback: Function;
}

export interface IStickyGroupDataContext {
    registerCallback: Function;
    unregisterCallback: Function;
    groupSizeChangedCallback: Function;
    groupChangeFixedPositionCallback: Function;
    addedBlockInGroupCallback: Function;
    removedBlockInGroupCallback: Function;
    modeChangedCallback: Function;
    offsetChangedCallback: Function;
    scrollState?: {
        scrollTop: number;
        horizontalPosition: string;
        horizontalScrollMode: string;
    };
}

export interface IStickyShadow {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

export interface IStickyOffset {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface IStickyRefObservers {
    observerTop: MutableRefObject<HTMLElement>;
    observerTop2: MutableRefObject<HTMLElement>;
    observerTop2Right: MutableRefObject<HTMLElement>;
    observerBottomLeft: MutableRefObject<HTMLElement>;
    observerBottomRight: MutableRefObject<HTMLElement>;
    observerLeft: MutableRefObject<HTMLElement>;
    observerRight: MutableRefObject<HTMLElement>;
}

export interface IStickyBlockRegisterData {
    id: string;
    stickyRef: MutableRefObject<HTMLElement>;
    observers?: IStickyRefObservers;
    props: IStickyBlock | IStickyGroup | IStickyGroupedBlock;
    isGroup: boolean;
    groupData: IGroupData;
}

interface IGroupData {
    position: StickyVerticalPosition;
    id: string;
}

export interface IStickyBlockData extends IStickyBlockRegisterData {
    model?: typeof Model;
    offset?: IStickyOffset;
    shadow?: IStickyShadow;
    fixedPosition?: FixedPosition;
    fixedInitially?: boolean;
}

export interface IStickyBlocksData {
    [id: string]: IStickyBlockData;
}

export interface IOrientation {
    vertical?: StickyVerticalPosition;
    horizontal?: StickyHorizontalPosition;
}

export interface IBlocksStack {
    top: string[];
    bottom: string[];
    left: string[];
    right: string[];
}

export interface ISize {
    height: number;
    width: number;
}

export interface IBlockSizeController extends ISize {
    id: string;
}

export interface IFixedPositionUpdatedBlock {
    id: string;
    fixedPosition: FixedPosition;
    prevFixedPosition: FixedPosition;
}

export interface IDynamicProps {
    syntheticFixedPosition: {
        fixedPosition: FixedPosition;
        prevPosition: FixedPosition;
    };
    mode: Mode;
    offsetTop: number;
    offsetLeft: number;
    className: string;
}

export interface IBlockSize {
    rect: DOMRect;
    block: IStickyBlockData;
}

export interface IBlocksSizes {
    sizes: IBlockSize[];
    totalHeight: number;
}

// Убрать интерфейс после https://online.sbis.ru/opendoc.html?guid=5c3cfa94-0bc0-4a85-a93c-4e01d4256f6a
export interface IResizeObserverEntry {
    readonly contentRect: DOMRectReadOnly;
    readonly target: Element;
}

export interface IStickyBlockContentWrapper {
    fixedPosition: string;
    wasabyContext?: Record<string, unknown>;
    content?: Function;
}

/**
 * @interface Controls/stickyBlock:IFixedEventData
 * @public
 */
export interface IFixedEventData {
    /**
     * id прилипающего блока
     */
    id?: number;
    /**
     * Позиция зафиксированности прилипающего блока.
     */
    fixedPosition?: string;
    /**
     * Предыдущая позиция зафиксированности прилипающего блока.
     */
    prevPosition: string;
}

/**
 * @typedef {String} TypeFixedBlocks
 * @variant InitialFixed учитываются высоты заголовков которые были зафиксированы изначально
 * @variant Fixed зафиксированные в данный момент заголовки
 * @variant AllFixed высота всех заголовков, если бы они были зафиксированы
 */
export enum TypeFixedBlocks {
    InitialFixed = 'initialFixed',
    Fixed = 'fixed',
    AllFixed = 'allFixed',
}

export enum StackOperation {
    Add = 'add',
    Remove = 'remove',
    None = '',
}

export enum StickyVerticalPosition {
    Top = 'top',
    Bottom = 'bottom',
    TopBottom = 'topBottom',
}

export enum StickyHorizontalPosition {
    Left = 'left',
    Right = 'right',
    LeftRight = 'leftRight',
}

export enum StickyPosition {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export enum StickyOrientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

export enum StickyShadowVisibility {
    Visible = 'visible',
    Hidden = 'hidden',
    Initial = 'initial',
}

export enum Mode {
    Replaceable = 'replaceable',
    Stackable = 'stackable',
    NotSticky = 'notsticky',
}

export enum StickyGroupMode {
    Replaceable = 'replaceable',
    Stackable = 'stackable',
}

export enum ScrollShadowVisibility {
    Hidden = 'hidden',
    Visible = 'visible',
    Auto = 'auto',
    Gridauto = 'gridauto',
}

export enum FixedPosition {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
    TopLeft = 'topLeft',
    TopRight = 'topRight',
    BottomLeft = 'bottomLeft',
    BottomRight = 'bottomRight',
    None = '',
}

export enum ScrollPosition {
    Start = 'start',
    End = 'end',
    Middle = 'middle',
}
