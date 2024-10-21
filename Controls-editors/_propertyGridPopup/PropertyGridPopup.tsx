import * as rk from 'i18n!Controls';
import { instanceOfModule } from 'Core/core-instance';
import { Button as ButtonControl } from 'Controls/buttons';
import { ObjectMeta } from 'Meta/types';
import {
    forwardRef,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Dialog as DialogControl } from 'Controls/popupTemplate';
import { Confirmation } from 'Controls/popup';
import { Container as ScrollContainerControl } from 'Controls/scroll';
import { IPropertyGridPopup } from './IPropertyGridPopup';
import PropertyGridPopupHeaderActions from './PropertyGridPopupHeaderActions';
import PropertyGridPopupScrollContent from './PropertyGridPopupScrollContent';
import { __notifyFromReact } from 'UI/Events';
import { EditorsProvider } from 'Controls-editors/object-type';
import 'css!Controls-editors/_propertyGridPopup/PropertyGridPopup';
import { default as PropertyGridContextProxy } from './PropertyGridContextProxy';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { Context } from 'Controls/Pending';

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

export const HEADER_PLACE_ORDER = -1;

/**
 * Реакт компонент, для отображения редактора объектов в диалоговом окне
 * @class Controls-editors/_propertyGridPopup/PropertyGridPopup
 * @public
 * @implements Controls-editors/_propertyGridPopup/IPropertyGridPopup
 * @implements Controls-editors/object-type/IObjectTypeEditorProps
 * @implements Types/meta/IPropertyEditorProps
 * @implements Controls-editors/_propertyGrid/IPropertyGrid
 * @demo Controls-demo/ObjectTypeEditor/BaseEditorsPopup/Index
 */
const PropertyGridPopup = forwardRef(
    <RuntimeInterface extends object>(props: IPropertyGridPopup<RuntimeInterface>, ref) => {
        const {
            metaType,
            sort,
            value,
            onClose,
            editorContext,
            dataContext,
            rootContext,
            autoSave = false,
            editorData,
        } = props;

        const title = metaType.getTitle();

        const [path, setPath] = useState<{ data?: unknown; meta?: unknown; path: [] }>({
            path: [],
        });

        const displayedMetaType: ObjectMeta<RuntimeInterface> = useMemo(() => {
            return path.meta ? path.meta : metaType;
        }, [metaType, path]);

        const headerEditorMeta = useMemo(() => {
            const atttrs = Object.entries(displayedMetaType.getProperties()).filter(([, meta]) => {
                return meta && meta.getOrder() === HEADER_PLACE_ORDER;
            });
            return atttrs.length
                ? displayedMetaType.properties(
                      atttrs.reduce((accum, entry) => ({ ...accum, [entry[0]]: entry[1] }), {})
                  )
                : undefined;
        }, [displayedMetaType, path]);

        const bodyEditorMeta = useMemo(() => {
            return displayedMetaType.properties(
                Object.entries(displayedMetaType.getProperties())
                    .filter(([, meta]) => {
                        return meta && meta.getOrder() !== HEADER_PLACE_ORDER;
                    })
                    .reduce((accum, entry) => ({ ...accum, [entry[0]]: entry[1] }), {})
            );
        }, [displayedMetaType, path]);

        // TODO: разобраться с стостояниями value https://online.sbis.ru/opendoc.html?guid=cfd7cd75-4183-4626-bd3b-edbea199c7b9&client=3
        const [changedValue, setChangedValue] = useState({ ...props.value });

        const displayedValue = useMemo(() => {
            return (
                path.path.reduce((value, propertyName) => {
                    let respValue = value[propertyName];
                    if (instanceOfModule(respValue, 'FrameEditor/base:EditingElementFacade')) {
                        respValue = respValue.getStaticProperties();
                    }
                    return respValue;
                }, changedValue) || changedValue
            );
        }, [changedValue, path]);

        useEffect(() => {
            setChangedValue(value);
        }, [value]);

        const closeTabCallbackRef = useRef<(event: BeforeUnloadEvent) => void>(null);

        const externalValueRef = useRef({ ...props.value });

        const isValueUpdated = useCallback(() => {
            return JSON.stringify(externalValueRef.current) !== JSON.stringify(changedValue);
        }, [changedValue]);

        const isValueUpdatedRef = useRef(isValueUpdated);

        const pendingResolveRef = useRef<(val?: unknown) => void>(null);

        const rootRef = useRef<DialogControl & { _container: HTMLDivElement }>(null);

        const context = useContext(Context);

        useEffect(() => {
            isValueUpdatedRef.current = isValueUpdated;
        }, [isValueUpdated]);

        useEffect(() => {
            if (autoSave) {
                return;
            }
            // TODO: Временное решение. Перейти на платформенное после решения задачи
            //  https://online.sbis.ru/opendoc.html?guid=7aee47d7-5d9a-4871-82fb-01cbaaa5fc4b&client=3
            context?.registerPending(
                new Promise((resolve) => {
                    pendingResolveRef.current = resolve;
                }),
                {
                    onPendingFail: async () => {
                        const cancelPending = () => {
                            context.cancelFinishingPending();
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
                            applyHandler();
                            confirmPending();
                        } else if (answer === false) {
                            setInitialValue();
                            confirmPending();
                        } else {
                            cancelPending();
                        }
                    },
                }
            );
        }, []);

        useEffect(() => {
            const observer = new ResizeObserverUtil(rootRef.current, () => {
                __notifyFromReact(rootRef.current?.getContainer?.(), 'controlResize', [], true);
            });

            if (rootRef.current) {
                observer.observe(rootRef.current?.getContainer?.());
            }

            return () => {
                observer.terminate();
            };
        }, []);

        const pathOnChange = useCallback(
            (newValue) => {
                setPath(newValue);
            },
            [setPath]
        );

        const onChange = useCallback(
            (newValue) => {
                const cloneObject = (obj) => {
                    if (Array.isArray(obj)) {
                        return [...obj];
                    } else if (instanceOfModule(obj, 'FrameEditor/base:EditingElementFacade')) {
                        return obj.modify();
                    } else {
                        return { ...obj };
                    }
                };
                const updateObject = (obj, newValue) => {
                    if (Array.isArray(obj)) {
                        return [...obj, ...newValue];
                    } else if (instanceOfModule(obj, 'FrameEditor/base:EditingElementFacade')) {
                        return obj.modify({ staticProperties: newValue });
                    } else {
                        return { ...newValue };
                    }
                };
                let nValue;
                if (path.path.length) {
                    nValue = { ...changedValue };
                    let currentObj = nValue;
                    for (const propertyName of path.path) {
                        const nextObject =
                            propertyName === path.path[path.path.length - 1]
                                ? updateObject(currentObj[propertyName], newValue)
                                : cloneObject(currentObj[propertyName]);
                        currentObj[propertyName] = nextObject;
                        currentObj = nextObject;
                    }
                } else {
                    nValue = newValue;
                }
                setChangedValue(nValue);
                if (autoSave) {
                    props.onChange(nValue);
                }
            },
            [props.onChange, autoSave, path]
        );

        // TODO: Временное решение в 23.3100. Уйдет после выполнения задачи: https://online.sbis.ru/opendoc.html?guid=8e0e17b1-aba4-4864-824b-06a3dfe75b11&client=3
        const filterHeaderValues = useCallback(
            (newValue) => {
                const headerMetaAttributes = headerEditorMeta?.getProperties();

                if (!headerMetaAttributes) {
                    return {};
                }

                return Object.entries(newValue).reduce((accum, entry) => {
                    if (entry[0] in headerMetaAttributes) {
                        return { ...accum, [entry[0]]: newValue[entry[0]] };
                    } else {
                        return accum;
                    }
                }, {});
            },
            [headerEditorMeta]
        );

        const headerChangedValueRef = useRef(filterHeaderValues(changedValue));

        const bodyOnChange = useCallback(
            (newValue) => {
                headerChangedValueRef.current = filterHeaderValues(newValue);
                onChange({ ...newValue, ...headerChangedValueRef.current });
            },
            [onChange, filterHeaderValues, path]
        );

        const headerOnChange = useCallback(
            (newValue) => {
                headerChangedValueRef.current = filterHeaderValues(newValue);
                onChange(newValue);
            },
            [onChange, filterHeaderValues, path]
        );

        const onReset = useCallback(
            (newValue) => {
                headerChangedValueRef.current = filterHeaderValues(newValue);
                onChange(newValue);
            },
            [onChange, filterHeaderValues, path]
        );

        const onBack = useCallback(() => {
            setPath({ path: [] });
        }, [setPath]);

        const setInitialValue = () => {
            props.onChange({ ...props.value });
        };

        const onApply = useCallback(() => {
            externalValueRef.current = changedValue;
            props.onChange(changedValue);
            props.onClose?.();
        }, [props.onClose, changedValue, props.onChange]);

        const onApplyRef = useRef(onApply);
        onApplyRef.current = onApply;

        const ScrollContentMemoized = useMemo(() => {
            return (
                <PropertyGridPopupScrollContent
                    metaType={bodyEditorMeta}
                    sort={sort}
                    value={displayedValue}
                    onChange={bodyOnChange}
                />
            );
        }, [displayedValue, bodyEditorMeta, bodyOnChange]); // Получает данные только при первом рендере (прочти доклет вначале файла)

        const applyHandler = useCallback(() => {
            onApplyRef.current();
        }, []);

        const BodyContentTemplate = useMemo(() => {
            return (
                <>
                    {!autoSave ? (
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
                    ) : null}
                    <ScrollContainerControl
                        content={ScrollContentMemoized}
                        className="ObjectEditorPopup_Widget__scrollContainer"
                    />
                </>
            );
        }, [applyHandler, ScrollContentMemoized, autoSave]); // Получает данные только при первом рендере (прочти доклет вначале файла)

        const HeaderContentTemplate = useMemo(() => {
            return (
                <PropertyGridPopupHeaderActions
                    onReset={onReset}
                    metaType={displayedMetaType}
                    value={displayedValue}
                    title={title}
                    headerEditorMeta={headerEditorMeta}
                    onChange={headerOnChange}
                    onBack={onBack}
                    isBackButtonVisible={!!path.path.length}
                />
            );
        }, [
            props.onClose,
            displayedValue,
            displayedMetaType,
            title,
            headerOnChange,
            headerEditorMeta,
        ]);

        useEffect(() => {
            if (isValueUpdated()) {
                if (!closeTabCallbackRef.current) {
                    closeTabCallbackRef.current = (e) => {
                        return (e.returnValue = true);
                    };
                    window.addEventListener('beforeunload', closeTabCallbackRef.current, {
                        capture: true,
                    });
                }
            } else {
                if (closeTabCallbackRef.current) {
                    window.removeEventListener('beforeunload', closeTabCallbackRef.current, {
                        capture: true,
                    });
                    closeTabCallbackRef.current = null;
                }
            }
        }, [value]);

        useEffect(() => {
            return () => {
                if (closeTabCallbackRef.current) {
                    window.removeEventListener('beforeunload', closeTabCallbackRef.current, {
                        capture: true,
                    });
                }
            };
        }, []);

        return (
            <PropertyGridContextProxy
                rootContext={rootContext}
                dataContext={dataContext}
                editorData={editorData}
                propertyGridContext={{ changePath: pathOnChange }}
            >
                <EditorsProvider value={editorContext}>
                    <DialogControl
                        ref={rootRef}
                        forwardedRef={ref}
                        closeButtonViewMode={autoSave ? 'external' : 'externalWide'}
                        headerBackgroundStyle={'unaccented'}
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
                </EditorsProvider>
            </PropertyGridContextProxy>
        );
    }
);

const ObjectEditorPopupMemo = memo(PropertyGridPopup);

// Для того, чтобы можно было использовать компонент в качестве шаблона окна
// @ts-ignore
ObjectEditorPopupMemo.isReact = true;
export default ObjectEditorPopupMemo;
