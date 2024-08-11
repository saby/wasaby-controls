import { memo, Fragment, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Meta/types';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { SizeEditorField } from './SizeEditorField';
import { Button } from 'Controls/buttons';

import * as rk from 'i18n!Controls-editors';

interface ISizeEditor extends IPropertyEditorProps<String> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

const DEFAULT_RADIX = 10;

export const SizeEditor = memo((props: ISizeEditor) => {
    const { value, LayoutComponent = Fragment, type, onChange } = props;

    const { width = '', height = '', saveProportions = true, aspectRatio = 16 / 9 } = value;

    const onChangeWidth = useCallback(
        (newWidth: string) => {
            let resultHeight = height;
            const numberWidth = parseInt(newWidth, DEFAULT_RADIX);
            if (saveProportions) {
                if (newWidth.includes('px')) {
                    resultHeight = numberWidth
                        ? Number((numberWidth / aspectRatio).toFixed()) + 'px'
                        : 'px';
                } else if (newWidth.includes('%')) {
                    resultHeight = newWidth;
                }
            }

            const currentValue = { ...value, width: newWidth, height: resultHeight };
            onChange(currentValue);
        },
        [onChange, value, saveProportions, aspectRatio, height]
    );

    const onChangeHeight = useCallback(
        (newHeight: string) => {
            let resultWidth = width;
            const numberHeight = parseInt(newHeight, DEFAULT_RADIX);

            if (saveProportions) {
                if (newHeight.includes('px')) {
                    resultWidth = numberHeight
                        ? Number((numberHeight * aspectRatio).toFixed()) + 'px'
                        : 'px';
                } else if (newHeight.includes('%')) {
                    resultWidth = newHeight;
                }
            }

            const currentValue = { ...value, height: newHeight, width: resultWidth };

            onChange(currentValue);
        },
        [onChange, value, saveProportions, aspectRatio, width]
    );

    const onChangeProportions = useCallback(() => {
        const newSaveProportions = !saveProportions;
        const currentValue = { ...value, saveProportions: newSaveProportions };

        onChange(currentValue);
    }, [onChange, value, saveProportions]);

    return (
        <LayoutComponent>
            <div className="ws-flexbox ws-align-items-center">
                <div className="controls-PropertyGrid-sizeEditor__offsetInput">
                    <SizeEditorField
                        value={width}
                        onChange={onChangeWidth}
                        type={type}
                        name={rk('Ширина')}
                        showName={true}
                    />

                    <SizeEditorField
                        value={height}
                        onChange={onChangeHeight}
                        type={type}
                        name={rk('Высота')}
                        showName={true}
                    />
                </div>
                <div>
                    <div className="controls-PropertyGrid-sizeEditor_lockIcon__topBorder" />
                    <Button
                        icon={saveProportions ? 'icon-Lock' : 'icon-Unlock'}
                        viewMode="link"
                        iconStyle="unaccented"
                        iconSize="2xs"
                        onClick={onChangeProportions}
                        tooltip={
                            saveProportions
                                ? rk('Убрать сохранение пропорций')
                                : rk('Сохранять пропорции')
                        }
                    />
                    <div className="controls-PropertyGrid-sizeEditor_lockIcon__bottomBorder" />
                </div>
            </div>
        </LayoutComponent>
    );
});
