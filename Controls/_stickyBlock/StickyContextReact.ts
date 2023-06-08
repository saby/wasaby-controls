/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { createContext } from 'react';
import { IStickyBlockRegisterData, Mode } from 'Controls/_stickyBlock/types';
import { IStickyBlock } from 'Controls/_stickyBlock/interfaces/IStickyBlock';

export const StickyContext = createContext({
    models: undefined,
    horizontalScrollMode: undefined,
    modeChangedCallback: (id: string, mode: Mode) => {
        return 0;
    },
    offsetChangedCallback: (id: string, offset: number) => {
        return 0;
    },
    registerCallback: (block: IStickyBlockRegisterData) => {
        return 0;
    },
    unregisterCallback: (id: string) => {
        return 0;
    },
});

export const StickyGroupContext = createContext({
    scrollState: undefined,
    groupSizeChangedCallback: (id: string, operation: string) => {
        return 0;
    },
    addedBlockInGroupCallback: () => {
        return 0;
    },
    removedBlockInGroupCallback: () => {
        return 0;
    },
    modeChangedCallback: (id: string, mode: Mode) => {
        return 0;
    },
    offsetChangedCallback: (id: string, offset: number) => {
        return 0;
    },
    registerCallback: (param: {
        stickyRef: { current: HTMLElement };
        id: string;
        isGroup: boolean;
        props: IStickyBlock;
    }) => {
        return 0;
    },
    unregisterCallback: (id: string) => {
        return 0;
    },
    groupChangeFixedPositionCallback: (groupId: string, groupFixedPosition: string) => {
        return 0;
    },
});
