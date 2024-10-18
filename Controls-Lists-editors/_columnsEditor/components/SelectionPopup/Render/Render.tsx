import { Container as ScrollContainer } from 'Controls/scroll';
import { Stack } from 'Controls/popupTemplate';
import * as React from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { SimpleMultiSelector } from 'Controls-ListEnv/operationsConnected';
import { Button } from 'Controls/buttons';
import { Context as PopupContext } from 'Controls/popup';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import rk = require('i18n!Controls-Lists-editors');
import { Content } from './Content';

/**
 * Интерфейс пропсов шаблона окна выбора
 * @private
 */
interface ISelectionRenderProps {
    /**
     * Результаты загрузки данных
     */
    loadResults: Record<string, unknown>;
    /**
     * Конфигурации фабрик данных
     */
    dataConfig: Record<string, IDataConfig>;
    /**
     * Отображать ли кнопку массовой отметки записей
     */
    showSelector?: boolean;
}

/**
 * Шаблон окна выбора в "Редакторе колонок"
 * @param {ISelectionRenderProps} props Пропсы компонента
 * @category component
 * @private
 */
export function Render(props: ISelectionRenderProps) {
    const { loadResults, dataConfig, showSelector = true } = props;
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const popupContext = React.useContext(PopupContext);
    const STORE_ID = 'columnsList';
    const onApplyButtonClick = React.useCallback(() => {
        popupContext.sendResult(selectedKeys);
        popupContext.close();
    }, [selectedKeys, popupContext]);
    return (
        <Provider loadResults={loadResults} configs={dataConfig}>
            <Stack
                headingCaption={rk('Колонки')}
                headerBackgroundStyle={'unaccented'}
                backgroundStyle={'unaccented'}
                closeButtonVisible={true}
                rightBorderVisible={false}
                headerContentTemplate={
                    <div className={'tw-flex tw-w-full tw-justify-between tw-items-center'}>
                        <SearchInput
                            storeId={STORE_ID}
                            fontColorStyle={'default'}
                            contrastBackground={true}
                            className={'ControlsListsEditors_selectionPopup_search-width'}
                        />
                        {showSelector ? <SimpleMultiSelector storeId={STORE_ID} /> : null}
                        {selectedKeys.length > 0 ? (
                            <Button
                                viewMode="filled"
                                buttonStyle="success"
                                iconSize="m"
                                icon="icon-Yes"
                                iconStyle="contrast"
                                tooltip={rk('Применить')}
                                className={'ControlsListsEditors_addFolderPopup_apply-button '}
                                data-qa={'ControlsListsEditors_addFolderPopup_apply-button'}
                                onClick={onApplyButtonClick}
                            />
                        ) : null}
                    </div>
                }
                bodyContentTemplate={
                    <div
                        className={
                            'controls__block-wrapper tr ControlsListsEditors_columnsListPopup-content_wrapper'
                        }
                    >
                        <div
                            className={
                                'controls__block ControlsListsEditors_columnsListPopup-content-padding_top'
                            }
                        >
                            <ScrollContainer>
                                <Content
                                    storeId={STORE_ID}
                                    onSelectedKeysChanged={setSelectedKeys}
                                />
                            </ScrollContainer>
                        </div>
                    </div>
                }
            />
        </Provider>
    );
}
