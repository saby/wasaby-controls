import * as React from 'react';
import { Misspell } from 'Controls/search';
import { useSlice } from 'Controls-DataEnv/context';
import { Logger } from 'UI/Utils';
import { ListSlice } from 'Controls/dataFactory';

interface IMisspellProps {
    storeId: string;
}

/**
 * Контрол, отображающий подсказку, если поиск был произведён в неправильной раскладке.
 * Подробнее о настройке поиска со сменой раскладки читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/change-layout/ в статье}.
 *
 * @remark
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по настройке поиска на странице}
 * @class Controls-ListEnv/searchConnected:Misspell
 * @extends Controls/search:Misspell
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/Search/Misspell/Index
 */
function SearchConnectedMisspell(props: IMisspellProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const slice = useSlice(props.storeId) as ListSlice;

    React.useEffect(() => {
        if (props.storeId && slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }, []);

    const caption = slice.state.searchMisspellValue;
    const searchInputValue = slice.state.searchInputValue;

    const clickHandler = React.useCallback(() => {
        slice.setState({
            searchValue: caption,
            searchInputValue: caption,
        });
    }, [slice, caption]);

    if (caption && caption !== searchInputValue) {
        return (
            <Misspell
                className={props.className}
                caption={
                    <span onClick={clickHandler} title={caption}>
                        {caption}
                    </span>
                }
            ></Misspell>
        );
    }
    return <div ref={ref}></div>;
}

export default React.forwardRef(SearchConnectedMisspell);
