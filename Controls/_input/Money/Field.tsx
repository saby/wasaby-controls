import { forwardRef, LegacyRef, ReactElement, useMemo } from 'react';
import { default as Stretcher } from 'Controls/_input/Base/Stretcher';
import { default as MoneyField } from 'Controls/_input/resources/MoneyField';
import { default as ViewModel } from 'Controls/_input/BaseViewModel';
import { default as PlaceholderWrapper } from 'Controls/_input/Base/PlaceholderWrapper';
import { IControlProps } from 'Controls/interface';
import { ICallback } from '../interface/IValue';
import { ISelection } from 'Controls/_input/resources/Types';
import { useReadonly, useTheme } from 'UI/Contexts';
import { useEvent } from 'Controls/_input/Base/useEvent';
import { wasabyAttrsToReactDom } from 'UICore/Executor';

interface IFieldProps<Value, ModelOptions> extends IControlProps {
    autoWidth?: boolean;
    horizontalPadding?: string;
    ieVersion?: number;
    value?: string;
    isAdaptive?: boolean;
    emptySymbol?: string;
    getStretcherValue?: () => string;
    calculateValueForTemplate?: () => string;
    fieldName?: string;
    model?: ViewModel<Value, ModelOptions>;
    type?: string;
    inputMode?: string;
    autoComplete?: string;
    hidePlaceholderUsingCSS?: boolean;
    controlName?: string;
    placeholderVisibility?: string;
    placeholderTemplate?: ReactElement;
    stretcherContentTemplate?: ReactElement;
    placeholderDisplay?: string;
    highlightedOnFocus?: string;
    inputCallback?: ICallback<Value>;
    recalculateLocationVisibleArea?: (
        field: HTMLInputElement,
        value: string,
        selection: ISelection
    ) => void;
    transliterate?: boolean;
    spellCheck?: boolean;
    isFieldFocused?: () => boolean;
    isEdge?: boolean;
    wasActionUser?: boolean;

    forCalcRef?: LegacyRef<HTMLDivElement>;
    fieldNameRef?: LegacyRef<HTMLDivElement>;
}

export default forwardRef(function Field<Value, ModelOptions>(
    props: IFieldProps<Value, ModelOptions>,
    ref: LegacyRef<HTMLDivElement>
) {
    const theme = useTheme(props);
    const readOnly = useReadonly(props);
    const attrs = useMemo(() => {
        return {
            ...(wasabyAttrsToReactDom(props.attrs || {}) || {}),
            name: props.fieldName,
            spellcheck: props.spellCheck || false,
            readOnly: readOnly || '',
            autocorrect: 'off',
            autocapitalize: 'off',
            type: props.type,
            inputMode: props.inputMode,
            autocomplete: props.autoComplete,
            placeholder: props.hidePlaceholderUsingCSS ? props.emptySymbol : undefined,
        };
    }, [
        props.fieldName,
        props.spellCheck,
        readOnly,
        props.type,
        props.autoComplete,
        props.hidePlaceholderUsingCSS,
        props.emptySymbol,
    ]);

    return (
        <div
            ref={ref}
            data-qa={props.dataQa || props['data-qa']}
            className={`controls-InputBase__field${
                props.autoWidth ? ' controls-InputBase__field_autoWidth' : ''
            } controls-${props.controlName}__field_margin-${props.horizontalPadding} controls-${
                props.controlName
            }__field_theme_${theme}_margin-${props.horizontalPadding}${
                !!props.ieVersion && props.autoWidth
                    ? ' controls-InputBase__field_fixStretcherIE'
                    : ''
            }${!!props.ieVersion && props.value ? ' controls-InputBase__field_ie' : ''}${
                props.isAdaptive ? ' controls-' + props.controlName + '__field_adaptive' : ''
            }${props.className ? ` ${props.className}` : ''}`}
        >
            <Stretcher
                horizontalPadding={props.horizontalPadding}
                emptySymbol={props.emptySymbol}
                use={props.autoWidth}
                stretcherValue={props.getStretcherValue()}
                value={props.calculateValueForTemplate()}
            >
                <MoneyField
                    {...useEvent(props)}
                    fontSize={props.fontSize}
                    fontColorStyle={props.fontColorStyle}
                    fontWeight={props.fontWeight}
                    precision={props.precision}
                    attrs={attrs}
                    ref={props.fieldNameRef}
                    fieldRef={props.fieldNameRef}
                    model={props.model}
                    highlightedOnFocus={props.highlightedOnFocus}
                    inputCallback={props.inputCallback}
                    recalculateLocationVisibleArea={props.recalculateLocationVisibleArea}
                    transliterate={props.transliterate}
                    className={`controls-InputBase__nativeField controls-${
                        props.controlName
                    }__nativeField_caret${props.wasActionUser ? 'Filled' : 'Empty'} controls-${
                        props.controlName
                    }__nativeField_caret${props.wasActionUser ? 'Filled' : 'Empty'}_theme_${theme}${
                        props.isEdge ? ' controls-InputBase__nativeField_edge' : ''
                    }${props.autoWidth ? ' controls-InputBase__nativeField_stretcher' : ''}`}
                />
            </Stretcher>
            {/*
         Deleting the DOM element during input will cause saving the current value to the browser history.
         The standard rollback of the value(ctrl + z) by history is broken. https://jsfiddle.net/ow0zjghn/
         Placeholder must be hide instead of deleting.
         */}
            <PlaceholderWrapper
                placeholderVisibility={props.placeholderVisibility}
                placeholderTemplate={props.placeholderTemplate}
                placeholderDisplay={props.placeholderDisplay}
                value={props.value}
            />
            {props.isFieldFocused() && (
                <div ref={props.forCalcRef} className="controls-InputBase__forCalc" />
            )}
        </div>
    );
});