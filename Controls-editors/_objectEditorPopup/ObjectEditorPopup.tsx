import * as rk from 'i18n!Controls';
import {Button as ButtonControl} from 'Controls/buttons';
import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
} from 'react';
import { Dialog as DialogControl } from 'Controls/popupTemplate';
import { Confirmation } from 'Controls/popup';
import { Container as ScrollContainerControl } from 'Controls/scroll';
import { IObjectEditorPopupProps } from './IObjectEditorPopupProps';
import ObjectEditorPopupHeaderActions from './ObjectEditorPopupHeaderActions';
import ObjectEditorPopupScrollContent from './ObjectEditorPopupScrollContent';
import { __notifyFromReact } from 'UI/Events';
import 'css!Controls-editors/_objectEditorPopup/ObjectEditorPopup';

/**
 * Костыли, которые нужно будет исправить:
 * Причина: Из-за архитектурных проблем wasaby контентные опции контролов пересоздаются на каждом рендере
 * Временное решение: Контентные опции мемоизированы относительно фиктивного стейта (для сброса состояния по кнопке).
 * Благодаря чему они не пересоздаются. ScrollContent получает внешние данные (пропсы) только при первом рендере, затем дублирует их
 * и отправляет вниз по дереву локальный дубликат. При изменении данных "снизу", меняет локальную копию и внешние данные.
 * Недостатки временного решения: Если данные будут изменены извне, то локальная копия компонента
 * ScrollContent эти изменения не получит (из-за мемоизации)
 * Решение: Пока единственный известный способ -- это переписать DialogControl и ScrollContainerControl на реакт, после чего
 * контентные опции можно будет передавать без мемоизации
 */

/**
 * Реакт компонент, для отображения редактора объектов в диалоговом окне
 * @class Controls-editors/_objectEditorPopup/ObjectEditorPopup
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

export const HEADER_PLACE_ORDER = -1;

const ObjectEditorPopup = forwardRef(<RuntimeInterface extends object>(
    props: IObjectEditorPopupProps<RuntimeInterface>,
    ref
) => {
    const { metaType, sort, value, onClose } = props;

    const title = metaType.getTitle();

    const headerEditorMeta = useMemo(() => {
        const atttrs = (Object
            .entries(metaType.attributes())
            .filter(([, meta]) => {
                return meta && meta.getOrder() === HEADER_PLACE_ORDER;
            }));
        return (
            atttrs.length ?
                metaType.attributes(
                    atttrs
                        .reduce((accum, entry) =>
                            ({...accum, [entry[0]]: entry[1]}), {})
                ) : undefined
        );
    }, [metaType]);

    const bodyEditorMeta = useMemo(() => (
        metaType.attributes(Object
            .entries(metaType.attributes())
            .filter(([, meta]) => {
                return meta && meta.getOrder() !== HEADER_PLACE_ORDER;
            })
            .reduce((accum, entry) => ({ ...accum, [entry[0]]: entry[1]}), {})
        )
    ), [metaType]);

    // TODO: разобраться с стостояниями value https://online.sbis.ru/opendoc.html?guid=cfd7cd75-4183-4626-bd3b-edbea199c7b9&client=3
    const [resetTrigger, setResetTrigger] = useState(false);
    const [changedValue, setChangedValue] = useState({ ...props.value });

    const closeTabCallbackRef =
        useRef<(event: BeforeUnloadEvent) => void>(null);


    const externalValueRef = useRef({ ...props.value });

    const isValueUpdated = useCallback(() => {
        return (
            JSON.stringify(externalValueRef.current) !==
            JSON.stringify(changedValue)
        );
    }, [changedValue]);

    const isValueUpdatedRef = useRef(isValueUpdated);

    const pendingResolveRef = useRef<(val?: unknown) => void>(null);

    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        isValueUpdatedRef.current = isValueUpdated;
    }, [isValueUpdated]);

    useEffect(() => {
        // TODO: Временное решение. Перейти на платформенное после решения задачи
        //  https://online.sbis.ru/opendoc.html?guid=7aee47d7-5d9a-4871-82fb-01cbaaa5fc4b&client=3
        __notifyFromReact(rootRef.current, 'registerPending', [
            new Promise((resolve) => {
                pendingResolveRef.current = resolve;
            }),
            {
                onPendingFail: async () => {
                    const cancelPending = () => {
                        __notifyFromReact(
                            rootRef.current,
                            'cancelFinishingPending',
                            [],
                            true
                        );
                    };

                    const confirmPending = () => {
                        pendingResolveRef.current();
                    };

                    if (!isValueUpdatedRef.current()) {
                        return confirmPending();
                    }

                    const answer = await Confirmation.openPopup({
                        message: rk('Сохранить изменения?'),
                        type: 'yesnocancel',
                    });

                    if (answer) {
                        confirmPending();
                    } else if (answer === false) {
                        setInitialValue();
                        confirmPending();
                    } else {
                        cancelPending();
                    }
                },
            },
        ]);
    }, []);

    const onChange = (newValue) => {
        setChangedValue(newValue);
        props.onChange(newValue);
    };

    const reset = () => {
        const defaultValue = metaType.getDefaultValue();
        const newValue = {
            ...changedValue,
            ...defaultValue
        };
        setChangedValue(newValue);
        props.onChange({ ...newValue });
        setResetTrigger(b => {
            return !b;
        });
    };

    const setInitialValue = () => {
        props.onChange({ ...props.value });
    };

    const onApply = useCallback(() => {
        externalValueRef.current = changedValue;
        props.onClose();
    }, [props.onClose, changedValue]);

    const onApplyRef = useRef(onApply);

    useEffect(() => {
        onApplyRef.current = onApply;
    }, [onApply]);

    const ScrollContentMemoized = useMemo(() => {
        return (
            <ObjectEditorPopupScrollContent
                metaType={bodyEditorMeta}
                sort={sort}
                value={changedValue}
                onChange={onChange}
            />
        );
    }, [resetTrigger, changedValue, bodyEditorMeta]); // Получает данные только при первом рендере (прочти доклет вначале файла)

    const applyHandler = useCallback(() => {
        onApplyRef.current();
    }, []);

    const BodyContentTemplate = useMemo(() => {
        return (
            <>
                <ButtonControl
                    className="controls_objectEditorPopup_WidgetPanel__apply"
                    viewMode="filled"
                    buttonStyle="success"
                    inlineHeight="l"
                    iconSize="m"
                    icon="icon-Yes"
                    iconStyle="contrast"
                    tooltip={rk('Применить')}
                    key="SuccessBtn"
                    data-qa="siteEditorBase_WidgetPanelHeader__apply"
                    onClick={applyHandler}
                />
                <ScrollContainerControl
                    content={ScrollContentMemoized}
                    className="ObjectEditorPopup_Widget__scrollContainer"
                />
            </>
        );
    }, [resetTrigger, applyHandler]); // Получает данные только при первом рендере (прочти доклет вначале файла)

    const HeaderContentTemplate = useMemo(() => {
        return (
            <ObjectEditorPopupHeaderActions
                onReset={reset}
                metaType={metaType}
                value={changedValue}
                title={title}
                headerEditorMeta={headerEditorMeta}
                onChange={onChange}
            />
        );
    }, [props.onClose, changedValue, metaType, title]);

    useEffect(() => {
        if (isValueUpdated()) {
            if (!closeTabCallbackRef.current) {
                closeTabCallbackRef.current = (e) => {
                    return (e.returnValue = true);
                };
                window.addEventListener(
                    'beforeunload',
                    closeTabCallbackRef.current,
                    { capture: true }
                );
            }
        } else {
            if (closeTabCallbackRef.current) {
                window.removeEventListener(
                    'beforeunload',
                    closeTabCallbackRef.current,
                    { capture: true }
                );
                closeTabCallbackRef.current = null;
            }
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (closeTabCallbackRef.current) {
                window.removeEventListener(
                    'beforeunload',
                    closeTabCallbackRef.current,
                    { capture: true }
                );
            }
        };
    }, []);

    return (
        <DialogControl
            ref={rootRef}
            forwardedRef={ref}
            closeButtonViewMode={'externalWide'}
            headerBackgroundStyle={'unaccented'}
            draggable={true}
            headerContentTemplate={HeaderContentTemplate}
            bodyContentTemplate={BodyContentTemplate}
            dialogPosition={undefined}
            onClose={onClose}
            customEvents={['onClose']}
            data-qa='controls_SiteEditorBase_panel'
            className={`controls_objectEditorPopup_WidgetPanel ${props.className || ''}`}
        />
    );
});

const ObjectEditorPopupMemo = memo(ObjectEditorPopup);

// Для того, чтобы можно было использовать компонент в качестве шаблона окна
// @ts-ignore
ObjectEditorPopupMemo.isReact = true;
export default ObjectEditorPopupMemo;
