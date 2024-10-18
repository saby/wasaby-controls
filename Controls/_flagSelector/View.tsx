import * as React from 'react';
import { ItemTemplate, Selector } from 'Controls/dropdown';
import { Icon } from 'Controls/icon';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getAreaPhoneCode } from './Utils';
import { AREA_PHONE_CODES, IAreaCodeData } from 'Controls/Utils/PhoneUtils';
import 'css!Controls/flagSelector';

interface IFlagSelectorProps {
    className?: string;
    value?: string;
    size?: 's' | 'm';
    direction?: 'left' | 'right';
    onSelectedFlag?: Function;
    areaPhoneCode?: IAreaCodeData
}

interface ISearchValue {
    caption: string;
}

interface IRevertText {
    process: Function;
}

interface IIconFlagProps {
    size: 's' | 'm';
    flag: string;
    className?: string;
    onClick?: Function;
}

const IconFlag = React.memo((props: IIconFlagProps) => {
    const className =
        `Controls_PhoneFlag-flagItem Controls_PhoneFlag-flagItem_size-${props.size} ` +
        (props.flag !== 'www' ? 'Controls_PhoneFlag-flagItem-border ' : '') +
        props.className;
    if (props.flag === 'www') {
        return (
            <Icon
                icon={
                    props.flag === 'www'
                        ? 'icon-WWW'
                        : `Controls-icons/icon-flags:flag-${props.flag}`
                }
                className={className}
                iconStyle="secondary"
                iconSize={props.size}
            />
        );
    }
    return (
        <div className={className + ' Controls_PhoneFlag-flagItem_wrapper'}>
            <Icon
                icon={`Controls-icons/icon-flags:flag-${props.flag}`}
                className="Controls_PhoneFlag-flagItem-icon-rounded"
                iconStyle="secondary"
                iconSize={props.size === 's' ? 'm' : 'l'}
            />
        </div>
    );
});

export default React.forwardRef(function View(props: IFlagSelectorProps, ref) {
    const { size = 's' } = props;
    const [selectedLocale, setSelectedLocale] = React.useState<string>('');
    const [selectedLocaleData, setSelectedLocaleData] = React.useState<IAreaCodeData>(() => {
        return getAreaPhoneCode(props.value, props.areaPhoneCode);
    });
    const [revertText, setRevertText] = React.useState<IRevertText>(null);
    const [selectedItem, setSelectedItem] = React.useState<IAreaCodeData>(null);

    React.useEffect(() => {
        const selectedFlag = getAreaPhoneCode(props.value, selectedItem || props.areaPhoneCode);
        setSelectedLocaleData(selectedFlag);
        setSelectedLocale(selectedFlag.id);
        if (!props.value) {
            setSelectedItem(null);
        }
    }, [props.value]);

    const defaultItems = React.useMemo(() => {
        return new Memory({
            data: AREA_PHONE_CODES,
            keyProperty: 'id',
            filter: (model: Model<IAreaCodeData>, searchValue: ISearchValue): boolean => {
                if (searchValue?.caption) {
                    const caption = searchValue.caption.toLowerCase();
                    const fullCaption = model.get('fullCaption')?.toLowerCase?.();
                    const res =
                        (fullCaption && fullCaption.includes(caption)) ||
                        model.get('caption').toLowerCase().includes(caption);

                    if (!res && revertText) {
                        const value = fullCaption || caption;
                        return value.includes(revertText.process(caption));
                    }
                    return res;
                }
                return true;
            },
        });
    }, [revertText]);

    const selectedItemsChangedHandler = (args: string[]) => {
        const localeId = args[0];
        setSelectedLocale(localeId);
        let locale: string;
        const selected = AREA_PHONE_CODES.filter((area) => {
            if (area.id === localeId) {
                locale = area.code;
            }
            return area.id === localeId;
        })[0];
        setSelectedLocaleData(selected);
        setSelectedItem(selected);
        if (props.onSelectedFlag) {
            props.onSelectedFlag(
                new SyntheticEvent(null, {
                    type: 'selectedFlag',
                }),
                locale
            );
        }
    };

    const itemTemplate = React.useCallback(
        (templateOptions) => {
            return (
                <ItemTemplate
                    {...templateOptions}
                    marker={false}
                    contentTemplate={
                        <div className="Controls_PhoneFlag-flagRow">
                            <IconFlag
                                className="Controls_PhoneFlag-flagItem-rounded controls-margin_right-xs"
                                flag={templateOptions.item.contents.get('id')}
                                size={size}
                            />
                            <div
                                dir="auto"
                                className={`Controls_PhoneFlag-itemCaption ${
                                    templateOptions.item.isMarked()
                                        ? 'controls-fontweight-bold'
                                        : ''
                                }`}
                            >
                                {templateOptions.item.contents.get('caption')}
                            </div>
                        </div>
                    }
                />
            );
        },
        [size]
    );

    return (
        <Selector
            className={`Controls_PhoneFlag ${props.className || ''}`}
            data-qa="Controls_PhoneFlag"
            selectedKeys={[selectedLocale]}
            menuPopupOptions={{
                maxHeight: 460,
                width: 330,
                direction: {
                    horizontal: props.direction,
                },
            }}
            forwardedRef={ref}
            keyProperty="id"
            popupClassName={`Controls_PhoneFlag-pickerSpacing-${props.direction}`}
            onSelectedKeysChanged={selectedItemsChangedHandler}
            onDropDownOpen={() => {
                if (!revertText) {
                    import('Controls/Utils/keyboardLayoutRevert').then((res) => {
                        setRevertText(res.default);
                    });
                }
            }}
            customEvents={['onSelectedKeysChanged', 'onDropDownOpen']}
            displayProperty="caption"
            source={defaultItems}
            searchParam="caption"
            minSearchLength={2}
            itemTemplate={itemTemplate}
            emptyTemplate="Controls/menu:EmptyTemplate"
            contentTemplate={
                <IconFlag
                    className={'Controls_PhoneFlag-flagItem-rounded'}
                    flag={selectedLocaleData.id}
                    size={size}
                />
            }
        />
    );
});
