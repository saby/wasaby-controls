import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { ObjectMetaAttributes } from 'Types/meta';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Combobox } from 'Controls/dropdown';
import { TFontColorStyle, TFontSize, TFontWeight } from 'Controls/interface';
import { Memory } from 'Types/source';

/**
 * @public
 */
export interface IFont {
    /**
     * Цвет
     */
    color?: TFontColorStyle;
    /**
     * Жирность
     */
    weight?: TFontWeight;
    /**
     * Размер
     */
    size?: TFontSize;
}

/**
 * @public
 */
export interface IFontEditorProps extends IPropertyGridPropertyEditorProps<IFont> {
    /**
     * Определяет параметры, которые будут редактироваться
     */
    attributes?: ObjectMetaAttributes<IFont>;
}

const Select = memo((props: any) => {
    const { value, onChange, readOnly, options, required, placeholder } = props;
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: options || [] });
    }, [options]);
    const comboboxOptions = {
        placeholder,
        closeMenuOnOutsideClick: true,
        selectedKey: value,
        readOnly,
        displayProperty: 'caption',
        keyProperty: 'value',
        source,
    };
    if (!required) {
        (comboboxOptions as any).emptyKey = '';
        (comboboxOptions as any).emptyText = ' ';
    }

    const attrs = { style: 'flex: 1; margin-right: 10px' };
    return (
        <Combobox
            {...comboboxOptions}
            attrs={attrs}
            onValueChanged={(_value) => {
                onChange(
                    options.find((item) => {
                        return item.caption === _value;
                    })?.value
                );
            }}
            customEvents={['onValueChanged']}
        />
    );
});

/**
 * Реакт компонент, редактор шрифтов (Размер/Цвет/Толщина)
 * @class Controls-editors/_properties/FontEditor
 * @implements Controls-editors/properties:IFontEditorProps
 * @public
 */
export const FontEditor = memo((props: IFontEditorProps) => {
    const { type, value, attributes, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const propsRef = useRef(props);
    propsRef.current = props;

    const colors = useMemo(() => {
        return [
            'default',
            'primary',
            'secondary',
            'success',
            'warning',
            'danger',
            'unaccented',
            'link',
            'label',
            'info',
        ].map((caption) => {
            return { caption, value: caption };
        });
    }, []);
    const onColorChange = useCallback((newColor) => {
        propsRef.current.onChange({
            ...propsRef.current.value,
            color: newColor,
        });
    }, []);

    const sizes = useMemo(() => {
        return [
            'inherit',
            'xs',
            's',
            'm',
            'l',
            'xl',
            '2xl',
            '3xl',
            '4xl',
            '5xl',
            '6xl',
            '7xl',
            '8xl',
        ].map((caption) => {
            return { caption, value: caption };
        });
    }, []);
    const onSizeChange = useCallback((newSize) => {
        propsRef.current.onChange({ ...propsRef.current.value, size: newSize });
    }, []);

    const weights = useMemo(() => {
        return ['default', 'normal', 'bold'].map((caption) => {
            return { caption, value: caption };
        });
    }, []);
    const onWeightChange = useCallback((newWeight) => {
        propsRef.current.onChange({
            ...propsRef.current.value,
            weight: newWeight,
        });
    }, []);

    return (
        <LayoutComponent>
            <div
                style={{ display: 'flex', marginRight: '-10px' }}
                data-qa="controls-PropertyGrid__editor_font"
            >
                {attributes.color ? (
                    <Select
                        placeholder={attributes.color.getTitle()}
                        value={value?.color}
                        onChange={onColorChange}
                        readOnly={readOnly}
                        required={attributes.color.isRequired()}
                        options={colors}
                    />
                ) : null}
                {attributes.weight ? (
                    <Select
                        placeholder={attributes.weight.getTitle()}
                        value={value?.weight}
                        onChange={onWeightChange}
                        readOnly={readOnly}
                        required={attributes.weight.isRequired()}
                        options={weights}
                    />
                ) : null}
                {attributes.size ? (
                    <Select
                        placeholder={attributes.size.getTitle()}
                        value={value?.size}
                        onChange={onSizeChange}
                        readOnly={readOnly}
                        required={attributes.size.isRequired()}
                        options={sizes}
                    />
                ) : null}
            </div>
        </LayoutComponent>
    );
});
