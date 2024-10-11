import { View as Explorer } from 'Controls/explorer';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { useCallback } from 'react';
import { TDataModel } from 'Hint/interface';
import { EmptyView, HelpPerson } from 'Hint/Template';
import rk = require('i18n!Controls-Lists-editors');
import * as React from 'react';
import Column from 'Controls-Lists-editors/_columnsEditor/components/SelectionPopup/Column';

/**
 * Пропсы контента окна выбора
 * @private
 */
interface IContentRenderProps {
    /**
     * id слайса списка
     */
    storeId: string;
    /**
     * Колбэк-функция, вызываемая при изменении выбранных записей
     * @param {string[]} keys ключи выбранных записей
     */
    onSelectedKeysChanged: (keys: string[]) => void;
}

/**
 * Контент, размещаемый в шаблоне окна выбора колонок
 * @category component
 * @param {IContentRenderProps} props Пропсы компонента
 * @private
 */
export function Content(props: IContentRenderProps) {
    const { storeId, onSelectedKeysChanged } = props;
    const columns = React.useRef([{ displayProperty: 'title', reactContentTemplate: Column }]);
    const slice = useSlice<ListSlice>(storeId);
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
        [resetSearch]
    );

    return (
        <Explorer
            storeId={storeId}
            columns={columns.current}
            groupProperty={'status'}
            onSelectedKeysChanged={onSelectedKeysChanged}
            emptyTemplate={emptyTemplate}
        />
    );
}
