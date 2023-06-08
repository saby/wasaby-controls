import { useState, memo } from 'react';
import { Button } from 'Controls/buttons';
import { Stack } from 'Controls/popupTemplate';
import { Input } from 'Controls/search';
import { Container } from 'Controls/scroll';
import {
    ItemsView,
    ItemTemplate,
    GroupTemplate,
    EmptyTemplate,
    groupConstants,
} from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { IActionConfigOptions } from 'Controls/interface';
import * as rk from 'i18n!Controls';
import 'css!Controls-editors/_objectEditorPopup/ActionsEditorPopup';

interface IActionsConfigPopupProps {
    actions: IActionConfigOptions[];
    onSendResult: Function;
    onClose: Function;
}

const actionsEditorPopup = memo((props: IActionsConfigPopupProps) => {
    const [items, setItems] = useState<RecordSet>(
        new RecordSet({
            keyProperty: 'type',
            rawData: props.actions.map((action) => {
                return {
                    type: action.path[action.path.length - 1],
                    commandName: action.path[action.path.length - 1],
                    title: action.path[action.path.length - 1],
                    group: groupConstants.hiddenGroup,
                };
            }),
        })
    );
    const [search, setSearch] = useState<string>('');

    const resetSearch = () => {
        setSearch('');
    };

    const getItems = () => {
        if (search) {
            return new RecordSet({
                keyProperty: 'type',
                rawData: items.getRawData().filter((item) => {
                    return item.title.toLowerCase().includes(search.toLowerCase());
                }),
            });
        }
        return items;
    };

    const itemMouseDownHandler = (event: unknown) => {
        props.onSendResult(event);
        props.onClose();
    };

    return (
        <Stack
            closeButtonVisibility={true}
            closeButtonViewMode="toolButton"
            headerBorderVisible={false}
            rightBorderVisible={false}
            backgroundStyle="unaccented"
            headingCaption={rk('Действие')}
            headerContentTemplate={
                <div className="ws-flexbox ws-flex-end controls-margin_right-xs">
                    <Input
                        contrastBackground={true}
                        value={search}
                        onValueChanged={(value) => {
                            return setSearch(value);
                        }}
                        customEvents={['onValueChanged']}
                    />
                </div>
            }
            bodyContentTemplate={
                <Container
                    className="controls-margin_right-xs actionsConfig__popupStack-body"
                    content={() => {
                        return (
                            <div className="controls__block-wrapper tr without-shadow actionsConfig__popupStack-body">
                                <div className="controls__block">
                                    <ItemsView
                                        className="controls-margin_top-xs"
                                        items={getItems()}
                                        hiddenGroupPosition="first"
                                        onItemClick={itemMouseDownHandler}
                                        customEvents={['onItemClick']}
                                        backgroundStyle="default"
                                        groupProperty="group"
                                        itemTemplate={(itemTemplateProps) => {
                                            return (
                                                <ItemTemplate
                                                    marker={false}
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
                                        groupTemplate={(groupTemplateProps) => {
                                            return (
                                                <GroupTemplate
                                                    textAlign="left"
                                                    iconSize="xs"
                                                    {...groupTemplateProps}
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
                                                        <>
                                                            <div>
                                                                {rk('Не найдено ни одной записи')}
                                                            </div>
                                                            {search && (
                                                                <>
                                                                    <Button
                                                                        viewMode="link"
                                                                        caption={rk(
                                                                            'Сбросьте',
                                                                            'Виджет'
                                                                        )}
                                                                        onClick={resetSearch}
                                                                    />{' '}
                                                                    {rk(
                                                                        'или измените введенное значение поиска',
                                                                        'Виджет'
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }}
                />
            }
        />
    );
});
actionsEditorPopup.isReact = true;
export default actionsEditorPopup;
