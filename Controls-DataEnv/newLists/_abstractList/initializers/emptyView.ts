import resolveValue from './utils/resolveValue';
import { isValidEmptyView as isValidEmptyViewBase } from '../validators/emptyView';

import type { IEmptyViewConfig } from 'Controls/gridRender';
import type { TemplateFunction } from 'UI/Base';
import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { IEmptyViewState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import type { RecordSet } from 'Types/collection';

export default function initState(
    _initializer: Initializer,
    _loadResult: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): IEmptyViewState {
    const isValidEmptyView = (o: unknown): o is IEmptyViewConfig[] | TemplateFunction =>
        isValidEmptyViewBase(o, config.collectionType);
    return {
        emptyView: resolveValue(config.emptyView, isValidEmptyView),
        emptyViewConfig: config.emptyViewConfig,
    };
}

export function needShowEmptyView(items?: RecordSet): boolean {
    return !!items && items.getCount() === 0;
}
