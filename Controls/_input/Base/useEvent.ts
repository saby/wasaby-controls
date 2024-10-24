import { SyntheticEvent } from 'react';

export interface IUseEventProps {
    onEvent?: (event: SyntheticEvent) => void;
    onBlur?: (event: SyntheticEvent) => void;
    onCut?: (event: SyntheticEvent) => void;
    onCopy?: (event: SyntheticEvent) => void;
    onPaste?: (event: SyntheticEvent) => void;
    onKeyUp?: (event: SyntheticEvent) => void;
    onKeyDown?: (event: SyntheticEvent) => void;
    onKeyPress?: (event: SyntheticEvent) => void;
    onClick?: (event: SyntheticEvent) => void;
    onInput?: (event: SyntheticEvent) => void;
    onSelect?: (event: SyntheticEvent) => void;
    onFocus?: (event: SyntheticEvent) => void;
    onFocusIn?: (event: SyntheticEvent) => void;
    onFocusin?: (event: SyntheticEvent) => void;
    onFocusOut?: (event: SyntheticEvent) => void;
    onFocusout?: (event: SyntheticEvent) => void;
    onMouseDown?: (event: SyntheticEvent) => void;
    onMouseMove?: (event: SyntheticEvent) => void;
    onTouchStart?: (event: SyntheticEvent) => void;
    onInputControl?: (event: SyntheticEvent) => void;
    onSelectionStartChanged?: (event: SyntheticEvent) => void;
    onSelectionEndChanged?: (event: SyntheticEvent) => void;
    onValueChanged?: (event: SyntheticEvent) => void;
    onInputCompleted?: (event: SyntheticEvent) => void;
    onDOMAutoComplete?: (event: SyntheticEvent) => void;
    [name: string]: unknown;
}
/**
 * Хук, который возвращает все подписки на события, которые должно обрабатывать поле ввода
 * @param props 
 * @public
 */
export function useEvent(props: IUseEventProps) {
    return {
        onCut: props.onCut,
        onCopy: props.onCopy,
        onPaste: props.onPaste,
        onKeyUp: props.onKeyUp,
        onKeyDown: props.onKeyDown,
        onKeyPress: props.onKeyPress,
        onClick: props.onClick,
        onInput: props.onInput,
        onSelect: props.onSelect,
        onFocus: (event: SyntheticEvent) => {
            props.onFocus?.(event);
            props.onFocusIn?.(event);
            props.onFocusin?.(event);
        },
        onBlur: (event: SyntheticEvent) => {
            props.onBlur?.(event);
            props.onFocusOut?.(event);
            props.onFocusout?.(event);
        },
        onMouseDown: props.onMouseDown,
        onMouseMove: props.onMouseMove,
        onTouchStart: props.onTouchStart,
        onInputControl: props.onInputControl,
        onSelectionStartChanged: props.onSelectionStartChanged,
        onSelectionEndChanged: props.onSelectionEndChanged,
        onValueChanged: props.onValueChanged,
        onInputCompleted: props.onInputCompleted,
        onDOMAutoComplete: props.onDOMAutoComplete,
    };
}
