import { memo, useMemo, useCallback, MouseEventHandler, useRef, Fragment, FC } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import BackgroundViewer from 'ExtControls/BackgroundViewer';
import { IBackground } from 'ExtControls/richColorPicker';
import { Button } from 'Controls/buttons';
import { Opener } from 'Controls/popup';
import { Logger } from 'UI/Utils';
import * as translate from 'i18n!Controls-editors';

type ViewType = 'preview' | 'button';

interface IColorEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: FC<object>;
    title?: string;
    view?: ViewType;
    icon?: string;
}

const DEFAULT_TITLE = translate('Цвет');

/**
 * Реакт компонент, редактор для настройки цвета шрифта
 * @class Controls-editors/_style/ColorEditor
 * @public
 */
export const ColorEditor = memo((props: IColorEditorProps) => {
    const {
        value,
        onChange,
        title = DEFAULT_TITLE,
        view,
        icon,
        LayoutComponent = Fragment,
    } = props;

    const backgroundValue = useMemo(() => {
        return {
            backgroundColor: value,
        };
    }, [value]);

    const onChangeCallback = useCallback(
        (result: Record<string, string>) => {
            if (typeof onChange === 'function') {
                onChange(result.backgroundColor);
            }
        },
        [onChange]
    );

    const stickyOpenerRef = useRef<Opener>(null);

    const openBackgroundEditor = useCallback<MouseEventHandler>(
        (event) => {
            stickyOpenerRef.current
                ?.open({
                    popupType: 'smallCard',
                    contentComponent: 'ExtControls/richColorPicker:BackgroundDecoration',
                    target: event.target,
                    fittingMode: {
                        vertical: 'overflow',
                    },
                    contentProps: {
                        headingCaption: title,
                        background: backgroundValue,
                        chooseGradient: false,
                        chooseImage: false,
                        chooseTexture: false,
                        dimension: {
                            width: 540,
                            height: 400,
                        },
                    },
                    targetPoint: {
                        horizontal: 'left',
                        vertical: 'top',
                    },
                    closeOnOutsideClick: true,
                    actionOnScroll: 'close',
                    eventHandlers: {
                        onResult: onChangeCallback,
                    },
                })
                .catch((error) => {
                    Logger.error('Ошибка открытия редактора фона', undefined, error);
                });
        },
        [backgroundValue, onChangeCallback, title]
    );

    return (
        <LayoutComponent>
            <div>
                <ColorButton
                    view={view}
                    icon={icon}
                    title={title}
                    background={backgroundValue}
                    onClick={openBackgroundEditor}
                />
                <Opener
                    ref={stickyOpenerRef}
                    contentComponent={'ExtControls/richColorPicker:BackgroundDecoration'}
                />
            </div>
        </LayoutComponent>
    );
});

interface IColorButtonProps {
    view?: ViewType;
    icon?: string;
    background: IBackground;
    title?: string;
    onClick: MouseEventHandler;
}

function ColorButton({
    view = 'preview',
    icon,
    background,
    title = '',
    onClick,
}: IColorButtonProps): JSX.Element {
    if (view === 'preview') {
        return (
            <div className="controls-editors-style_color-preview" title={title} onClick={onClick}>
                <BackgroundViewer background={background} />
            </div>
        );
    }

    return (
        <Button
            buttonStyle="unaccented"
            viewMode="ghost"
            tooltip={title}
            icon={icon}
            onClick={onClick}
        />
    );
}
