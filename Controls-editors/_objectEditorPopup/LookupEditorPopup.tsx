import * as rk from 'i18n!Controls';
import { memo } from 'react';
import { getArgs } from 'UICore/Events';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Browser, IBrowserOptions as IBrowserProps } from 'Controls/browser';
import { Stack } from 'Controls/popupTemplate';
import {
    Controller,
    ListContainer as LookupListContainer,
    Container as LookupContainer,
    ILookupPopupControllerOptions,
} from 'Controls/lookupPopup';
import { View as ItemsView, ItemTemplate } from 'Controls/tree';
import {
    EmptyTemplate,
    Container as ListContainer,
    DataContainer,
    IDataOptions as IDataContainerProps,
} from 'Controls/list';

interface ILookupEditorPopup {
    source: Memory;
    selectedItems: RecordSet;
    selectedKeys: number[];
    sendResultCallback: Function;
    selectedKeysChangedCallback: Function;
}

const LookupEditorPopup = memo((props: ILookupEditorPopup) => {
    const { source, selectedKeysChangedCallback, sendResultCallback } = props;
    const parentProperty = 'parent';
    const nodeProperty = 'parent@';
    const keyProperty = 'id';
    const selectionType = 'leaf';

    const selectedKeysChanged = (event: unknown) => {
        const [e, keys] = getArgs(event);
        selectedKeysChangedCallback(keys);
    };

    const sendResult = (event: unknown) => {
        const [e, item] = getArgs(event);
        const result = item?.at(0);
        if (result) {
            sendResultCallback({
                id: result.get('id'),
                title: result.get('title'),
            });
        }
    };

    // eslint-disable-next-line react/no-unstable-nested-components
    function ControllerTemplate() {
        return <Controller {...props} content={DataContainerTemplate} />;
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function DataContainerTemplate(props: ILookupPopupControllerOptions) {
        return (
            <DataContainer
                {...props}
                source={source}
                parentProperty={parentProperty}
                nodeProperty={nodeProperty}
                keyProperty={keyProperty}
                content={LookupContainerTemplate}
            />
        );
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function LookupContainerTemplate(props: IDataContainerProps) {
        return (
            <LookupContainer
                {...props}
                selectionType={selectionType}
                content={BrowserTemplate}
            />
        );
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function BrowserTemplate(props: { [x: string]: unknown }) {
        return <Browser {...props} content={LookupListContainerTemplate} />;
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function LookupListContainerTemplate(props: IBrowserProps) {
        return (
            <LookupListContainer
                {...props}
                selectionType={selectionType}
                content={ListContainerTemplate}
            />
        );
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function ListContainerTemplate(props: { [x: string]: unknown }) {
        return <ListContainer {...props} content={ItemsViewTemplate} />;
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    function ItemsViewTemplate(props: { [x: string]: unknown }) {
        return (
            <ItemsView
                {...props}
                className="controls-margin_top-xs"
                backgroundStyle="default"
                multiSelectVisibility={'hidden'}
                itemTemplate={(itemTemplateProps) => {
                    return (
                        <ItemTemplate
                            {...itemTemplateProps}
                            contentTemplate={(contentTemplateProps) => {
                                return (
                                    <div
                                        {...contentTemplateProps}
                                        className="ws-flexbox ws-align-items-center"
                                    >
                                        <div className="ws-ellipsis">
                                            {contentTemplateProps.item.contents.get(
                                                'title'
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    );
                }}
                emptyTemplate={(emptyTemplateProps) => {
                    return (
                        <EmptyTemplate
                            {...emptyTemplateProps}
                            topSpacing="xl"
                            bottomSpacing="l"
                            contentTemplate={
                                <div>{rk('Не найдено ни одной записи')}</div>
                            }
                        />
                    );
                }}
            />
        );
    }

    return (
        <Stack
            closeButtonVisibility={true}
            onSelectedKeysChanged={selectedKeysChanged}
            onSendResult={sendResult}
            customEvents={['onSendResult', 'onSelectedKeysChanged']}
            closeButtonViewMode="toolButton"
            headerBorderVisible={true}
            rightBorderVisible={true}
            backgroundStyle="unaccented"
            headingCaption={rk('Данные')}
            bodyContentTemplate={ControllerTemplate}
        />
    );
});

LookupEditorPopup.isReact = true;
export default LookupEditorPopup;
