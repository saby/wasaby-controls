import * as rk from 'i18n!Controls';
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
const ObjectEditorPopup = forwardRef(
    <RuntimeInterface extends object>(
        props: IObjectEditorPopupProps<RuntimeInterface>,
        ref
    ) => {
        const { metaType, sort, value } = props;

        // TODO: разобраться с стостояниями value https://online.sbis.ru/opendoc.html?guid=cfd7cd75-4183-4626-bd3b-edbea199c7b9&client=3
        const [resetTrigger, setResetTrigger] = useState(false);
        const [changedValue, setChangedValue] = useState({ ...props.value });

        const initValueRef = useRef({ ...props.value });
        const closeTabCallbackRef =
            useRef<(event: BeforeUnloadEvent) => void>(null);

        const isValueUpdated = () => {
            return (
                JSON.stringify(initValueRef.current) !==
                JSON.stringify(changedValue)
            );
        };

        const onChange = (newValue) => {
            setChangedValue(newValue);
            props.onChange(newValue);
        };

        const reset = () => {
            const defaultValue = metaType.getDefaultValue();
            const newValue = {
                ...changedValue,
                ...defaultValue,
            };
            setChangedValue(newValue);
            props.onChange({ ...newValue });
            setResetTrigger((b) => {
                return !b;
            });
        };

        const setInitialValue = () => {
            props.onChange({ ...props.value });
        };

        const onClose = useCallback(async () => {
            if (!isValueUpdated()) {
                props.onClose();
                return;
            }

            const answer = await Confirmation.openPopup({
                message: rk('Сохранить изменения?'),
                type: 'yesnocancel',
            });

            if (answer) {
                props.onClose();
            } else if (answer === false) {
                setInitialValue();
                props.onClose();
            }
        }, [props.onClose, props.value]);

        const ScrollContentMemoized = useMemo(() => {
            return (
                <ObjectEditorPopupScrollContent
                    metaType={metaType}
                    sort={sort}
                    value={changedValue}
                    onChange={onChange}
                />
            );
        }, [resetTrigger, changedValue]); // Получает данные только при первом рендере (прочти доклет вначале файла)

        const BodyContentTemplate = useMemo(() => {
            return (
                <ScrollContainerControl
                    content={ScrollContentMemoized}
                    className="ObjectEditorPopup_Widget__scrollContainer"
                />
            );
        }, [resetTrigger]); // Получает данные только при первом рендере (прочти доклет вначале файла)

        const HeaderContentTemplate = useMemo(() => {
            return (
                <ObjectEditorPopupHeaderActions
                    onReset={reset}
                    onApply={props.onClose}
                    metaType={metaType}
                    value={changedValue}
                />
            );
        }, [props.onClose, changedValue, metaType]);

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
                forwardedRef={ref}
                headingCaption={props.metaType.getTitle()}
                headerBackgroundStyle={'unaccented'}
                headingFontColorStyle={'default'}
                headingFontSize={'xl'}
                draggable={true}
                headerContentTemplate={HeaderContentTemplate}
                bodyContentTemplate={BodyContentTemplate}
                dialogPosition={undefined}
                onClose={onClose}
                customEvents={['onClose']}
                data-qa="controls_SiteEditorBase_panel"
                className={`controls_objectEditorPopup_WidgetPanel ${
                    props.className || ''
                }`}
            />
        );
    }
);

const ObjectEditorPopupMemo = memo(ObjectEditorPopup);

// Для того, чтобы можно было использовать компонент в качестве шаблона окна
// @ts-ignore
ObjectEditorPopupMemo.isReact = true;
export default ObjectEditorPopupMemo;
