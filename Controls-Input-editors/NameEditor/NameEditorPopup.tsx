import * as rk from 'i18n!Controls';
import { memo, forwardRef, useEffect, useCallback, useMemo } from 'react';
import { Model } from 'Types/entity';
import { Stack } from 'Controls/popupTemplate';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { DataMapTree } from './DataMapTree';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { ListSlice } from 'Controls/dataFactory';
import { EmptyTemplate } from 'Controls/grid';
import { Button } from 'Controls/buttons';

interface ILookupEditorPopup {
    sendResultCallback: Function;
    dataContext: Record<string, Slice<unknown>>;
    handlers?: {
        onSelectComplete: Function;
    };
}

const STORE_ID = 'dataMapPageEditorPopup';
const CUSTOM_EVENTS = ['onItemClick'];

const NameEditorPopup = memo((props: ILookupEditorPopup) => {
    const { sendResultCallback, dataContext } = props;
    const slice = dataContext?.[STORE_ID] as ListSlice;

    const isSearch = useMemo(() => !!slice?.state.searchValue, [slice?.state]);
    const resetSearch = useCallback(() => {
        slice?.resetSearch();
    }, [slice]);

    const emptyTemplate = useCallback(
        (emptyTemplateProps) => {
            return (
                <EmptyTemplate
                    {...emptyTemplateProps}
                    topSpacing="xl"
                    bottomSpacing="l"
                    contentTemplate={
                        <>
                            <div>{rk('Не найдено ни одной записи')}</div>
                            {isSearch && (
                                <>
                                    <Button
                                        viewMode="link"
                                        caption={rk('Сбросьте', 'Виджет')}
                                        onClick={resetSearch}
                                    />{' '}
                                    {rk('или измените введенное значение поиска', 'Виджет')}
                                </>
                            )}
                        </>
                    }
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
            title: item.get('Title'),
            parent: item.get('Parent'),
        });
        props.handlers.onSelectComplete(event, result);
    };

    useEffect(() => {
        if (isSearch && slice?.state.data.getCount()) {
            if (!slice.state.expandedItems || !slice.state.expandedItems.length) {
                slice.setState({
                    expandedItems: slice.state.data
                        .getRawData()
                        .filter((field) => field.Parent_)
                        .map((field) => field.Id),
                });
            }
        }
    }, [slice, slice?.state, isSearch]);

    return (
        <DataContext.Provider value={dataContext}>
            <Stack
                storeId={dataContext ? STORE_ID : undefined}
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
