import { Fragment, memo, useMemo, useRef } from 'react';
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

const DEFAULT_ICON = 'icon-Close';//'Controls-icons/actions:icon-SendIcon';

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
                    icon={getIcon()}
                    iconSize="m"
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
