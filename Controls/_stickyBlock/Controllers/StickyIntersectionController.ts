/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { FixedPosition, IStickyBlockData } from 'Controls/_stickyBlock/types';
import { getStickyBlockIdFromNode } from 'Controls/_stickyBlock/Controllers/helpers/functions';
import BlocksCollection from 'Controls/_stickyBlock/BlocksCollection';
import ScrollState from 'Controls/_scroll/Utils/ScrollState';

export class StickyIntersectionController {
    readonly _blocks: BlocksCollection;

    private _scrollState: ScrollState;
    private _intersectionObserver: IntersectionObserver;
    private _fixedPositionChangeCallback: Function;

    constructor(
        blocks: BlocksCollection,
        scrollState: ScrollState,
        fixedPositionChangeCallback: Function
    ) {
        this._blocks = blocks;
        this._scrollState = scrollState;
        this._fixedPositionChangeCallback = fixedPositionChangeCallback;
    }

    init(scrollContainer: HTMLElement): void {
        if (this._intersectionObserver) {
            return;
        }

        this._intersectionObserver = new IntersectionObserver(
            this._observeHandler.bind(this),
            {
                root: scrollContainer,
            }
        );
    }

    updateScrollState(scrollState: ScrollState): void {
        this._scrollState = scrollState;
    }

    observe(block: IStickyBlockData): void {
        // Вешаем дата-аттрибут здесь, т.к. если повесить его в самом контроле, то будем иметь ошибку гидрации из-за
        // того, что все модули на сервере кэшируется, в том числе id, а на клиенте нет.
        block.observers.observerTop.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerTop2.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerTop2Right.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerBottomLeft.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerBottomRight.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerLeft.current.setAttribute(
            'data-stickyblockid',
            block.id
        );
        block.observers.observerRight.current.setAttribute(
            'data-stickyblockid',
            block.id
        );

        this._intersectionObserver.observe(block.observers.observerTop.current);
        this._intersectionObserver.observe(
            block.observers.observerTop2.current
        );
        this._intersectionObserver.observe(
            block.observers.observerTop2Right.current
        );
        this._intersectionObserver.observe(
            block.observers.observerBottomLeft.current
        );
        this._intersectionObserver.observe(
            block.observers.observerBottomRight.current
        );
        this._intersectionObserver.observe(
            block.observers.observerLeft.current
        );
        this._intersectionObserver.observe(
            block.observers.observerRight.current
        );
    }

    unobserve(id: string): void {
        const block = this._blocks.get(id);

        if (
            !block.observers.observerTop.current ||
            !this._intersectionObserver
        ) {
            return;
        }

        this._intersectionObserver.unobserve(
            block.observers.observerTop.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerTop2.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerTop2Right.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerBottomLeft.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerBottomRight.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerLeft.current
        );
        this._intersectionObserver.unobserve(
            block.observers.observerRight.current
        );
    }

    updateCallback(newCallback: Function): void {
        this._fixedPositionChangeCallback = newCallback;
    }

    destroy(): void {
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
            this._intersectionObserver = null;
        }
    }

    private _observeHandler(entries: IntersectionObserverEntry[]): void {
        const updatedBlocks = [];
        const blocks = {};
        // Собираем для каждого стики блока entries.
        entries.forEach((entry) => {
            const id = getStickyBlockIdFromNode(entry.target);
            if (blocks[id]) {
                blocks[id].entries.push(entry);
            } else {
                blocks[id] = {
                    entries: [entry],
                };
            }
        });

        for (const id in blocks) {
            if (blocks.hasOwnProperty(id)) {
                const block = this._blocks.get(id);
                if (!block) {
                    continue;
                }

                const fixedPosition = block.model.fixedPosition;
                block.model.update(blocks[id].entries);
                if (fixedPosition === block.model.fixedPosition) {
                    continue;
                }
                block.fixedPosition = block.model.fixedPosition;

                // Не отклеиваем заголовки, если scrollTop отрицательный.
                if (
                    this._scrollState?.scrollTop < 0 &&
                    block.model.fixedPosition === FixedPosition.None
                ) {
                    block.model.fixedPosition = fixedPosition;
                    block.fixedPosition = fixedPosition;
                    continue;
                }

                updatedBlocks.push({
                    id,
                    fixedPosition: block.model.fixedPosition,
                    prevFixedPosition: fixedPosition,
                });
            }
        }
        if (updatedBlocks.length) {
            this._fixedPositionChangeCallback(updatedBlocks, this._scrollState);
        }
    }
}
