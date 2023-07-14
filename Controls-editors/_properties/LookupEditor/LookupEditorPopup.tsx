import * as rk from 'i18n!Controls';
import { memo, useMemo } from 'react';
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

function ControllerTemplate(props: { source: Memory }) {
    const { source } = props;
    const DataContainerTemplate = useMemo(() => {
        return function (dataProps: ILookupPopupControllerOptions) {
            return (
                <DataContainer
                    {...dataProps}
                    source={source}
                    expanderVisibility="hasChildren"
                    hasChildrenProperty="Parent_"
                    parentProperty="Parent"
                    nodeProperty="Parent_"
                    keyProperty="Id"
                    content={LookupContainerTemplate}
                />
            );
        };
    }, []);
    return <Controller {...props} content={DataContainerTemplate} />;
}

function LookupContainerTemplate(props: IDataContainerProps) {
    return <LookupContainer {...props} selectionType={'leaf'} content={BrowserTemplate} />;
}

function BrowserTemplate(props: { [x: string]: unknown }) {
    return <Browser {...props} content={LookupListContainerTemplate} />;
}

function LookupListContainerTemplate(props: IBrowserProps) {
    return (
        <LookupListContainer {...props} selectionType={'leaf'} content={ListContainerTemplate} />
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
                                    style={{ userSelect: 'none' }}
                                >
                                    <div className="ws-ellipsis">
                                        {contentTemplateProps.item.contents.get('DisplayName')}
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

const LookupEditorPopup = memo((props: ILookupEditorPopup) => {
    const { source, selectedKeysChangedCallback, sendResultCallback } = props;

    const selectedKeysChanged = (keys) => {
        if (selectedKeysChangedCallback) {
            selectedKeysChangedCallback(keys);
        }
    };

    const sendResult = (item: unknown) => {
        const result = item?.at(0);
        if (result && sendResultCallback) {
            sendResultCallback({
                Id: result.get('Id'),
                Title: result.get('Title'),
            });
        }
    };

    return (
        <Stack
            source={source}
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
