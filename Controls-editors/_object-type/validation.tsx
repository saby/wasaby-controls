import { useEffect, useMemo, PropsWithChildren, useRef, useCallback } from 'react';
import { Container as ValidationContainerBase, TValidator } from 'Controls/validate';
import { Icon } from 'Controls/icon';
import { EventSubscriber } from 'UI/Events';

/**
 * @public
 * Описывает валидацию объекта, где каждому свойству соответствует интерфейс валидации.
 */
export type PropsValidation = Record<string, IValidation>;

/**
 * @public
 * Интерфейс валидации, который обрабатывается в PropertyGrid и отдается в редакторы.
 */
export interface IValidation {
    /**
     * Текст, предназначенный для отображения в виде предупреждения
     */
    warning?: string;

    /**
     * Текст, предназначенный для отображения в виде ошибки.
     * Отображается с использованием платформенной валидации (infobox).
     */
    error?: string;

    /**
     * Текст, предназначенный для отображения в виде "строгой" ошибки.
     * ("Строгая" ошибка не дает редактору стрелять событиями изменения - пока не реализовано).
     * Отображается с использованием платформенной валидации (infobox).
     *
     * TODO работа с событиями изменения будет реализована позже - когда понадобится клиентская валидация,
     * а пока strictError работает аналогично error.
     */
    strictError?: string;

    /**
     * Валидация для вложенных редакторов или редакторов, работающих со списками.
     */
    nested?: Record<string, IValidation> | IValidation[];
}

/**
 * @public
 * Валидация для редактора, которая приходит в свойстве validation.
 */
export interface IEditorValidation {
    /**
     * Функции-валидаторы для передачи в платформенный контейнер валидации.
     */
    validators?: TValidator<unknown>[] | undefined;

    /**
     * Текст, предназначенный для отображения в виде предупреждения
     */
    warning?: string;

    /**
     * Валидация для вложенных редакторов или редакторов, работающих со списками.
     */
    nested?: Record<string, IValidation> | IValidation[];
}

/**
 * @public
 * Хук преобразует значение с интерфейсом IValidation в готовые свойства для передачи редактору.
 */
export function useEditorValidation(
    validation: IValidation | undefined
): IEditorValidation | undefined {
    const { error, strictError, warning, nested } = validation || {};

    const validators = useMemo(() => {
        if (error || strictError) {
            return [() => error || strictError || true];
        }
    }, [error, strictError]);

    return useMemo(() => {
        if (validators || warning || nested) {
            return { validators, warning, nested };
        }
    }, [validators, warning, nested]);
}

/**
 * @public
 * Хук преобразует значение с интерфейсом PropsValidation в готовые свойства для передачи нескольким редакторам.
 * Убирает свойства, не используемые редактором.
 */
export function useEditorPropsValidation(
    propsValidation: PropsValidation | undefined,
    propNames: string[]
): Record<string, IEditorValidation> | undefined {
    return useMemo(() => {
        if (!propsValidation) {
            return;
        }

        const editorPropsValidation: Record<string, IEditorValidation> = {};

        for (const name of propNames) {
            const validation = propsValidation[name];

            if (validation) {
                const { error, strictError, warning, nested } = validation;

                editorPropsValidation[name] = {
                    validators: [() => error || strictError || true],
                    warning,
                    nested,
                };
            }
        }

        return editorPropsValidation;
    }, [propNames, propsValidation]);
}

interface IValidationContainerProps {
    validators: TValidator<unknown>[] | undefined;
    doNotValidate?: boolean;
}

/**
 * @public
 * Контрол-обертка над платформенным контейнером валидации.
 * Вызывает валидацию при изменении ее значения.
 */
export function ValidationContainer({
    validators,
    doNotValidate,
    children,
}: PropsWithChildren<IValidationContainerProps>): JSX.Element {
    const validatorRef = useRef<ValidationContainerBase>(null);

    useEffect(() => {
        if (validatorRef.current) {
            validatorRef.current.validate();
        }
    }, [validators]);

    if (!validators || !children || doNotValidate) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{children}</>;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <ValidationContainerBase ref={validatorRef} validators={validators}>
            {children}
        </ValidationContainerBase>
    );
}

interface IWarningTemplateProps {
    text: string;
}

/**
 * @public
 */
export function WarningTemplate({ text }: IWarningTemplateProps): JSX.Element {
    return (
        <div>
            <Icon icon="icon-Alert" iconSize="s" iconStyle="warning" />
            <span className="controls-padding_left-2xs controls-text-warning">{text}</span>
        </div>
    );
}

interface IValidationDescriptorProps {
    name?: string;
}

/**
 * Контрол для задания имени на вложенные контейнеры валидации
 * @public
 */
export function ValidationDescriptor({
    name = '',
    children,
}: PropsWithChildren<IValidationDescriptorProps>): JSX.Element {
    const onValidateCreated = useCallback(
        (_event: unknown, validateContainer: ValidationContainerBase) => {
            validateContainer.setAreaKey(name);
        },
        [name]
    );

    return <EventSubscriber onValidateCreated={onValidateCreated}>{children}</EventSubscriber>;
}
