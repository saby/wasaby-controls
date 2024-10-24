import { memo, useState } from 'react';
import { Dialog } from 'Controls/popupTemplate';
import { Input } from 'Controls/search';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import 'css!Controls-editors/_properties/IconEditor/IconEditorPopup';
import * as data from 'json!Controls-editors/_properties/IconEditor/resources/icons';
import * as rk from 'i18n!Controls-editors';

interface IIcon {
    name: string;
    icon: string;
    keywords: string;
}

interface IIconTemplateOptions {
    list: IIcon[];
}

interface IIconPopupProps {
    onSendResult?: Function;
}

function find(searchValue: string, list: IIcon[]): IIcon[] {
    const newSearchValue = searchValue.trim().toLowerCase();

    if (newSearchValue) {
        return list.filter((item) => {
            return item.keywords.indexOf(newSearchValue) !== -1;
        });
    }

    return [];
}

export default memo(function IconPopup(props: IIconPopupProps) {
    const [searchValue, setSearchValue] = useState<string>('');
    const [items, setItems] = useState<Memory>(
        new Memory({
            keyProperty: 'icon',
            data,
        })
    );
    const [searchedItems, setSearchedItems] = useState<IIcon[]>([]);

    const searchChanged = (value) => {
        setSearchValue(value);
        setSearchedItems(find(value, items.data));
    };

    const itemClickHandler = (item: IIcon) => {
        if (props.onSendResult) {
            props.onSendResult(item);
        }
    };

    const iconTemplate = ({ list }: IIconTemplateOptions) => {
        return (
            <div className="controls-margin_bottom-m ws-flexbox ws-flex-wrap">
                {list.map((item) => {
                    return (
                        <span
                            onClick={itemClickHandler.bind(this, item)}
                            className="iconPopup-widget__item ws-flexbox ws-justify-content-center"
                            key={item.name}
                        >
                            {item.name !== 'empty' ? (
                                <i
                                    className={
                                        'ws-align-self-center controls-icon controls-icon_size-m' +
                                        ` controls-icon_style-secondary ${item.name}`
                                    }
                                />
                            ) : (
                                <i className="iconPopup-widget__empty-item" />
                            )}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <Dialog
            closeButtonVisible={true}
            closeButtonViewMode="linkButton"
            className="iconPopup-widget_popup__panel"
            bodyContentTemplate={
                <div className="iconPopup-widget_popup__wrapper ws-flexbox ws-flex-column">
                    <div className="iconPopup-widget_popup__header ws-flexbox ws-align-items-center ws-justify-content-end">
                        <div className="iconPopup-widget_popup__inputContainer">
                            <Input
                                placeholder={rk('Найти')}
                                name="search"
                                inlineHeight="default"
                                value={searchValue}
                                ws-autofocus={true}
                                contrastBackground={true}
                                onValueChanged={searchChanged}
                                customEvents={['onValueChanged']}
                                className="iconPopup-widget_popup__input"
                            />
                        </div>
                    </div>
                    <div className="iconPopup-widget_popup__container">
                        <Container
                            backgroundStyle="unaccented"
                            className="iconPopup-widget__Icon__List"
                            content={
                                <div className="iconPopup-widget__Icon__ListContainer">
                                    <div className="iconPopup-widget__Icon__container">
                                        {!searchValue.length ? (
                                            iconTemplate({ list: items.data })
                                        ) : searchedItems.length ? (
                                            iconTemplate({
                                                list: searchedItems,
                                            })
                                        ) : (
                                            <div className="controls-margin_left-xs controls-fontsize-m controls-text-readonly">
                                                {rk('Ничего не найдено')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            }
        />
    );
});
