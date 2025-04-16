import type { ICollectionOptions } from 'Controls/display';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import extract from './extract';

const _KNOWN_OPTIONS: (keyof IAbstractListState)[] = [
    'items',
    'sorting',
    'filter',
    'displayProperty',
    'selectedKeys',
    'selectionModel',
    'excludedKeys',
    'keyProperty',
    'markerVisibility',
    'multiSelectVisibility',
    'markedKey',
    'rowSeparatorSize',
    'rowSeparatorVisibility',
    'itemActionsMap',
    'itemPadding',
    'roundBorder',
    'searchValue',
    'isLatestInteractorVersion',
];

// TODO: (keyof IAbstractListState)[]
const OPTIONS = [
    ..._KNOWN_OPTIONS,
    'source',
    'navigation',
    'sourceController',
    'activeElement',
    'selectionCountMode',
    'recursiveSelection',
    'isThinInteractor',
    'ladderProperties',
    'order',
    'groupProperty',
];

export default function (state: IAbstractListState): ICollectionOptions {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...extract(state, OPTIONS),
        // В типе items могут быт undefined.
        // С коллекциями в целом неверно выведен тип, мы берем его с состояния слайса.
        // А должен быть отдельно интерфейс опций коллекции, отдельно состояние слайса.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        collection: state.items,
        emptyTemplate: state.emptyView,
        emptyTemplateOptions: state.emptyViewConfig,
    };
}
