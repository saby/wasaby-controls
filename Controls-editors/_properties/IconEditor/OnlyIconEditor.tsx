import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Button } from 'Emotions/picker';
import { default as IconTemplate } from './resources/EmptyIconTemplate';
import * as rk from 'i18n!Controls-editors';

interface IIconEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    className?: string;
}

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
};

const DEFAULT_ICON = 'icon-Close';

/**
 * Реакт компонент, редактор иконки
 * @class Controls-editors/_properties/OnlyIconEditor
 * @public
 */
export const OnlyIconEditor = memo((props: IIconEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;

    const previewerTarget = useRef<PreviewerTarget>();
    const propsRef = useRef(props);
    propsRef.current = props;

    const chooseHandler = useCallback(
        (icon) => {
            onChange(icon.item.name !== 'empty' ? icon.item.name : '');
            previewerTarget.current?.close();
        },
        [onChange]
    );

    const getIcon = () => {
        return value || DEFAULT_ICON;
    };

    const getIconStyle = () => {
        return value ? 'secondary' : 'unaccented';
    };

    const categories = useMemo(
        () => [
            {
                id: 'icons',
                icon: value,
                title: rk('Выбор иконки'),
                template: 'Emotions/dialog:Icon',
            },
        ],
        [value]
    );

    const iconProps: { iconTemplate?: JSX.Element; icon?: string } = {};
    const icon = getIcon();
    if (icon === DEFAULT_ICON) {
        iconProps.iconTemplate = IconTemplate;
        iconProps.icon = 'empty';
    } else {
        iconProps.icon = icon;
    }

    return (
        <LayoutComponent>
            <Button
                className={`iconEditor_icon-button${props.className ? ` ${props.className}` : ''}`}
                categories={categories}
                {...iconProps}
                targetPoint={TARGET_POINT}
                direction={DIRECTION}
                offset={OFFSET}
                iconSize="s"
                iconStyle={getIconStyle()}
                panelWidth={370}
                isSearchSizeLimit={false}
                onChoose={chooseHandler}
            />
        </LayoutComponent>
    );
});
