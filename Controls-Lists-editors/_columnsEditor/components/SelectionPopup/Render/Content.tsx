import { View as Explorer } from 'Controls/explorer';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { useCallback, useMemo } from 'react';
import { TDataModel } from 'Hint/interface';
import { EmptyView, HelpPerson } from 'Hint/Template';
import rk = require('i18n!Controls-Lists-editors');
import { Dispatch, SetStateAction } from 'react';

interface IRenderContentProps {
    storeId: string;
    setSelectedKeys: Dispatch<SetStateAction<never[]>>;
    current: Object;
}

export function Content(props: IRenderContentProps) {
    const slice = useSlice<ListSlice>(props.storeId);
    const isSearch = useMemo(() => !!slice?.state.searchValue, [slice?.state]);
    const resetSearch = useCallback(() => {
        slice?.resetSearch();
    }, [slice]);
    const contentDataModel: TDataModel = [
        {
            type: 'paragraph',
            data: {
                content: [
                    { type: 'link', data: { value: rk('Сбросьте'), id: 'reset' } },
                    {
                        type: 'text',
                        data: { value: ' ' + rk('или измените введенное значение поиска') },
                    },
                ],
            },
        },
    ];

    const emptyTemplate = useCallback(
        (emptyTemplateProps) => {
            return (
                <EmptyView
                    {...emptyTemplateProps}
                    layout="column"
                    size="l"
                    alignment={{ horizontal: 'center', vertical: 'top' }}
                    offset={{ top: 'l' }}
                    imageSize="m"
                    title={rk('Не найдено колонок')}
                    image={HelpPerson.common.wowNothing}
                    content={contentDataModel}
                    clickHandlers={{ reset: { handler: resetSearch } }}
                />
            );
        },
        [resetSearch, isSearch]
    );

    return (
        <Explorer
            storeId={props.storeId}
            columns={props.current}
            groupProperty={'status'}
            onSelectedKeysChanged={(keys) => {
                props.setSelectedKeys(keys);
            }}
            emptyTemplate={emptyTemplate}
        />
    );
}
