import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { Stack } from 'Controls/popupTemplate';
import { Context } from 'Controls/popup';
import { Container } from 'Controls/scroll';
import {
    EmptyTemplate,
    groupConstants,
    GroupTemplate,
    ItemsView,
    ItemTemplate,
} from 'Controls/list';
import { Icon } from 'Controls/icon';
import { Button } from 'Controls/buttons';
import { ColumnLayout } from 'Hint/Template';
import { Input as SearchInput } from 'Controls/search';
import { RecordSet } from 'Types/collection';
import { hasRights } from './hasRights';
import { IActionConfig, TActionRights } from 'Controls-Actions/actions';
import { Model } from 'Types/entity';
import * as translate from 'i18n!Controls-Actions';
import 'css!Controls-Input-editors/ActionEditor/ActionEditor';

interface IActionEditorPopupProps {
    actions: IActionConfig[];
}

const EMPTY_IMAGE = {
    name: 'Common',
    type: 'wow_nothing',
    extension: 'svg',
};

const KEY_PROPERTY = 'type';

interface IActionItems {
    type: string;
    commandName: string;
    title: string;
    icon: string;
    group: string;
    rights: TActionRights;
}

function ListItemTemplateContent(props) {
    return (
        <div className="ws-flexbox ws-align-items-center">
            <Icon
                className="controls-margin_right-xs"
                icon={props.item.contents.get('icon')}
                iconSize="s"
                iconStyle="default"
            />
            <div className="ws-ellipsis">{props.item.contents.get('title')}</div>
        </div>
    );
}

function ListItemTemplate(props) {
    return (
        <ItemTemplate {...props}>
            <ListItemTemplateContent {...props} />
        </ItemTemplate>
    );
}

function ListGroupTemplate(props) {
    return (
        <GroupTemplate
            className="actionsConfig__popupStack-groupTemplate"
            textAlign="left"
            iconSize="xs"
            {...props}
        />
    );
}

export const ActionEditorPopup = memo((props: IActionEditorPopupProps) => {
    const [search, setSearch] = useState('');
    const popupContext = useContext(Context);
    const items = useMemo<RecordSet<IActionItems>>(() => {
        const data = props.actions
            .map((action) => {
                return {
                    type: action.type,
                    commandName: action.commandName,
                    title: action.info?.title,
                    icon: action.info?.icon,
                    group: action.info?.category || groupConstants.hiddenGroup,
                    rights: action.rights,
                };
            })
            .filter(({ rights }: IActionConfig) => {
                return hasRights(rights as TActionRights);
            });
        return new RecordSet({
            // FIXME: Временно завязываемся на тип, а не на команду (действие).
            //  Пока что отображаем все action'ы с преднастроенными опциями без PG
            keyProperty: KEY_PROPERTY,
            rawData: data,
        });
    }, [props.actions]);
    const searchItems = useMemo<RecordSet<IActionItems>>(() => {
        if (search) {
            return new RecordSet({
                keyProperty: KEY_PROPERTY,
                rawData: items.getRawData().filter((item: IActionItems) => {
                    return item.title.toLowerCase().includes(search.toLowerCase());
                }),
            });
        }
        return items;
    }, [items, search]);
    const itemMouseDownHandler = useCallback(
        (item: Model) => {
            if (popupContext) {
                popupContext.sendResult(item);
                popupContext.close();
            }
        },
        [popupContext]
    );
    const resetSearch = useCallback(() => {
        setSearch('');
    }, [setSearch]);

    const ListEmptyTemplate = useCallback(
        (props) => {
            return (
                <EmptyTemplate
                    {...props}
                    topSpacing="xl"
                    bottomSpacing="l"
                    contentTemplate={
                        <ColumnLayout
                            className="controls-margin_top-3xl"
                            imageSize="m"
                            message={translate('Не найдено ни одной записи')}
                            image={EMPTY_IMAGE}
                            details={
                                search && (
                                    <>
                                        <Button
                                            data-qa="controlsButton__reset"
                                            viewMode="link"
                                            caption={translate('Сбросьте', 'Виджет')}
                                            onClick={resetSearch}
                                        />{' '}
                                        {translate(
                                            'или измените введенное значение поиска',
                                            'Виджет'
                                        )}
                                    </>
                                )
                            }
                        />
                    }
                />
            );
        },
        [!search]
    );

    return (
        <Stack
            className="siteEditorBase-Decorator__popup"
            closeButtonVisibility={true}
            closeButtonViewMode="toolButton"
            headerBorderVisible={false}
            rightBorderVisible={false}
            backgroundStyle="unaccented"
            headingCaption={translate('Действие')}
            headerContentTemplate={
                <div className="ws-flexbox ws-flex-end controls-margin_right-xs">
                    <SearchInput
                        className="controls-button_actionEditorPopup_search"
                        contrastBackground={true}
                        value={search}
                        onValueChanged={setSearch}
                    />
                </div>
            }
            bodyContentTemplate={
                <Container className="controls-margin_right-xs actionsConfig__popupStack-body">
                    <div className="controls__block-wrapper tr without-shadow actionsConfig__popupStack-body">
                        <div className="controls__block">
                            <ItemsView
                                className="controls-margin_top-xs"
                                items={search ? searchItems : items}
                                hiddenGroupPosition="first"
                                onItemClick={itemMouseDownHandler}
                                backgroundStyle="default"
                                groupProperty="group"
                                itemTemplate={ListItemTemplate}
                                groupTemplate={ListGroupTemplate}
                                emptyTemplate={ListEmptyTemplate}
                            />
                        </div>
                    </div>
                </Container>
            }
        />
    );
});
