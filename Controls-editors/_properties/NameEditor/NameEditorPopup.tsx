import * as rk from 'i18n!Controls';
import { memo, forwardRef, useEffect, useCallback } from 'react';
import { Model } from 'Types/entity';
import { Stack } from 'Controls/popupTemplate';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { DataMapTree } from './DataMapTree';
import { DataMapTreeEmptyTemplate as EmptyTemplate } from './DataMapTreeEmptyTemplate';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { IFieldListState } from './dataFactory/FieldsListFactory';
import { POPUP_FIELD_LIST_SLICE } from './dataFactory/constants';

interface ILookupEditorPopup {
    sendResultCallback: Function;
    dataContext: Record<string, Slice<unknown>>;
    handlers?: {
        onSelectComplete: Function;
    };
}
const CUSTOM_EVENTS = ['onItemClick'];

const NameEditorPopup = memo((props: ILookupEditorPopup) => {
    const { sendResultCallback, dataContext } = props;
    const slice = dataContext?.[POPUP_FIELD_LIST_SLICE] as Slice<IFieldListState>;
    const isSearch = useCallback(() => !!slice?.state.searchValue, [slice?.state]);
    const resetSearch = useCallback(() => {
        slice?.resetSearch();
    }, [slice]);

    const emptyTemplate = useCallback(
        (emptyTemplateProps) => {
            return (
                <EmptyTemplate
                    {...emptyTemplateProps}
                    resetSearchCallback={resetSearch}
                    isSearchedCallback={isSearch}
                />
            );
        },
        [resetSearch, isSearch]
    );

    const onItemClick = (item: Model, event, result) => {
        // TODO: будет зависеть от типа поля (list - для автотаблицы)
        if (!['value', 'list'].includes(item.get('View'))) {
            return;
        }

        sendResultCallback({
            id: item.get('Id'),
            data: item.get('Data'),
            parent: item.get('Parent'),
        });
        props.handlers.onSelectComplete(event, result);
    };

    useEffect(() => {
        if (isSearch() && slice?.state.fields.length) {
            if (!slice.state.expandedItems || !slice.state.expandedItems.length) {
                slice.setState({
                    expandedItems: slice.state.fields
                        .filter((field) => field.Parent_)
                        .map((field) => field.Id),
                });
            }
        }
    }, [slice, slice?.state, isSearch]);

    return (
        <DataContext.Provider value={dataContext}>
            <Stack
                storeId={dataContext ? POPUP_FIELD_LIST_SLICE : undefined}
                closeButtonVisibility={true}
                onItemClick={onItemClick}
                customEvents={CUSTOM_EVENTS}
                closeButtonViewMode="toolButton"
                headerBorderVisible={true}
                rightBorderVisible={true}
                backgroundStyle="unaccented"
                headingCaption={rk('Данные')}
                headerContentTemplate={StackHeaderSearch}
                bodyContentTemplate={DataMapTree}
                emptyTemplate={emptyTemplate}
            />
        </DataContext.Provider>
    );
});

const emptyHandler = () => {};

const StackHeaderSearch = forwardRef<HTMLDivElement, { storeId?: string }>((props, ref) => {
    return (
        <div ref={ref} className="controls-DataMapTree__search">
            <SearchInput
                storeId={props.storeId}
                contrastBackground={true}
                onResetClick={emptyHandler}
                onInputCompleted={emptyHandler}
            />
        </div>
    );
});

NameEditorPopup.isReact = true;
export default NameEditorPopup;
