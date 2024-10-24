import { useState, useCallback, useMemo, useEffect, useRef, CSSProperties } from 'react';
import { activate, FocusRoot } from 'UICore/Focus';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { Title } from 'Controls/heading';
import { Render } from 'Controls/input';
import { isRequired } from 'Controls/validate';
import { TFontSize, TFontColorStyle } from 'Controls/interface';
import { Field, Validator } from './Field';
import { MinMaxLength } from 'Controls-Input/validators';
import { Button } from 'Controls/buttons';
import { TValidationStatus } from 'Controls/interface';
import * as rk from 'i18n!Controls-editors';
import 'css!Controls-editors/style';

const MAX_LENGTH = 50;
const PLACEHOLDER_NAME = rk('Название');
const PLACEHOLDER_SELECTOR = rk('Селектор');
const BASIC_VALIDATORS: Validator[] = [
    (valueObj) => isRequired(valueObj),
    (valueObj) => MinMaxLength({ maxLength: MAX_LENGTH }, valueObj),
];

function useLineHeight(inlineHeight: string): CSSProperties {
    return useMemo(() => {
        return {
            lineHeight: `var(--inline_height_${inlineHeight})`,
        };
    }, [inlineHeight]);
}

interface ICommonProps {
    hideSelector?: boolean;
    nameValue: string;
    selectorValue?: string;
    inlineHeight: string;
    className?: string;
}

interface IViewProps extends ICommonProps {
    readOnly?: boolean;
    nameFontSize: TFontSize;
    selectorFontSize?: TFontSize;
    selectorFontColorStyle?: TFontColorStyle;
}

interface IEditProps extends ICommonProps {
    nameEditorFontSize?: TFontSize;
    selectorEditorFontSize?: TFontSize;
    nameValidationField: string[];
    selectorValidationField?: string[];
    storeId: string;
    nameValidators?: Validator[];
    selectorValidators?: Validator[];
}

interface INameSelectorEditorProps extends IViewProps, IEditProps {
    initEditing?: boolean;
    onEditStart?: () => void;
    onEditFinish?: (nameValue: string, selectorValue: string | undefined) => void;
}

export function NameSelectorEditor({
    className = '',
    hideSelector,
    initEditing = false,
    inlineHeight,
    nameFontSize,
    nameEditorFontSize = nameFontSize,
    nameValidationField,
    nameValidators,
    nameValue,
    onEditFinish,
    onEditStart,
    readOnly = false,
    selectorFontSize,
    selectorEditorFontSize = selectorFontSize,
    selectorValidationField,
    selectorFontColorStyle,
    selectorValidators,
    selectorValue,
    storeId,
}: INameSelectorEditorProps): JSX.Element {
    const slice = useStrictSlice<FormSlice>(storeId);
    const [editing, setEditing] = useState<boolean>(initEditing);
    const [focusIndex, setFocusIndex] = useState<number>(0);

    const startEditing = useCallback(
        (index: number) => {
            if (!readOnly) {
                setEditing(true);
                setFocusIndex(index);

                if (onEditStart) {
                    onEditStart();
                }
            }
        },
        [readOnly, onEditStart]
    );

    const completeEditing = useCallback(
        async (newName: string, newSelector: string) => {
            await slice.validateAll();

            if (slice.isValid()) {
                setEditing(false);

                if (onEditFinish) {
                    onEditFinish(newName, newSelector);
                }
            }
        },
        [onEditFinish, slice]
    );

    return editing ? (
        <EditMode
            className={className}
            focusIndex={focusIndex}
            hideSelector={hideSelector}
            inlineHeight={inlineHeight}
            nameEditorFontSize={nameEditorFontSize}
            nameValidationField={nameValidationField}
            nameValidators={nameValidators}
            nameValue={nameValue}
            onEditComplete={completeEditing}
            selectorEditorFontSize={selectorEditorFontSize}
            selectorValidationField={selectorValidationField}
            selectorValidators={selectorValidators}
            selectorValue={selectorValue}
            storeId={storeId}
        />
    ) : (
        <ViewMode
            className={className}
            hideSelector={hideSelector}
            inlineHeight={inlineHeight}
            nameFontSize={nameFontSize}
            nameValue={nameValue}
            onClick={startEditing}
            readOnly={readOnly}
            selectorFontColorStyle={selectorFontColorStyle}
            selectorFontSize={selectorFontSize}
            selectorValue={selectorValue}
        />
    );
}

interface IViewModeProps extends IViewProps {
    onClick: (index: number) => void;
}

function ViewMode({
    className,
    hideSelector,
    inlineHeight,
    nameFontSize,
    nameValue,
    onClick,
    readOnly,
    selectorFontColorStyle = 'default',
    selectorFontSize,
    selectorValue,
}: IViewModeProps): JSX.Element {
    const style = useLineHeight(inlineHeight);
    const onNameClick = useCallback(() => {
        onClick(0);
    }, [onClick]);

    const onSelectorClick = useCallback(() => {
        onClick(1);
    }, [onClick]);

    return (
        <div
            style={style}
            className={`tw-flex tw-items-baseline tw-overflow-hidden controls-inlineheight-${inlineHeight} NameSelectorEditor ${className}`}
        >
            <Title
                caption={nameValue}
                fontSize={nameFontSize}
                className="tw-truncate"
                dataQa="NameSelectorEditor__name"
                tooltip={nameValue}
                onClick={onNameClick}
                readOnly={readOnly}
            />
            {!hideSelector && (
                <Title
                    caption={selectorValue}
                    fontSize={selectorFontSize}
                    fontColorStyle={selectorFontColorStyle}
                    fontWeight="normal"
                    className="tw-truncate controls-margin_left-m"
                    dataQa="NameSelectorEditor__selector"
                    tooltip={selectorValue}
                    onClick={onSelectorClick}
                    readOnly={readOnly}
                />
            )}
        </div>
    );
}

function getValidationStatus(
    a: TValidationStatus = TValidationStatus.Valid,
    b: TValidationStatus = TValidationStatus.Valid
): TValidationStatus {
    return a === TValidationStatus.Valid && b === TValidationStatus.Valid
        ? TValidationStatus.Valid
        : TValidationStatus.Invalid;
}

interface IEditModeProps extends IEditProps {
    focusIndex: number;
    onEditComplete: (nameValue: string, selectorValue: string) => void;
}

function EditMode({
    className,
    hideSelector,
    focusIndex,
    inlineHeight,
    nameEditorFontSize = 'm',
    nameValidationField,
    nameValidators,
    nameValue,
    onEditComplete,
    selectorEditorFontSize = 'm',
    selectorValidationField,
    selectorValidators,
    selectorValue = '',
    storeId,
}: IEditModeProps): JSX.Element {
    const nameValueRef = useRef<string>(nameValue);
    const selectorValueRef = useRef<string>(selectorValue);
    const focusRef = useRef<typeof FocusRoot>(null);
    const { validationState } = useStrictSlice<FormSlice>(storeId);
    const nameValidationKey = useMemo(() => nameValidationField.join(''), [nameValidationField]);
    const selectorValidationKey = useMemo(
        () => (selectorValidationField || []).join(''),
        [selectorValidationField]
    );
    const nameStatus = validationState[nameValidationKey] as unknown as TValidationStatus;
    const selectorStatus = hideSelector
        ? TValidationStatus.Valid
        : (validationState[selectorValidationKey] as unknown as TValidationStatus);
    const validationStatus = getValidationStatus(nameStatus, selectorStatus);
    const style = useLineHeight(inlineHeight);

    const nameFullValidators = useMemo(
        () => BASIC_VALIDATORS.concat(nameValidators || []),
        [nameValidators]
    );

    const selectorFullValidators = useMemo(
        () => BASIC_VALIDATORS.concat(selectorValidators || []),
        [selectorValidators]
    );

    const onNameChange = useCallback((newName: string) => {
        nameValueRef.current = newName;
    }, []);

    const onSelectorChange = useCallback((newSelector: string) => {
        selectorValueRef.current = newSelector;
    }, []);

    const onEditCompleteCallback = useCallback(() => {
        onEditComplete(nameValueRef.current, selectorValueRef.current);
    }, [onEditComplete]);

    useEffect(() => {
        if (focusRef.current) {
            activate(focusRef.current);
        }
    }, []);

    return (
        <FocusRoot
            as="div"
            autofocus={true}
            ref={focusRef}
            className={`tw-w-full NameSelectorEditor ${className}`}
            onDeactivated={onEditCompleteCallback}
        >
            <Render
                style={style}
                className="tw-w-full"
                inlineHeight={inlineHeight}
                contrastBackground={false}
                validationStatus={validationStatus}
            >
                <>
                    <Field
                        autofocus={focusIndex === 0}
                        bold={true}
                        fontSize={nameEditorFontSize}
                        name={nameValidationKey}
                        onChange={onNameChange}
                        placeholder={PLACEHOLDER_NAME}
                        storeId={storeId}
                        validators={nameFullValidators}
                        value={nameValue}
                        className="NameSelectorEditor__nameInput"
                    />
                    {!hideSelector && (
                        <>
                            <div className="NameSelectorEditor__separator"></div>
                            <Field
                                autofocus={focusIndex === 1}
                                fontSize={selectorEditorFontSize}
                                name={selectorValidationKey}
                                onChange={onSelectorChange}
                                placeholder={PLACEHOLDER_SELECTOR}
                                storeId={storeId}
                                validators={selectorFullValidators}
                                value={selectorValue}
                                className="NameSelectorEditor__selectorInput"
                            />
                        </>
                    )}
                    <div
                        className="NameSelectorEditor__confirmButton"
                        data-qa="NameSelectorEditor__confirmButton"
                    >
                        <Button
                            viewMode="link"
                            buttonStyle="success"
                            inlineHeight="xs"
                            tooltip={rk('Сохранить')}
                            iconStyle="success"
                            iconSize="s"
                            icon="icon-Yes"
                            className="controls-margin_left-2xs"
                            onClick={onEditCompleteCallback}
                        />
                    </div>
                </>
            </Render>
        </FocusRoot>
    );
}
