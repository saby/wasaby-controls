import { Fragment, memo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { RecordSet } from 'Types/collection';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { Control as TumblerControl } from 'Controls/Tumbler';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Button } from 'Emotions/picker';
import * as rk from 'i18n!Controls-editors';

type TCaptionPosition = 'start' | 'end';

interface IIconEditorValue {
    uri: string;
    icon: string;
    captionPosition: TCaptionPosition;
}

interface IIconEditorProps extends IPropertyEditorProps<IIconEditorValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IIconEditorValue;
    placeholder?: string;
}

const variants = new RecordSet({
    rawData: [
        {
            caption: rk('Слева'),
            id: 'end',
        },
        {
            caption: rk('Справа'),
            id: 'start',
        },
    ],
});

const TARGET_POINT = {
    vertical: 'bottom',
    horizontal: 'left',
};

const DIRECTION = {
    vertical: 'bottom',
    horizontal: 'right',
};

const OFFSET = {
    vertical: 0,
    horizontal: -16,
}


const DEFAULT_ICON = 'icon-Close';

const IconTemplate = (<svg width="18"
                           height="18"
                           viewBox="0 0 18 18"
                           fill="none"
                           className="tw-self-center"
                           xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd"
          clipRule="evenodd"
          d="M16.6502 7.09752C16.8019 7.71354 16.8824 8.3576 16.8824 9.02047C16.8824 13.4458 13.2952 17.033 8.8699 17.033C4.44461 17.033 0.857422 13.4458 0.857422 9.02047C0.857422 4.59518 4.44461 1.008 8.8699 1.008C9.53276 1.008 10.1768 1.08848 10.7928 1.24021"
          stroke="#8991A9"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path fillRule="evenodd"
          clipRule="evenodd"
          d="M12.475 11.0237C12.475 11.0237 11.2731 12.6262 8.86935 12.6262C6.46561 12.6262 5.26374 11.0237 5.26374 11.0237"
          stroke="#8991A9"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path fillRule="evenodd"
          clipRule="evenodd"
          d="M11.6734 6.61686C11.5672 6.61686 11.4653 6.57465 11.3901 6.49952C11.315 6.42439 11.2728 6.32249 11.2728 6.21624C11.2728 6.10998 11.315 6.00808 11.3901 5.93295C11.4653 5.85782 11.5672 5.81561 11.6734 5.81561C11.7797 5.81561 11.8816 5.85782 11.9567 5.93295C12.0318 6.00808 12.074 6.10998 12.074 6.21624C12.074 6.32249 12.0318 6.42439 11.9567 6.49952C11.8816 6.57465 11.7797 6.61686 11.6734 6.61686ZM6.06469 6.61686C5.95843 6.61686 5.85653 6.57465 5.7814 6.49952C5.70627 6.42439 5.66406 6.32249 5.66406 6.21624C5.66406 6.10998 5.70627 6.00808 5.7814 5.93295C5.85653 5.85782 5.95843 5.81561 6.06469 5.81561C6.17094 5.81561 6.27284 5.85782 6.34797 5.93295C6.4231 6.00808 6.46531 6.10998 6.46531 6.21624C6.46531 6.32249 6.4231 6.42439 6.34797 6.49952C6.27284 6.57465 6.17094 6.61686 6.06469 6.61686Z"
          fill="#8991A9"
          stroke="#8991A9"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <rect x="14.6387"
          y="0.366943"
          width="0.961497"
          height="4.80749"
          rx="0.480749"
          fill="#8991A9"/>
    <rect x="17.5234"
          y="2.28998"
          width="0.961497"
          height="4.80749"
          rx="0.480749"
          transform="rotate(90 17.5234 2.28998)"
          fill="#8991A9"/>
</svg>);

/**
 * Реакт компонент, редактор иконки
 * @class Controls-editors/_properties/IconEditor
 * @public
 */
export const IconEditor = memo((props: IIconEditorProps) => {
    const {onChange, LayoutComponent = Fragment} = props;

    const previewerTarget = useRef<PreviewerTarget>();
    const propsRef = useRef(props);
    propsRef.current = props;

    const onChangeHandler = (iconPosition: TCaptionPosition) => {
        const res: IIconEditorValue = {...propsRef.current.value};
        res.captionPosition = iconPosition;
        onChange(res);
    };

    const chooseHandler = (icon) => {
        const res: IIconEditorValue = {...propsRef.current.value};
        if (icon.item.name !== 'empty') {
            res.uri = icon.item.name;
        } else {
            res.uri = '';
        }
        onChange(res);
        previewerTarget.current?.close();
    };

    const getIcon = () => {
        return propsRef.current.value.uri || DEFAULT_ICON;
    };

    const getIconStyle = () => {
        return propsRef.current.value.uri ? 'secondary' : 'unaccented';
    };

    const getCaptionPosition = () => {
        return propsRef.current.value.captionPosition || 'end';
    };

    const categories = [
        {
            id: 'icons',
            icon: propsRef.current.value.uri,
            title: rk('Выбор иконки'),
            template: 'Emotions/dialog:Icon',
        },
    ];

    const iconProps: { iconTemplate?: JSX.Element, icon?: string } = {};
    const icon = getIcon();
    if (icon === DEFAULT_ICON) {
        iconProps.iconTemplate = IconTemplate;
        iconProps.icon = 'empty';
    } else {
        iconProps.icon = icon;
    }

    return (
        <LayoutComponent>
            <div
                className="tw-flex tw-items-baseline"
                style={{gap: '10px'}}
                data-qa="controls-PropertyGrid__editor_icon"
            >
                <Button
                    className="iconEditor_icon-button"
                    categories={categories}
                    {
                        ...iconProps
                    }
                    targetPoint={TARGET_POINT}
                    direction={DIRECTION}
                    offset={OFFSET}
                    iconSize="s"
                    iconStyle={getIconStyle()}
                    panelWidth={370}
                    isSearchSizeLimit={false}
                    onChoose={chooseHandler}
                />
                {getIcon() !== DEFAULT_ICON && (
                    <TumblerControl
                        selectedKey={getCaptionPosition()}
                        items={variants}
                        onSelectedKeyChanged={onChangeHandler}
                        inlineHeight="s"
                    />
                )}
            </div>
        </LayoutComponent>
    );
});
