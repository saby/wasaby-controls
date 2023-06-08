/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { isEqual } from 'Types/object';
import isFullGridSupport from './GridSupportUtil';
import { TColumns } from 'Controls/grid';

export interface IStickyColumn {
    index: number;
    property: string;
}

export interface ILadderObject {
    ladder: TLadderElement<ILadderConfig>[];
    stickyLadder: TLadderElement<IStickyLadderConfig>[];
}

export type TLadderElement<T extends ILadderConfig> = Record<string, T>;

export interface ILadderConfig {
    ladderLength: number;
}

export interface IStickyLadderConfig extends ILadderConfig {
    headingStyle: string;
}

interface IStickyColumnsParams {
    columns: TColumns;
    stickyColumn?: object;
}

interface IPrepareLadderParams extends IStickyColumnsParams {
    ladderProperties: string[];
    startIndex: number;
    stopIndex: number;
    display: any;
    hasColumnScroll?: boolean;
}

export function isSupportLadder(ladderProperties?: string[]): boolean {
    return !!(ladderProperties && ladderProperties.length);
}

export function shouldAddStickyLadderCell(
    columns: TColumns,
    stickyColumn: object,
    draggingData: object
): boolean {
    return !!getStickyColumn({ stickyColumn, columns }) && !draggingData;
}
export function stickyLadderCellsCount(
    columns: TColumns,
    stickyColumn: object,
    isDragging: boolean
): number {
    return !isFullGridSupport() || isDragging
        ? 0
        : getStickyColumn({ stickyColumn, columns })?.property.length || 0;
}
export function prepareLadder(params: IPrepareLadderParams): ILadderObject {
    let fIdx;
    let idx;
    let item;
    let prevItem;
    const ladderProperties = params.ladderProperties;
    const stickyColumn = getStickyColumn(params);
    const supportLadder = isSupportLadder(ladderProperties);
    const supportSticky = !!stickyColumn;
    let stickyProperties = [];
    const ladder = {};
    const ladderState = {};
    const stickyLadder = {};
    const stickyLadderState = {};
    const hasColumnScroll = params.hasColumnScroll;

    let mainLadderProperty;

    if (!supportLadder && !stickyColumn) {
        return {};
    }

    function processLadder(ladderParams: object) {
        const value = ladderParams.value;
        const prevValue = ladderParams.prevValue;
        const state = ladderParams.state;
        const hasMainLadder = !!ladderParams.mainLadder?.ladderLength;

        // isEqual works with any types
        if (isEqual(value, prevValue) && !hasMainLadder) {
            state.ladderLength++;
        } else {
            ladderParams.ladder.ladderLength = state.ladderLength;
            state.ladderLength = 1;
        }
    }

    function processStickyLadder(ladderParams: object) {
        processLadder(ladderParams);
        if (ladderParams.ladder.ladderLength && isFullGridSupport()) {
            ladderParams.ladder.headingStyle =
                'grid-row: span ' + ladderParams.ladder.ladderLength;

            // Для лесенки, если включен горизонтальный скролл, нужно делать z-index больше,
            // чем у застиканных колонок. Иначе её содержимое будет находиться позади.
            if (hasColumnScroll) {
                ladderParams.ladder.headingStyle += '; z-index: 4;';
            }
        }
    }

    function getValidPrev({ display, index }: object) {
        let newIndex = index;
        let itemLocal = display.at(newIndex);
        while (
            newIndex > 0 &&
            itemLocal['[Controls/treeGrid:TreeGridNodeFooterRow]']
        ) {
            itemLocal = display.at(--newIndex);
        }
        return { index: newIndex, item: itemLocal };
    }
    function getValidCurrent({ display, index }) {
        let newIndex = index;
        let itemLocal = display.at(newIndex);
        while (
            newIndex < display.getCount() - 1 &&
            itemLocal['[Controls/treeGrid:TreeGridNodeFooterRow]']
        ) {
            itemLocal = display.at(++newIndex);
        }
        return { index: newIndex, item: itemLocal };
    }

    if (supportLadder) {
        for (fIdx = 0; fIdx < ladderProperties.length; fIdx++) {
            ladderState[ladderProperties[fIdx]] = {
                ladderLength: 1,
            };
        }
    }
    if (supportSticky) {
        stickyProperties = stickyColumn.property;
        mainLadderProperty = stickyProperties[0];
        for (fIdx = 0; fIdx < stickyProperties.length; fIdx++) {
            stickyLadderState[stickyProperties[fIdx]] = {
                ladderLength: 1,
            };
        }
    }

    // В коллекции нет события replace. Вместо него срабатывают два события: add и remove.
    // Это приводит к тому, что пересчету по еще неокончательным индексам
    const lastIndex = Math.min(
        params.stopIndex - 1,
        params.display.getCount() - 1
    );
    for (idx = lastIndex; idx >= params.startIndex; idx--) {
        const current = getValidCurrent({
            display: params.display,
            index: idx,
        });
        const dispItem = current.item;
        item = dispItem.getContents();

        const prev = getValidPrev({ display: params.display, index: idx - 1 });
        let prevDispItem = prev.index >= params.startIndex ? prev.item : null;

        // Если запись редактируется и отображается в виде редактора на всю строку,
        // то она не участвует в рассчете лесенки.
        if (
            prevDispItem &&
            prevDispItem.isEditing() &&
            !!params.display.getItemEditorTemplate()
        ) {
            prevDispItem = null;
        }
        if (
            !item ||
            (dispItem.isEditing() &&
                !!params.display.getItemEditorTemplate()) ||
            dispItem.isSticked()
        ) {
            continue;
        }

        prevItem = prevDispItem ? prevDispItem.getContents() : null;
        if (supportLadder) {
            ladder[idx] = {};
            for (fIdx = 0; fIdx < ladderProperties.length; fIdx++) {
                ladder[idx][ladderProperties[fIdx]] = {};
                processLadder({
                    itemIndex: idx,
                    value: item.get
                        ? item.get(ladderProperties[fIdx])
                        : undefined,
                    prevValue: prevItem
                        ? prevItem.get
                            ? prevItem.get(ladderProperties[fIdx])
                            : undefined
                        : NaN,
                    state: ladderState[ladderProperties[fIdx]],
                    ladder: ladder[idx][ladderProperties[fIdx]],
                    mainLadder: ladder[idx][mainLadderProperty],
                });
            }
        }

        if (supportSticky) {
            stickyLadder[idx] = {};
            for (fIdx = 0; fIdx < stickyProperties.length; fIdx++) {
                stickyLadder[idx][stickyProperties[fIdx]] = {};
                processStickyLadder({
                    itemIndex: idx,
                    value: item.get
                        ? item.get(stickyProperties[fIdx])
                        : undefined,
                    prevValue: prevItem
                        ? prevItem.get
                            ? prevItem.get(stickyProperties[fIdx])
                            : undefined
                        : NaN,
                    state: stickyLadderState[stickyProperties[fIdx]],
                    ladder: stickyLadder[idx][stickyProperties[fIdx]],
                    mainLadder: stickyLadder[idx][mainLadderProperty],
                });
            }
        }
    }
    return {
        ladder,
        stickyLadder,
    };
}

export function getStickyColumn(params: IStickyColumnsParams): IStickyColumn {
    let result;
    if (params.stickyColumn) {
        result = {
            index: params.stickyColumn.index,
            property: params.stickyColumn.property,
        };
    } else if (params.columns) {
        for (let idx = 0; idx < params.columns.length; idx++) {
            if (params.columns[idx].stickyProperty) {
                result = {
                    index: idx,
                    property: params.columns[idx].stickyProperty,
                };
                break;
            }
        }
    }
    if (result && !(result.property instanceof Array)) {
        result.property = [result.property];
    }
    return result;
}
