/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { CONTENT_CLASS } from 'Controls/_stickyBlock/constants';
import { getStickyBlockIdFromNode } from 'Controls/_stickyBlock/Controllers/helpers/functions';
import {
    IBlockSizeController,
    StackOperation,
    IResizeObserverEntry,
} from 'Controls/_stickyBlock/types';
import BlocksCollection from 'Controls/_stickyBlock/BlocksCollection';

export default class StickySizeController {
    readonly _blocks: BlocksCollection;

    private _resizeObserver: ResizeObserverUtil;
    private _blocksSizes: IBlockSizeController[] = [];
    private _sizeChangedCallback: Function;

    constructor(blocks: BlocksCollection, sizeChangedCallback: Function) {
        this._resizeObserver = new ResizeObserverUtil(undefined, this._resizeHandler.bind(this));
        this._blocks = blocks;
        this._sizeChangedCallback = sizeChangedCallback;
    }

    destroy(): void {
        this._resizeObserver.terminate();
        this._resizeObserver = null;
    }

    observe(stickyContainer: HTMLElement, id: string): HTMLElement {
        const contentNode = stickyContainer.querySelector<HTMLElement>(`.${CONTENT_CLASS}`);
        // Контент на стики блоке обсервится по сути только из-за горизонтального скроллбара в гридах. На реакте
        // пока встречается довольно много моментов с лишними ремаунтами, поэтому при пересоздании контента в
        // стики блоке обсервер "ломается".
        const observableNode =
            contentNode && stickyContainer.getAttribute('column-scrollbar')
                ? contentNode
                : stickyContainer;
        // Вешаем дата-аттрибут здесь, т.к. если повесить его в самом контроле, то будем иметь ошибку гидрации из-за
        // того, что все модули на сервере кэшируется, в том числе id, а на клиенте нет.
        observableNode.setAttribute('data-stickyblockid', id);
        this._resizeObserver.observe(observableNode);
        return observableNode;
    }

    unobserve(stickyContainer: HTMLElement): HTMLElement {
        if (!this._resizeObserver) {
            return;
        }

        const contentNode = stickyContainer.querySelector<HTMLElement>(`.${CONTENT_CLASS}`);
        const observableNode =
            contentNode && stickyContainer.getAttribute('column-scrollbar')
                ? contentNode
                : stickyContainer;
        this._resizeObserver.unobserve(observableNode);
        return observableNode;
    }

    updateCallback(newCallback: Function): void {
        this._sizeChangedCallback = newCallback;
    }

    getSize(id: string): object {
        return this._blocksSizes.find((blockSize) => {
            return blockSize.id === id;
        });
    }

    updateBlockSize(id: string, height: number, width: number): boolean {
        let sizeChanged: boolean = false;
        const sizeEntry = this._getBlockSizeById(id);

        if (sizeEntry) {
            if (sizeEntry.height !== height || sizeEntry.width !== width) {
                sizeEntry.height = height;
                sizeEntry.width = width;
                sizeChanged = true;
            }
        } else {
            this._blocksSizes.push({ id, height, width });
        }
        return sizeChanged;
    }

    private _resizeHandler(entries: IResizeObserverEntry[]): void {
        let sizeChanged = false;
        const updateBlocks = {};
        const sizeChangedBlocks = {};
        for (const entry of entries) {
            let operation;
            const id = getStickyBlockIdFromNode(entry.target);
            const block = this._blocks.get(id);
            if (block) {
                const sizeEntry = this._getBlockSizeById(block.id);
                if (sizeEntry) {
                    operation = this._getOperationForBlocksStack(
                        entry.contentRect.height,
                        sizeEntry.height,
                        entry.contentRect.width,
                        sizeEntry.width
                    );
                }

                if (operation) {
                    updateBlocks[block.id] = {
                        operation,
                    };
                } else {
                    sizeChangedBlocks[block.id] = {
                        height: entry.contentRect.height,
                        width: entry.contentRect.width,
                    };
                }
            }

            sizeChanged =
                this.updateBlockSize(id, entry.contentRect.height, entry.contentRect.width) ||
                sizeChanged;
        }

        if (sizeChanged) {
            this._sizeChangedCallback(updateBlocks, sizeChangedBlocks);
        }
    }

    private _getBlockSizeById(id: string): IBlockSizeController {
        return this._blocksSizes.find((blockSize: IBlockSizeController) => {
            return blockSize.id === id;
        });
    }

    private _getOperationForBlocksStack(
        newHeight: number,
        oldHeight: number,
        newWidth: number,
        oldWidth: number
    ): StackOperation {
        let operation;
        if (newHeight === 0 && newWidth === 0 && (oldHeight !== 0 || oldWidth !== 0)) {
            operation = StackOperation.Remove;
        } else if ((newHeight !== 0 || newWidth !== 0) && oldHeight === 0 && oldWidth === 0) {
            operation = StackOperation.Add;
        }
        return operation;
    }
}
