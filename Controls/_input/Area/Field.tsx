import { IUseEventProps, useEvent } from 'Controls/_input/Base/useEvent';
import { default as ViewModel } from 'Controls/_input/BaseViewModel';
import { default as BaseField } from 'Controls/_input/resources/Field';
import { getContent } from 'Controls/_input/resources/ReactUtils';
import { ISelection } from 'Controls/_input/resources/Types';
import { IControlProps } from 'Controls/interface';
import { useReadonly } from 'UI/Contexts';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import {
    CSSProperties,
    LegacyRef,
    ReactElement,
    RefObject,
    SyntheticEvent,
    forwardRef,
    useMemo,
} from 'react';
import { ICallback } from '../interface/IValue';

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
    isIE?: boolean;
    wasActionUser?: boolean;

    fixTextPosition?: boolean;
    // см
    _placeholderClickHandler?: Function;
    fakeFieldRef?: LegacyRef<HTMLDivElement>;
    lineHeightForIE: number;
    minLines: number;
    heightLine: number;
    placeholder: string;

    forCalcRef?: LegacyRef<HTMLDivElement>;
    fieldNameRef?: RefObject<BaseField<string, {}>>;
    onKeyPress?: (e: SyntheticEvent<HTMLElement, KeyboardEvent>) => void;
    attrs?: Record<string, unknown>;
}

export default forwardRef(function Field<Value, ModelOptions>(
    props: IFieldProps<Value, ModelOptions>,
    ref: LegacyRef<HTMLDivElement>
) {
    const readOnly = useReadonly(props);
    const attrs = useMemo(() => {
        return {
            ...(wasabyAttrsToReactDom(props.attrs as Record<string, unknown>) || {}),
            name: props.fieldName,
            spellCheck: props.spellCheck || false,
            readOnly: readOnly || '',
            autocorrect: 'off',
            autocapitalize: 'on',
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
    const style: CSSProperties = useMemo(() => {
        return {
            minHeight: props.isIE
                ? `${props.lineHeightForIE * props.minLines}px`
                : 'var(--calculated-line-min-height_inputArea)',
        };
    }, [props.lineHeightForIE, props.minLines]);

    return (
        <div
            ref={ref}
            data-qa={props.dataQa || props['data-qa']}
            className={`controls-Area__fieldWrapper controls-Area__field_margin-${
                props.horizontalPadding
            }${props.className ? ` ${props.className}` : ''} controls-text-multiline`}
        >
            <div
                ref={props.fakeFieldRef}
                style={style}
                className={`controls-Area__fakeField controls-Area__minHeight_countLines_${props.minLines}_size_${props.heightLine}`}
            >
                {props.value
                    ? props.value + props.emptySymbol
                    : props.placeholder
                    ? getContent(props.placeholderTemplate)
                    : props.emptySymbol}
            </div>
            <BaseField
                {...useEvent(props as unknown as IUseEventProps)}
                onKeyPress={props.onKeyPress}
                attrs={attrs}
                ref={props.fieldNameRef}
                fieldRef={props.fieldNameRef}
                // @ts-ignore
                model={props.model}
                tag="textarea"
                highlightedOnFocus={props.highlightedOnFocus}
                // @ts-ignore
                inputCallback={props.inputCallback}
                recalculateLocationVisibleArea={props.recalculateLocationVisibleArea}
                readOnly={props.readOnly}
                className={
                    'controls-InputBase__nativeField controls-Area__realField' +
                    ` controls-InputBase__nativeField_caret${
                        props.wasActionUser ? 'Filled' : 'Empty'
                    }${
                        props.hidePlaceholderUsingCSS
                            ? ' controls-InputBase__nativeField_hideCustomPlaceholder'
                            : ''
                    }${props.fixTextPosition ? ' controls-Area__realField_fixTextPosition' : ''}`
                }
            />
            {!props.value && (
                <div
                    className={`controls-InputBase__placeholder controls-InputBase__placeholder_displayed-${props.placeholderDisplay}-caret`}
                >
                    {getContent(props.placeholderTemplate, {
                        onClick: props._placeholderClickHandler,
                    })}
                </div>
            )}
            <div ref={props.forCalcRef} className="controls-Area__fakeCalcField">
                {props.model.displayValue?.substring?.(0, props.model.selection?.end || 0) +
                    props.emptySymbol}
            </div>
        </div>
    );
});
