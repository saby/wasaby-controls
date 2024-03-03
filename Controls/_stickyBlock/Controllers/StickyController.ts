/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import {
    FixedPosition,
    IBlockSize,
    IBlocksSizes,
    IFixedPositionUpdatedBlock,
    IStickyBlockData,
    IStickyBlockRegisterData,
    IStickyDataContext,
    IStickyGroupDataContext,
    Mode,
    ScrollShadowVisibility,
    StackOperation,
    StickyHorizontalPosition,
    StickyPosition,
    StickyShadowVisibility,
    StickyVerticalPosition,
    TypeFixedBlocks,
} from 'Controls/_stickyBlock/types';
import {
    getGeneralParentNode,
    getOffsetByContainer,
    getOppositePosition,
    getStickyBlockHeight,
    resetSticky,
    restoreSticky,
} from 'Controls/_stickyBlock/Controllers/helpers/functions';
import StickySizeController from 'Controls/_stickyBlock/Controllers/StickySizeController';
import ScrollModel from 'Controls/_scroll/Utils/ScrollModel';
import { getDecomposedPositionFromString } from 'Controls/_stickyBlock/Utils/getDecomposedPosition';
import { isHidden } from 'Controls/_stickyBlock/Utils/Utils';
import BlocksCollection from 'Controls/_stickyBlock/BlocksCollection';
import { StickyIntersectionController } from 'Controls/_stickyBlock/Controllers/StickyIntersectionController';
import { IStickyBlock } from 'Controls/_stickyBlock/interfaces/IStickyBlock';
import { getDimensions } from 'Controls/sizeUtils';
import ScrollState from 'Controls/_scroll/Utils/ScrollState';
import fastUpdate from 'Controls/_stickyBlock/FastUpdate';
import { getDevicePixelRatio, getOffsetObjectByContainer } from './helpers/functions';

const ISOLATED_GROUP_CLASS = '.controls-StickyHeader__isolatedGroup';

export default class StickyController {
    readonly _dispatchCallback: Function;
    readonly _stickyFixedCallback: Function;
    readonly _scrollContainerResizeCallback: Function;
    readonly _blocks: BlocksCollection = new BlocksCollection();
    readonly _sizeController: StickySizeController = new StickySizeController(
        this._blocks,
        this._sizeChanged.bind(this)
    );

    private _delayedBlocks: IStickyBlockData[] = [];
    private _intersectionObserver: StickyIntersectionController;
    private _scrollContainer: HTMLElement;
    private _scrollState: ScrollState;
    private _shadowVisibilityFromScrollContainer: object = {
        top: undefined,
        bottom: undefined,
    };
    private _dataContext: IStickyDataContext = {
        models: {},
        registerCallback: this._registerCallback.bind(this),
        unregisterCallback: this._unregisterCallback.bind(this),
        modeChangedCallback: this._modeChangedCallback.bind(this),
        offsetChangedCallback: this._offsetChangedCallback.bind(this),
    };
    private _groupDataContext: IStickyGroupDataContext = {
        registerCallback: this._registerCallback.bind(this),
        unregisterCallback: this._unregisterCallback.bind(this),
        groupSizeChangedCallback: this._groupSizeChangedCallback.bind(this),
        groupChangeFixedPositionCallback: this._groupChangeFixedPositionCallback.bind(this),
        addedBlockInGroupCallback: this._addedBlockInGroupCallback.bind(this),
        removedBlockInGroupCallback: this._removedBlockInGroupCallback.bind(this),
        modeChangedCallback: this._modeChangedCallback.bind(this),
        offsetChangedCallback: this._offsetChangedCallback.bind(this),
    };
    private _prevModels: object = {};
    private _horizontalGroupsWidths: { [id: string]: number } = {};
    private _horizontalGroupsFixed: {
        [id: string]: { leftFixed: boolean; rightFixed: boolean };
    } = {};
    private _registerDelayedPlanned: boolean;
    private _initialized: boolean = false;

    constructor(
        dispatch: Function,
        stickyFixedCallback: Function,
        scrollContainerResizeCallback: Function
    ) {
        this._stickyFixedCallback = stickyFixedCallback;
        this._dispatchCallback = dispatch;
        this._scrollContainerResizeCallback = scrollContainerResizeCallback;
        this._intersectionObserver = new StickyIntersectionController(
            this._blocks,
            this._scrollState,
            this._fixedPositionChange.bind(this)
        );
        dispatch(this._dataContext, this._groupDataContext);
    }

    destroy(): void {
        this._sizeController.destroy();
        this._intersectionObserver.destroy();
    }

    scrollStateChanged(scrollState: ScrollModel): void {
        const verticalPositionChanged =
            this._scrollState?.verticalPosition !== scrollState.verticalPosition;
        const horizontalPositionChanged =
            this._scrollState?.horizontalPosition !== scrollState.horizontalPosition;
        const canVerticalScrollChanged =
            this._scrollState?.canVerticalScroll !== scrollState.canVerticalScroll;
        const canHorizontalScrollChanged =
            this._scrollState?.canHorizontalScroll !== scrollState.canHorizontalScroll;
        this._scrollState = scrollState.clone();

        if (this._initialized && (canVerticalScrollChanged || canHorizontalScrollChanged)) {
            this._registerDelayed();
        }

        if (
            this._initialized &&
            (verticalPositionChanged || horizontalPositionChanged) &&
            (Object.keys(this._blocks.getBlocks()).length ||
                Object.keys(this._horizontalGroupsFixed).length)
        ) {
            this._updateShadows();
            this._dispatch();
        }
    }

    setShadowVisibility(
        topShadowVisibility: ScrollShadowVisibility,
        bottomShadowVisibility: ScrollShadowVisibility
    ): void {
        if (
            this._shadowVisibilityFromScrollContainer[StickyPosition.Top] !== topShadowVisibility ||
            this._shadowVisibilityFromScrollContainer[StickyPosition.Bottom] !==
                bottomShadowVisibility
        ) {
            this._shadowVisibilityFromScrollContainer[StickyPosition.Top] = topShadowVisibility;
            this._shadowVisibilityFromScrollContainer[StickyPosition.Bottom] =
                bottomShadowVisibility;
            if (Object.keys(this._blocks.getBlocks()).length) {
                this._updateShadows();
                this._dispatch();
            }
        }
    }

    hasFixed(position: StickyPosition): boolean {
        switch (position) {
            case StickyPosition.Top:
            case StickyPosition.Bottom: {
                return !!this._blocks.getFixedStack()[position].length;
            }
            case StickyPosition.Left: {
                for (const id in this._horizontalGroupsFixed) {
                    if (this._horizontalGroupsFixed.hasOwnProperty(id)) {
                        if (this._horizontalGroupsFixed[id].leftFixed) {
                            return true;
                        }
                    }
                }
                return false;
            }
            case StickyPosition.Right: {
                for (const id in this._horizontalGroupsFixed) {
                    if (this._horizontalGroupsFixed.hasOwnProperty(id)) {
                        if (this._horizontalGroupsFixed[id].rightFixed) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }

    hasShadowVisible(position: StickyPosition): boolean {
        let hasShadowVisible = false;

        if (position === StickyPosition.Top || position === StickyPosition.Bottom) {
            const fixedBlocks = this._blocks.getFixedStack()[position];
            for (const fixedBlockId of fixedBlocks) {
                if (
                    this._blocks.get(fixedBlockId).props.shadowVisibility !==
                    StickyShadowVisibility.Hidden
                ) {
                    hasShadowVisible = true;
                    break;
                }
            }
        }

        return hasShadowVisible;
    }

    getBlocksHeight(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed,
        considerOffsetTop: boolean = true
    ): number {
        const headersSize = this.getBlocksSizes(position, type, false, considerOffsetTop);
        return headersSize.totalHeight;
    }

    getBlocksWidth(): number {
        const values = Object.values(this._horizontalGroupsWidths);
        if (values.length) {
            return Math.max(...Object.values(this._horizontalGroupsWidths));
        }
        return 0;
    }

    getBlocksRects(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed
    ): IBlockSize[] {
        const headersSize = this.getBlocksSizes(position, type, true, true);
        return headersSize.sizes;
    }

    /* eslint-disable complexity */
    getBlocksSizes(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed,
        needRects: boolean = false,
        considerOffsetsTop: boolean = true
    ): IBlocksSizes {
        // type, предполагается, в будущем будет иметь еще одно значение, при котором будет высчитываться высота
        // всех зафиксированных на текущий момент заголовков.
        const sizes: IBlockSize[] = [];
        let replaceableRect: IBlockSize = null;

        let height: number = 0;
        let replaceableHeight: number = 0;
        let block: IStickyBlockData;
        let hasOffsetTop: boolean = false;
        for (const id of this._blocks.getStack()[position]) {
            block = this._blocks.get(id);
            const initSizes = () => {
                if (
                    block.fixedInitially ||
                    (block.props as IStickyBlock).offsetTop ||
                    type === TypeFixedBlocks.AllFixed ||
                    type === TypeFixedBlocks.Fixed
                ) {
                    height += getStickyBlockHeight(block.stickyRef.current);

                    // Не учитываем отрицательный offsetTop у зафиксированных изначально стики блоков, чтобы скроллбар
                    // на них не заезжал.
                    const ignoreOffsetTop =
                        (block.props as IStickyBlock).offsetTop < 0 &&
                        block.fixedInitially &&
                        type === TypeFixedBlocks.InitialFixed;
                    if (considerOffsetsTop && !ignoreOffsetTop && position === StickyPosition.Top) {
                        height += (block.props as IStickyBlock).offsetTop;
                    }

                    if (needRects) {
                        sizes.push({
                            rect: getDimensions(block.stickyRef.current),
                            block,
                        });
                    }
                }
                replaceableHeight = 0;
                replaceableRect = null;
            };

            if (!block || block.props.shadowVisibility === StickyShadowVisibility.Hidden) {
                continue;
            }

            hasOffsetTop = hasOffsetTop || !!(block.props as IStickyBlock).offsetTop;

            // Для всех режимов кроме allFixed пропустим все незафиксированные заголовки.
            let ignoreHeight =
                type !== TypeFixedBlocks.AllFixed &&
                !this._blocks.getFixedStack()[position].includes(id);

            // В режиме изначально зафиксированных заголовков не считаем заголовки, которые не были изначально
            // зафискированы.
            ignoreHeight =
                ignoreHeight || (type === TypeFixedBlocks.InitialFixed && !block.fixedInitially);

            // Если у заголовка задан offsetTop, то учитываем его во всех ражимах в любом случае.
            ignoreHeight = ignoreHeight && !(hasOffsetTop && block.fixedInitially);

            // Для динамического блока высота должна высчитываться всегда, иначе при скроле скролбар будет моргать
            if (block.props.mode === Mode.Dynamic) {
                initSizes();
            }

            if (ignoreHeight) {
                continue;
            }

            // Если заголовок «replaceable», то учитываем последний после всех «stackable» заголовков.
            if (block.props.mode === Mode.Stackable) {
                initSizes();
            } else if (block.props.mode === Mode.Replaceable) {
                replaceableHeight = getStickyBlockHeight(block.stickyRef.current);
                if (needRects) {
                    replaceableRect = {
                        rect: getDimensions(block.stickyRef.current),
                        block,
                    };
                }
            }
        }
        if (replaceableRect) {
            sizes.push(replaceableRect);
        }

        return {
            sizes,
            totalHeight: height + replaceableHeight,
        };
    }

    /* eslint-enable complexity */

    /**
     * Метод возвращает высоты заголовков, которые БУДУТ зафиксированны при переданном scrollTop.
     * В будущем может быть спилен т.к. могут появиться кейсы, когда при фиксации заголовка в нем будет меняться
     * контент, а значит и изменяться размеры, которые мы узнаем только после перерисовки.
     * @private
     */
    getFixedBlocksHeightByScrollTop(scrollTop: number): number {
        let resultHeight = 0;
        const fixedBlocksByScrollTop = this._getFixedBlocksByScrollTop(scrollTop);
        fixedBlocksByScrollTop.forEach((stickyBlock) => {
            if (stickyBlock.props.shadowVisibility !== StickyShadowVisibility.Hidden) {
                resultHeight += this._getBlockSize(stickyBlock.id).height;
            }
        });
        return resultHeight;
    }

    init(): void {
        this._initialized = true;
        this._registerDelayed();
    }

    hasBottomBlocks(): boolean {
        const headers = Object.values(this._blocks.getBlocks());
        for (let i = 0; i < headers.length; i++) {
            const position = headers[i].props.position;
            if (
                position === StickyVerticalPosition.Bottom ||
                StickyVerticalPosition.TopBottom ||
                position === StickyHorizontalPosition.Right
            ) {
                return true;
            }
        }
        return false;
    }

    syncRegisterDelayed(): void {
        this._registerDelayed(false);
    }

    private _dispatch(): void {
        let needUpdate = false;
        if (Object.keys(this._prevModels).length > Object.keys(this._dataContext.models).length) {
            Object.entries(this._dataContext.models).forEach(([id, data]): void => {
                if (this._prevModels[id]) {
                    if (JSON.stringify(this._prevModels[id]) !== JSON.stringify(data)) {
                        needUpdate = true;
                    }
                } else {
                    needUpdate = true;
                }
            });
        } else {
            needUpdate =
                JSON.stringify(this._prevModels) !== JSON.stringify(this._dataContext.models);
        }

        const isStackEmpty =
            !this._blocks.getStack().top.length && !this._blocks.getStack().bottom.length;
        if (isStackEmpty) {
            needUpdate = false;

            Object.entries(this._dataContext.models).forEach(([id, data]): void => {
                const isShadowChanged =
                    this._prevModels[id] &&
                    JSON.stringify(this._prevModels[id].shadow) !== JSON.stringify(data.shadow);
                if (isShadowChanged) {
                    needUpdate = true;
                }
            });
        }

        if (
            needUpdate ||
            this.hasFixed(StickyPosition.Left) ||
            this.hasFixed(StickyPosition.Right)
        ) {
            for (const id in this._dataContext.models) {
                if (this._dataContext.models.hasOwnProperty(id)) {
                    this._prevModels[id] = { ...this._dataContext.models[id] };
                }
            }
            this._dispatchCallback(this._dataContext, this._groupDataContext);
        }
    }

    private _addedBlockInGroupCallback(): void {
        this._updateShadows();
        this._updateOffsets();
        this._dispatch();
    }

    private _removedBlockInGroupCallback(): void {
        this._updateShadows();
        this._updateOffsets();
        this._dispatch();
    }

    private _modeChangedCallback(id: string, mode: Mode): void {
        this._blocks.get(id).props.mode = mode;

        if (mode === Mode.NotSticky) {
            this._blocks.removeFromStack(id);
        }

        this._updateShadows();
        this._updateOffsets();
        this._dispatch();
    }

    private _offsetChangedCallback(id: string, offset: number): void {
        if (offset !== undefined) {
            (this._blocks.get(id).props as IStickyBlock).offsetTop = offset;
        }

        this._updateShadows();
        this._updateOffsets();
        this._dispatch();
    }

    private _registerCallback(block: IStickyBlockRegisterData): Promise<void> {
        return this._register(block);
    }

    private _unregisterCallback(id: string): void {
        const shadowVisibility = this._blocks.get(id).props.shadowVisibility;
        this._unregister(id);
        if (shadowVisibility !== StickyShadowVisibility.Hidden) {
            this._stickyFixedCallback();
        }
    }

    private _register(block: IStickyBlockRegisterData): Promise<void> {
        this._initScrollContainerNodeByStickyContainer(block.stickyRef.current);
        if (!block.isGroup) {
            this._intersectionObserver.init(this._scrollContainer);
        }

        this._blocks.add(block);

        const isStickedOnTop =
            block.props.position.toLowerCase().indexOf(StickyPosition.Top) !== -1;
        const isStickedOnBottom =
            block.props.position.toLowerCase().indexOf(StickyPosition.Bottom) !== -1;

        this._dataContext.models[block.id] = {
            offset: {
                top: isStickedOnTop ? (block.props as IStickyBlock).offsetTop : undefined,
                bottom: isStickedOnBottom ? 0 : undefined,
                left: undefined,
                right: undefined,
            },
            shadow: {
                top: false,
                bottom: false,
                left: false,
                right: false,
            },
            fixedPosition: block.props.fixedPositionInitial || FixedPosition.None,
            syntheticFixedPosition: {
                fixedPosition: block.props.fixedPositionInitial || FixedPosition.None,
                prevPosition: FixedPosition.None,
            },
        };

        this._delayedBlocks.push(block);

        if (!block.isGroup) {
            this._intersectionObserver.observe(block);
        }

        if (this._scrollState?.canHorizontalScroll || this._scrollState?.canVerticalScroll) {
            return Promise.resolve().then(this._registerDelayed.bind(this));
        }

        return Promise.resolve();
    }

    private _unregister(id: string): void {
        if (!this._blocks.get(id).isGroup) {
            this._intersectionObserver.unobserve(id);
            this._sizeController.unobserve(this._blocks.get(id).stickyRef.current);
        }
        this._blocks.remove(id);
        this._blocks.removeFromStack(id);
        delete this._dataContext.models[id];
        delete this._horizontalGroupsFixed[id];
        delete this._horizontalGroupsWidths[id];
        const indexInDelayedBlocks = this._delayedBlocks.findIndex((item) => {
            return item.id === id;
        });
        this._delayedBlocks.splice(indexInDelayedBlocks, 1);
        this._updateOffsets();
        this._updateShadows();
        this._dispatch();
    }

    // Синхронно регистрируются стики блоки в scrollToElement.
    private _registerDelayed(async: boolean = true): Promise<void> {
        const fixedStack = this._blocks.getFixedStack();
        // Может возникнуть ситуация, когда стики зарегистрировался отложено раньше времени,
        // из-за чего его дальнейшее корректное отображение ломается
        // Поэтому явно смотрим какие стики стали зафиксированными, но не попали в stack
        if (
            fixedStack.top.length !== this._blocks.getStack().top.length ||
            fixedStack.bottom.length !== this._blocks.getStack().bottom.length ||
            fixedStack.left.length !== this._blocks.getStack().left.length ||
            fixedStack.right.length !== this._blocks.getStack().right.length
        ) {
            const positions = ['top', 'bottom', 'left', 'right'];
            positions.forEach((position) => {
                fixedStack[position].forEach((fixedStack) => {
                    if (
                        !this._blocks.inStack(fixedStack) &&
                        !this._delayedBlocks.find((el) => {
                            return el.id === fixedStack;
                        })
                    ) {
                        this._delayedBlocks.push(this._blocks.get(fixedStack));
                    }
                });
            });
        }
        let delayedBlocksCount = this._delayedBlocks.length;

        if (this._registerDelayedPlanned) {
            return;
        }

        if (
            !delayedBlocksCount ||
            !(this._scrollState?.canVerticalScroll || this._scrollState?.canHorizontalScroll)
        ) {
            return;
        }
        this._registerDelayedPlanned = true;

        if (async) {
            for (const id in this._blocks.getBlocks()) {
                if (this._blocks.getBlocks().hasOwnProperty(id)) {
                    fastUpdate.resetSticky(this._getStickyElementsById(id));
                }
            }
        } else {
            resetSticky(this._blocks.getBlocks());
        }

        const registerDelayedFunction = () => {
            // Обновим кол-во отложенных стики блоков, т.к. со временем могли добавиться новые.
            delayedBlocksCount = this._delayedBlocks.length;
            this._registerDelayedPlanned = false;
            this._delayedBlocks = this._delayedBlocks.filter((block: IStickyBlockData) => {
                if (!block.isGroup) {
                    this._resizeObserve(block.stickyRef.current, block.id);
                }

                const addedToStack = this._blocks.addToStack(block.id, this._scrollContainer);
                if (!addedToStack) {
                    this._sizeController.updateBlockSize(block.id, 0, 0);
                    return true;
                }
                return false;
            });

            if (!async) {
                restoreSticky(this._blocks.getBlocks());
            }

            if (delayedBlocksCount !== this._delayedBlocks.length) {
                this._updateShadows();
                this._updateOffsets();
                this._updateFixedInitially();
                this._scrollContainerResizeCallback();
                this._dispatch();
            }
        };

        if (!async) {
            registerDelayedFunction();
            return;
        }

        return fastUpdate.measure(registerDelayedFunction);
    }

    private _updateShadows(): void {
        // Сброс всех теней.
        for (const id in this._dataContext.models) {
            if (this._dataContext.models.hasOwnProperty(id)) {
                this._dataContext.models[id].shadow = {
                    top: undefined,
                    bottom: undefined,
                    left: undefined,
                    right: undefined,
                };
            }
        }

        for (const position of [StickyPosition.Top, StickyPosition.Bottom]) {
            this._blocks.getStack()[position].forEach((id) => {
                const block = this._blocks.get(id);
                if (block) {
                    const fixedPositions = getDecomposedPositionFromString(block.fixedPosition);
                    fixedPositions.forEach((fixedPosition) => {
                        if (block.props.shadowVisibility !== StickyShadowVisibility.Hidden) {
                            const lastBlockId = this._getLastFixedBlockWithShadowId(fixedPosition);
                            const shadowPosition = getOppositePosition(fixedPosition);
                            let shadowVisible;

                            if (this._shadowVisibilityFromScrollContainer[fixedPosition]) {
                                if (
                                    this._shadowVisibilityFromScrollContainer[fixedPosition] ===
                                    ScrollShadowVisibility.Visible
                                ) {
                                    shadowVisible = id === lastBlockId;
                                } else if (
                                    this._shadowVisibilityFromScrollContainer[fixedPosition] !==
                                    ScrollShadowVisibility.Hidden
                                ) {
                                    shadowVisible = id === lastBlockId;
                                }
                            }

                            this._dataContext.models[id].shadow[shadowPosition] = shadowVisible;
                        }
                    });
                }
            });
        }
    }

    private _updateOffsets(): void {
        const offsets = {
            top: {},
            bottom: {},
            left: {},
            right: {},
        };

        let block;
        let curBlock;
        let prevBlock;

        // Проверяем, имеет ли заголовок в родителях прямых родителей предыдущих заголовков.
        // Если имеет, значит заголовки находятся в одном контейнере -> высчитываем offset и добавляем к заголовку.
        for (const position of [StickyPosition.Top, StickyPosition.Bottom]) {
            this._blocks.getStack()[position].reduce((offset: number, id: string, i: number) => {
                block = this._blocks.get(id);
                // Если заголовок скрыт, то не будем ему проставлять offset.
                // Возникает следующая ошибка: невидимым заголовкам проставляется одинаковый offset, т.к
                // размер у скрытого заголовка получить нельзя и им задаётся смещение первого видимого заголовка.
                // В будущем, когда заголовки покажутся, они будут все иметь одинаковый offset
                // из-за чего в неправильном порядке запишутся в headersStack.
                if (isHidden(block.stickyRef.current)) {
                    return offset;
                }
                curBlock = null;

                // Если предыдущий заголовок replaceable и не имеет общих родителей с текущим - нужно вычесть
                // со смещения высоту последнего stackable заголовка или высоту всех заголовков предыдущей
                // изолированной группы (если она была).
                prevBlock = this._blocks.get(this._blocks.getStack()[position][i - 1]);
                if (
                    (prevBlock?.props.mode === Mode.Replaceable ||
                        (prevBlock?.props.mode === Mode.Dynamic && prevBlock.isHidden)) &&
                    block.props.mode === Mode.Stackable
                ) {
                    const parentNode = getGeneralParentNode(
                        prevBlock.stickyRef.current,
                        block.stickyRef.current
                    );
                    if (parentNode === document.body) {
                        const prevStackableBlock = this._getPrevStackableBlock(i, position);
                        let prevIsolatedGroup;
                        if (prevStackableBlock) {
                            prevIsolatedGroup = this._getIsolatedGroup(prevStackableBlock);
                        }
                        const size = prevIsolatedGroup
                            ? this._getIsolatedGroupBlocksHeight(prevIsolatedGroup, position)
                            : this._getPrevStackableBlockHeight(i, position);
                        offset -= size;
                    }
                }

                if (block.props.mode !== Mode.Dynamic) {
                    offsets[position][id] = offset + block.props.offsetTop;
                } else {
                    const blockHeight = this._getBlockSize(block.id).height;
                    if (!block.isHidden) {
                        offsets[position][id] = offset + block.props.offsetTop;
                        offset += blockHeight;
                    } else {
                        offsets[position][id] =
                            (block.topOffset ?? blockHeight) * -1 + block.props.offsetTop;
                        offset += blockHeight - (block.topOffset ?? blockHeight);
                    }
                }
                if (block.props.mode === Mode.Stackable) {
                    if (!StickyController.isLastIndex(this._blocks.getStack()[position], i)) {
                        const curHeaderId = this._blocks.getStack()[position][i + 1];
                        curBlock = this._blocks.get(curHeaderId);
                        // От текущего заголовка по стэку двигаемся к началу и ищем прямых родителей
                        for (let j = i; j >= 0; j--) {
                            prevBlock = this._blocks.get(this._blocks.getStack()[position][j]);
                            let size = this._getBlockSize(block.id);
                            const generalParentNode = getGeneralParentNode(
                                curBlock.stickyRef.current,
                                prevBlock.stickyRef.current
                            );
                            if (generalParentNode !== document.body) {
                                return offset + size.height;
                            } else if (j > 0 && prevBlock.props.mode === Mode.Stackable) {
                                const isolatedGroup0 = this._getIsolatedGroup(curBlock);
                                const isolatedGroup1 = this._getIsolatedGroup(prevBlock);

                                // Если стики блоки находятся в разных изолированных группах, то из оффсета
                                // вычитаем высоту всех стики блоков предыдущей изолированной группы за исключением
                                // её последнего stackable заголовка, т.к он еще не был приплюсован к итоговому
                                // offset.
                                if (isolatedGroup0 && isolatedGroup1) {
                                    const parentIsolatedGroup =
                                        isolatedGroup1.parentElement.closest(ISOLATED_GROUP_CLASS);
                                    let headersHeightIsolatedGroup;
                                    headersHeightIsolatedGroup = this._getIsolatedGroupBlocksHeight(
                                        isolatedGroup1,
                                        position
                                    );
                                    if (parentIsolatedGroup) {
                                        headersHeightIsolatedGroup +=
                                            this._getIsolatedGroupBlocksHeight(
                                                parentIsolatedGroup as HTMLElement,
                                                position
                                            );
                                    }
                                    offset -= headersHeightIsolatedGroup;
                                    offset += this._getBlockSize(prevBlock.id).height;
                                    if (offset < 0) {
                                        return 0;
                                    }
                                    return offset;
                                } else {
                                    // Бывают ситуации, когда какие-то из предыдущих заголовков могут находиться
                                    // в контейнерах, которые не являются родительским для текущего.
                                    // Значит нужно их не учитывать в смещении.
                                    size = this._getBlockSize(prevBlock.id);
                                    offset -= size.height;
                                }
                            }
                        }
                        return 0;
                    }
                }
                return offset;
            }, 0);
        }

        for (const position of [
            StickyPosition.Top,
            StickyPosition.Bottom,
            StickyPosition.Left,
            StickyPosition.Right,
        ]) {
            this._blocks.getStack()[position].forEach((id) => {
                this._dataContext.models[id].offset = {
                    top: offsets.top[id],
                    bottom: offsets.bottom[id],
                    left: offsets.left[id],
                    right: offsets.right[id],
                };

                const isolatedGroup = this._getIsolatedGroup(this._blocks.get(id));
                let observerTop2Offset;
                if (isolatedGroup) {
                    const height1 = this._getPrevStackableBlockHeightWithoutIsolatedGroup(
                        isolatedGroup,
                        position
                    );
                    const height2 = this._getPrevStackableBlocksHeightInIsolatedGroup(
                        isolatedGroup,
                        id,
                        position
                    );
                    const stickyBlockHeight = this._getBlockSize(id).height;
                    observerTop2Offset =
                        height2 === 0 ? height1 : height1 + (height2 - stickyBlockHeight) + 2;
                } else {
                    observerTop2Offset = (this._blocks.get(id).props as IStickyBlock).offsetTop
                        ? (this._blocks.get(id).props as IStickyBlock).offsetTop
                        : offsets.top[id];
                }

                if (this._blocks.get(id).isGroup) {
                    const groupObserversTop2 = this._blocks
                        .get(id)
                        .stickyRef.current.querySelectorAll(
                            '.controls-StickyBlock__observationTarget_top2'
                        );
                    const groupObserversTop2Right = this._blocks
                        .get(id)
                        .stickyRef.current.querySelectorAll(
                            '.controls-StickyBlock__observationTarget_top2Right'
                        );
                    groupObserversTop2.forEach((observerTop2: HTMLElement) => {
                        observerTop2.style.top = `${-observerTop2Offset}px`;
                    });
                    groupObserversTop2Right.forEach((observerTop2Right: HTMLElement) => {
                        observerTop2Right.style.top = `${-observerTop2Offset}px`;
                    });
                } else {
                    this._blocks.get(
                        id
                    ).observers.observerTop2.current.style.top = `${-observerTop2Offset}px`;
                    this._blocks.get(
                        id
                    ).observers.observerTop2Right.current.style.top = `${-observerTop2Offset}px`;
                }
            });
        }
    }

    private _fixedPositionChange(updatedBlocks: IFixedPositionUpdatedBlock[]): void {
        updatedBlocks.forEach((updatedBlock) => {
            // Если зафиксировался replaceable заголовок, значит другой replaceable заголовок стал не виден.
            // Получим id этого заголовка и "стрельнем" у него событием fixed.
            if (this._blocks.get(updatedBlock.id).props.mode === Mode.Replaceable) {
                const propPosition = this._blocks.get(updatedBlock.id).props.position;
                for (const position of getDecomposedPositionFromString(propPosition)) {
                    const stack = this._blocks.getStack()[position];
                    const indexInStack = stack.indexOf(updatedBlock.id);
                    const prevId = stack[indexInStack - 1];
                    if (
                        prevId !== undefined &&
                        this._blocks.get(prevId).props.mode === Mode.Replaceable
                    ) {
                        const newPosition = updatedBlock.fixedPosition
                            ? FixedPosition.None
                            : this._blocks.get(prevId).fixedPosition;
                        const prevPosition = updatedBlock.fixedPosition
                            ? this._blocks.get(prevId).fixedPosition
                            : FixedPosition.None;
                        if (newPosition !== prevPosition) {
                            this._dataContext.models[prevId].syntheticFixedPosition = {
                                fixedPosition: newPosition,
                                prevPosition,
                            };
                        }
                    }
                }
            }

            this._blocks.get(updatedBlock.id).fixedPosition = updatedBlock.fixedPosition;
            this._dataContext.models[updatedBlock.id].syntheticFixedPosition = {
                fixedPosition: updatedBlock.fixedPosition,
                prevPosition: updatedBlock.prevFixedPosition,
            };
            this._dataContext.models[updatedBlock.id].fixedPosition = updatedBlock.fixedPosition;
        });
        this._stickyFixedCallback();
        this._updateShadows();
        this._dispatch();
    }

    private _groupSizeChangedCallback(
        id: string,
        operation: StackOperation,
        blocksWidth?: number
    ): void {
        const isOnlyHorizontalGroup = !this._blocks.get(id);
        if (isOnlyHorizontalGroup) {
            if (blocksWidth === 0 && this._horizontalGroupsWidths[id]) {
                delete this._horizontalGroupsWidths[id];
            } else {
                this._horizontalGroupsWidths[id] = blocksWidth;
            }
            return;
        }

        if (operation) {
            const updatedBlock = {};
            updatedBlock[id] = { operation };
            this._sizeChanged(updatedBlock);
        } else {
            this._updateOffsets();
            this._dispatch();
        }
    }

    private _groupChangeFixedPositionCallback(
        id: string,
        fixedPosition: FixedPosition,
        scrollState: ScrollState
    ): void {
        this._horizontalGroupsFixed[id] = {
            leftFixed: undefined,
            rightFixed: undefined,
        };
        const decomposedPositions = getDecomposedPositionFromString(fixedPosition);
        for (const decomposedPosition of decomposedPositions) {
            if (decomposedPosition === StickyPosition.Left) {
                this._horizontalGroupsFixed[id].leftFixed = true;
            }
            if (decomposedPosition === StickyPosition.Right) {
                this._horizontalGroupsFixed[id].rightFixed = true;
            }
        }

        const isOnlyHorizontalGroup = !this._blocks.get(id);
        if (isOnlyHorizontalGroup) {
            this._stickyFixedCallback();
            if (scrollState?.horizontalPosition !== this._scrollState?.horizontalPosition) {
                this._dispatch();
            }
            return;
        }

        if (fixedPosition !== this._blocks.get(id).fixedPosition) {
            this._fixedPositionChange([
                {
                    id,
                    fixedPosition,
                    prevFixedPosition: this._blocks.get(id).fixedPosition,
                },
            ]);
        }
    }

    private _sizeChanged(updatedBlocks: object): void {
        if (!this._initialized) {
            return;
        }

        this._delayedBlocks = this._delayedBlocks.filter((delayedBlock) => {
            return !updatedBlocks[delayedBlock.id];
        });

        this._registerDelayed();

        const blocksToAdd = [];
        for (const id in updatedBlocks) {
            if (updatedBlocks.hasOwnProperty(id)) {
                if (updatedBlocks[id].operation === StackOperation.Add) {
                    const isDelayedBlock = this._delayedBlocks.some((delayedBlock) => {
                        return delayedBlock.id === id;
                    });
                    if (!isDelayedBlock) {
                        blocksToAdd.push(id);
                    }
                } else {
                    this._blocks.removeFromStack(id);
                }
            }
        }
        for (const id in this._blocks.getBlocks()) {
            if (this._blocks.getBlocks().hasOwnProperty(id)) {
                fastUpdate.resetSticky(this._getStickyElementsById(id));
            }
        }

        // Выполняем через fastUpdate т.к. будет пересчет оффсетов при добавлении в стэк.
        fastUpdate.measure(() => {
            for (const blockToAdd of blocksToAdd) {
                this._blocks.addToStack(blockToAdd, this._scrollContainer);
            }
        });

        fastUpdate.measure(() => {
            this._updateOffsets();
            this._updateShadows();
            this._scrollContainerResizeCallback();
            this._dispatch();
        });
    }

    private _getStickyElementsById(id: string): HTMLElement[] {
        const elements = [];
        if (this._blocks.get(id).isGroup) {
            const stickyGroupedBlockElements = this._blocks.get(id).stickyRef.current.children;
            for (const stickyElementKey in stickyGroupedBlockElements) {
                if (stickyGroupedBlockElements.hasOwnProperty(stickyElementKey)) {
                    elements.push(stickyGroupedBlockElements[stickyElementKey]);
                }
            }
        } else {
            elements.push(this._blocks.get(id).stickyRef.current);
        }
        return elements;
    }

    private _updateFixedInitially(position: StickyPosition = StickyPosition.Top): void {
        const stack: string[] = this._blocks.getStack()[position];
        const content: HTMLCollection = this._scrollContainer.children;
        const contentContainer = (
            position === StickyPosition.Top ? content[0] : content[content.length - 1]
        ) as HTMLElement;

        const blocksHeight: object = {};
        const revertPosition =
            position === StickyPosition.Top || position === StickyPosition.Bottom
                ? StickyPosition.Left
                : StickyPosition.Top;

        const updatedBlocks = [];
        for (const id of stack) {
            if (this._blocks.get(id).props.shadowVisibility === StickyShadowVisibility.Hidden) {
                continue;
            }
            const isolatedGroup = this._getIsolatedGroup(this._blocks.get(id));
            const blockOffset = getOffsetObjectByContainer(
                this._blocks.get(id).stickyRef.current,
                position,
                contentContainer
            );
            if (blockOffset[position] !== 0) {
                // При расчете высоты заголовка, мы учитываем devicePixelRatio. Нужно его учитывать и здесь, иначе
                // расчеты не сойдутся. Делайем это только если headerOffset не равен нулю, т.е. после первой итерации.
                blockOffset[position] -= Math.abs(1 - getDevicePixelRatio());
            }

            blockOffset[position] += (this._blocks.get(id).props as IStickyBlock).offsetTop;
            if (!blocksHeight[blockOffset[revertPosition]]) {
                blocksHeight[blockOffset[revertPosition]] = 0;
            }

            if (
                (this._blocks.get(id).props as IStickyBlock).initiallyFixed !== false &&
                blocksHeight[blockOffset[revertPosition]] >= blockOffset[position] &&
                !isolatedGroup
            ) {
                this._blocks.get(id).fixedInitially = true;

                // В fixedStack заголовок уже может быть, если заголовок стоит самый первый и у него стрельнул
                // обсвер. У следующего заголовка ниже обсервер не стрельнет, т.к он не посчитан - на нем
                // не проставлены top'ы.
                if (
                    position === StickyPosition.Top &&
                    !this._blocks.getFixedStack().top.includes(id)
                ) {
                    updatedBlocks.push({
                        id,
                        fixedPosition: FixedPosition.Top,
                        prevFixedPosition: FixedPosition.None,
                    });
                }
            }
            blocksHeight[blockOffset[revertPosition]] +=
                getStickyBlockHeight(this._blocks.get(id).stickyRef.current) +
                (this._blocks.get(id).props as IStickyBlock).offsetTop;
        }

        if (updatedBlocks.length) {
            this._fixedPositionChange(updatedBlocks);
        }
    }

    private _resizeObserve(stickyContainer: HTMLElement, id: string): void {
        this._sizeController.observe(stickyContainer, id);
    }

    private _updateScrollContainer(scrollContainer: HTMLElement): void {
        this._scrollContainer = scrollContainer;
    }

    private _initScrollContainerNodeByStickyContainer(stickyContainer: HTMLElement): void {
        if (!this._scrollContainer) {
            // Стики блок на реакте быстрее получает доступ к DOM, чем стреляет afterMount в скролл контейнере.
            this._updateScrollContainer(stickyContainer.closest('.controls-Scroll'));
        }
    }

    private _getLastFixedBlockWithShadowId(position: StickyPosition): string {
        let blockWithShadow: string;
        // Тень рисуем у последнего не заменяемого заголовка, либо у первого заменяемого.
        // Это позволяет не перерисовывать тени при откреплении/зареплении следующих заголовков.
        const fixedBlocks = this._blocks.getFixedStack();
        let replaceableId;
        let oldReplaceableHeight = 0;
        for (const blockId of this._blocks.getStack()[position]) {
            const block = this._blocks.get(blockId);
            if (
                fixedBlocks[position].includes(blockId) &&
                block.props.shadowVisibility !== StickyShadowVisibility.Hidden &&
                !isHidden(block.stickyRef.current)
            ) {
                blockWithShadow = blockId;
                // Если дальше есть заменяемый стики блок который прилип, то тень должна быть у него
                if (this._blocks.get(blockId).props.mode === Mode.Replaceable) {
                    if (
                        typeof replaceableId !== 'undefined' &&
                        !this._blocks.get(blockId).model?.fixedPosition
                    ) {
                        blockWithShadow = replaceableId;
                        break;
                    }
                    const currentReplaceableHeight = getStickyBlockHeight(block.stickyRef.current);
                    if (oldReplaceableHeight < currentReplaceableHeight) {
                        oldReplaceableHeight = currentReplaceableHeight;
                        replaceableId = blockId;
                    }
                }
            }
        }
        return typeof replaceableId !== 'undefined' ? replaceableId : blockWithShadow;
    }

    updateDynamicPosition(visibility: boolean, topOffset: number) {
        for (const blockId of this._blocks.getStack().top) {
            const block = this._blocks.get(blockId);
            if (block.props.mode === Mode.Dynamic) {
                if (typeof block.topOffset === 'undefined') {
                    block.topOffset = 0;
                }
                if (visibility) {
                    if (block.isHidden) {
                        block.topOffset = 0;
                        block.isHidden = false;
                        this._updateOffsets();
                        this._dispatch();
                    }
                } else {
                    block.topOffset += topOffset;
                    const blockHeight = this._getBlockSize(block.id).height;
                    if (blockHeight < block.topOffset) {
                        block.topOffset = blockHeight;
                    }
                    if (this._dataContext.models[block.id].offset.top < blockHeight) {
                        block.isHidden = true;
                        this._updateOffsets();
                        this._dispatch();
                    }
                }
            }
        }
    }

    private _getPrevStackableBlockHeightWithoutIsolatedGroup(
        isolatedGroup: HTMLElement,
        position: StickyPosition
    ): number {
        let height = 0;
        this._blocks.getStack()[position].forEach((id) => {
            const prevIsolatedGroup = this._getIsolatedGroup(this._blocks.get(id));
            if (prevIsolatedGroup === isolatedGroup) {
                return height;
            }

            if (!prevIsolatedGroup && this._blocks.get(id).props.mode === Mode.Stackable) {
                height += this._getBlockSize(id).height;
            }
        });
        return height;
    }

    private _getPrevStackableBlocksHeightInIsolatedGroup(
        isolatedGroup: HTMLElement,
        id: string,
        position: StickyPosition
    ): number {
        let height = 0;
        for (const stickyId of this._blocks.getStack()[position]) {
            const prevIsolatedGroup = this._getIsolatedGroup(this._blocks.get(stickyId));
            if (prevIsolatedGroup === isolatedGroup) {
                if (stickyId === id) {
                    return height;
                }
                height += this._getBlockSize(stickyId).height;
            }
        }
        return height;
    }

    private _getPrevStackableBlockHeight(blockIndex: number, position: StickyPosition): number {
        let stackableHeight = 0;
        for (let i = blockIndex - 1; i >= 0; i--) {
            const prevBlock = this._blocks.get(this._blocks.getStack()[position][i]);
            if (prevBlock.props.mode === Mode.Stackable) {
                const blockSize = this._getBlockSize(prevBlock.id);
                if (blockSize.height !== 0) {
                    stackableHeight = blockSize.height;
                }
            }
        }
        return stackableHeight;
    }

    private _getIsolatedGroupBlocksHeight(
        isolatedGroup: HTMLElement,
        position: StickyPosition
    ): number {
        const headersOfIsolatedGroup = this._getBlocksOfIsolatedGroup(isolatedGroup, position);
        return headersOfIsolatedGroup.reduce((sumHeight, id) => {
            return (
                sumHeight +
                (this._blocks.get(id).props.mode === Mode.Stackable
                    ? this._getBlockSize(id).height
                    : 0)
            );
        }, 0);
    }

    private _getBlocksOfIsolatedGroup(
        isolatedGroup: HTMLElement,
        position: StickyPosition
    ): string[] {
        return this._blocks.getStack()[position].filter((id) => {
            return this._getIsolatedGroup(this._blocks.get(id)) === isolatedGroup;
        });
    }

    private _getIsolatedGroup(block: IStickyBlockData): HTMLElement {
        return block?.stickyRef.current.closest(ISOLATED_GROUP_CLASS);
    }

    private _getPrevStackableBlock(
        curBlockIndex: number,
        position: StickyPosition
    ): IStickyBlockData {
        for (let i = curBlockIndex - 1; i >= 0; i--) {
            const prevBlock = this._blocks.get(this._blocks.getStack()[position][i]);
            if (prevBlock.props.mode === Mode.Stackable) {
                return prevBlock;
            }
        }
    }

    private _getBlockSize(id: string): { height: number } {
        const block = this._blocks.get(id);
        return {
            height:
                getStickyBlockHeight(block.stickyRef.current) +
                ((block.props as IStickyBlock).offsetTop || 0),
        };
    }

    // Метод возвращает стики блоки, которые БУДУТ зафиксированы при переданном scrollTop'е.
    private _getFixedBlocksByScrollTop(scrollTop: number): IStickyBlockData[] {
        const resultBlocks = [];
        for (const id of this._blocks.getStack().top) {
            const offsetByContainer = getOffsetByContainer(
                this._blocks.get(id).stickyRef.current,
                StickyPosition.Top,
                this._scrollContainer.children[0] as HTMLElement
            );

            if (offsetByContainer > scrollTop) {
                return resultBlocks;
            } else {
                const block = this._blocks.get(id);
                if (block.props?.mode === Mode.Stackable) {
                    resultBlocks.push(block);
                } else {
                    resultBlocks[0] = block;
                }
            }
        }
        return resultBlocks;
    }

    static isLastIndex(srcArray: string[], index: number): boolean {
        return index === srcArray.length - 1;
    }
}
