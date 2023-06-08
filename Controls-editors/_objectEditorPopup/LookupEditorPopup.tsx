import * as rk from 'i18n!Controls';
import { memo } from 'react';
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

    const selectedKeysChanged = (keys) => {
        selectedKeysChangedCallback(keys);
    };

    const sendResult = (item: unknown) => {
        const result = item?.at(0);
        if (result) {
            sendResultCallback({
                id: result.get('id'),
                title: result.get('title'),
            });
        }
    };

    function ControllerTemplate() {
        return <Controller {...props} content={DataContainerTemplate} />;
    }

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

    function LookupContainerTemplate(props: IDataContainerProps) {
        return (
            <LookupContainer {...props} selectionType={selectionType} content={BrowserTemplate} />
        );
    }

    function BrowserTemplate(props: { [x: string]: unknown }) {
        return <Browser {...props} content={LookupListContainerTemplate} />;
    }

    function LookupListContainerTemplate(props: IBrowserProps) {
        return (
            <LookupListContainer
                {...props}
                selectionType={selectionType}
                content={ListContainerTemplate}
            />
        );
    }

    function ListContainerTemplate(props: { [x: string]: unknown }) {
        return <ListContainer {...props} content={ItemsViewTemplate} />;
    }

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
                                            {contentTemplateProps.item.contents.get('title')}
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
                            contentTemplate={<div>{rk('Не найдено ни одной записи')}</div>}
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
