import { Container as ScrollContainer } from 'Controls/scroll';
import { Stack } from 'Controls/popupTemplate';
import * as React from 'react';
import { Provider } from 'Controls-DataEnv/context';
import { SimpleMultiSelector } from 'Controls-ListEnv/operationsConnected';
import { Button } from 'Controls/buttons';
import { Context as PopupContext } from 'Controls/popup';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { View as Explorer } from 'Controls/explorer';
import Column from 'Controls-Lists-editors/_columnsEditor/components/SelectionPopup/Column';
import rk = require('i18n!Controls-Lists-editors');

export function Render(props) {
    const { loadResults, dataConfig, showSelector = true } = props;
    const columns = React.useRef([{ displayProperty: 'title', reactContentTemplate: Column }]);
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const popupContext = React.useContext(PopupContext);
    const STORE_ID = 'columnsList';
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
                                onClick={() => {
                                    popupContext.sendResult(selectedKeys);
                                    popupContext.close();
                                }}
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
                                <Explorer
                                    storeId={STORE_ID}
                                    columns={columns.current}
                                    groupProperty={'status'}
                                    onSelectedKeysChanged={(keys) => {
                                        setSelectedKeys(keys);
                                    }}
                                />
                            </ScrollContainer>
                        </div>
                    </div>
                }
            />
        </Provider>
    );
}
