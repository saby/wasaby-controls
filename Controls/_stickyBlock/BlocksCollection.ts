/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import {
    IBlocksStack,
    IStickyBlockData,
    IStickyBlockRegisterData,
    IStickyBlocksData,
    StickyPosition,
    FixedPosition,
} from 'Controls/_stickyBlock/types';
import { getDecomposedPositionFromString } from 'Controls/_stickyBlock/Utils/getDecomposedPosition';
import { isHidden } from 'Controls/_stickyBlock/Utils/Utils';
import Model = require('Controls/_stickyBlock/Model');
import { getOffsetByContainer } from 'Controls/_stickyBlock/Controllers/helpers/functions';

export default class BlocksCollection {
    private _blocks: IStickyBlocksData = {};
    private _blocksStack: IBlocksStack = {
        top: [],
        bottom: [],
        left: [],
        right: [],
    };

    getStack(): IBlocksStack {
        return this._blocksStack;
    }

    getBlocks(): IStickyBlocksData {
        return { ...this._blocks };
    }

    add(block: IStickyBlockRegisterData): void {
        this._blocks[block.id] = { ...block };

        const position = {
            vertical: block.groupData ? block.groupData?.position : block.props.position,
            horizontal: block.groupData ? block.props.position : undefined,
        };

        if (!block.isGroup) {
            this._blocks[block.id].model = new Model({
                topTarget: block.observers.observerTop.current,
                top2Target: block.observers.observerTop2.current,
                top2RightTarget: block.observers.observerTop2Right.current,
                bottomLeftTarget: block.observers.observerBottomLeft.current,
                bottomRightTarget: block.observers.observerBottomRight.current,
                leftTarget: block.observers.observerLeft.current,
                rightTarget: block.observers.observerRight.current,
                position,
                setFixedPositionCallback: () => {
                    return 0;
                },
            });
        }
        this._blocks[block.id].fixedPosition = FixedPosition.None;
    }

    remove(id: string): void {
        delete this._blocks[id];
    }

    get(id: string): IStickyBlockData {
        return this._blocks[id];
    }

    addToStack(id: string, scrollContainer: HTMLElement): boolean {
        if (this.inStack(id)) {
            return true;
        }

        if (isHidden(this._blocks[id].stickyRef.current, true)) {
            return false;
        }

        const positions = getDecomposedPositionFromString(
            this._blocks[id].props.position
        ) as StickyPosition[];

        // TODO через время попробовать спилить
        //# region Костыль
        // По неизвестным причинам не стреляет ресайз обсервер при переключении вкладок в определенном порядке в
        // графической шапке.
        for (const position of positions) {
            this._blocksStack[position].forEach((blockId) => {
                if (isHidden(this._blocks[blockId].stickyRef.current)) {
                    this.removeFromStack(blockId);
                }
            });
        }
        //# endregion Костыль

        for (const position of positions) {
            const blocksStack = this._blocksStack[position];
            const newBlockOffset = getOffsetByContainer(
                this._blocks[id].stickyRef.current,
                position,
                scrollContainer
            );
            const headerContainerSizes = this._blocks[id].stickyRef.current.getBoundingClientRect();
            const blockContainerSize =
                headerContainerSizes[
                    position === StickyPosition.Left || position === StickyPosition.Right
                        ? 'width'
                        : 'height'
                ];

            // Ищем позицию первого элемента, смещение которого больше текущего.
            // Если смещение у элементов одинаковое, но у добавляемого заголовка высота равна нулю,
            // то считаем, что добавляемый находится выше. Вставляем новый заголовок в этой позиции.
            let index = blocksStack.findIndex((blockId) => {
                // Заголовок, находящийся в headersStack может быть скрыт. ResizeObserver, отслеживающий его размеры,
                // стрельнет позже. Поэтому такие заголовки нужно не учитывать в расчетах.
                const blockIsVisible = !isHidden(this._blocks[blockId].stickyRef.current);

                let blockOffset;
                if (blockIsVisible) {
                    blockOffset = getOffsetByContainer(
                        this._blocks[blockId].stickyRef.current,
                        position,
                        scrollContainer
                    );
                }
                return (
                    blockIsVisible &&
                    (blockOffset > newBlockOffset ||
                        (blockOffset === newBlockOffset && blockContainerSize === 0))
                );
            });
            index = index === -1 ? blocksStack.length : index;
            blocksStack.splice(index, 0, id);
        }
        return true;
    }

    removeFromStack(id: string): boolean {
        let isUpdated = false;

        for (const position of Object.keys(this._blocksStack)) {
            const index = this._blocksStack[position].indexOf(id);
            if (index !== -1) {
                this._blocksStack[position].splice(index, 1);
                isUpdated = true;
            }
        }

        return isUpdated;
    }

    getFixedStack(): {
        top: string[];
        bottom: string[];
        left: string[];
        right: string[];
    } {
        const fixedBlocks = {
            top: [],
            bottom: [],
            left: [],
            right: [],
        };
        for (const id in this._blocks) {
            if (this._blocks.hasOwnProperty(id)) {
                if (this._blocks[id].fixedPosition !== FixedPosition.None) {
                    const fixedPositions = getDecomposedPositionFromString(
                        this._blocks[id].fixedPosition
                    );
                    fixedPositions.forEach((fixedPosition) => {
                        fixedBlocks[fixedPosition].push(id);
                    });
                }
            }
        }
        return fixedBlocks;
    }

    inStack(id: string): boolean {
        const positions = getDecomposedPositionFromString(
            this._blocks[id].props.position
        ) as StickyPosition[];
        for (const position of positions) {
            if (this._blocksStack[position].includes(id)) {
                return true;
            }
        }
        return false;
    }
}
