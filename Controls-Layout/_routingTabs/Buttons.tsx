import { ForwardedRef, forwardRef, ReactElement, useCallback, useContext, useMemo } from 'react';
import { RecordSet } from 'Types/collection';
import { lazy, importer } from 'UI/Async';
import {
    Buttons as TabButtons,
    buttonsItemTemplate as TabButtonsItemTemplate,
    ITabsButtonsOptions,
    ITabsTemplateOptions,
} from 'Controls/tabs';

import 'css!Controls-Layout/routingTabs';

// TODO выделить LayoutReference в отдельный компонент, т.к. позже будет использоваться в других местах
import { Reference } from 'Router/router';
import { getConfig } from 'Application/Env';
import { getBuildingContext } from 'Page/base';
import { ApplicationSettings } from 'Page/loaders';

interface IReferenceOptions {
    pageId: string;
    scopeId: string;
    state?: string;
    clear?: boolean;
    queryMask?: string;
    children: ReactElement;
}

const LayoutReference = forwardRef(
    (props: IReferenceOptions, ref: ForwardedRef<unknown>): JSX.Element => {
        const pageContext = useContext(getBuildingContext());
        const appScope = useMemo((): string => {
            return (
                pageContext.ApplicationSettingsController?.get('scope') ||
                ApplicationSettings.get('scope') ||
                'group'
            );
        }, [pageContext]);

        const resolveMask = useCallback(
            (mask: string = '', appRoot: string, queryMask?: string): string => {
                let state = mask;
                const scopeMask = `${appScope}/:scopeId/page/:pageId`;
                if (state.indexOf(scopeMask) === -1) {
                    state =
                        (appRoot !== '/' ? '' : '/') +
                        scopeMask +
                        (state && state[0] !== '/' ? '/' + state : state);
                }
                if (queryMask) {
                    state = `${state}${state.includes('?') ? '&' : '?'}${queryMask}`;
                }
                return state;
            },
            [appScope]
        );

        const refState = useMemo((): string => {
            if (!props.clear) {
                return resolveMask(props.state as string, getConfig('appRoot'), props.queryMask);
            } else {
                return props.state as string;
            }
        }, [props.state, props.queryMask]);
        return (
            <Reference ref={ref} {...props} state={refState}>
                {props.children}
            </Reference>
        );
    }
);

interface IButtonsProps extends ITabsButtonsOptions, Pick<ITabsTemplateOptions, 'animationMode'> {
    tabs: RecordSet;
    selectedTabItemKey: string;
    scopeId?: string;
    tabSpaceTemplate?: ReactElement;
    className?: string;
}

const DATA_ID = 'sabyPage-tabs';
const LazyCounter = lazy(() => importer('NavigationPanels/counter'));
const LazyPreloader = lazy(() => importer('Page/base:Preloader'));

// обертка над <a>, чтоб не было ошибки react внутри Reference по поводу onMouseOverCallback
// https://online.sbis.ru/opendoc.html?guid=82fc59da-d0ac-4774-baab-c9b353cb22e1&client=3
const Link = forwardRef((props, ref: ForwardedRef<unknown>) => {
    const clearProps = {
        ...props,
    };
    delete clearProps.onMouseOverCallback;
    return <a ref={ref} {...clearProps} />;
});

function TabItemTemplate(props): JSX.Element {
    return (
        <LazyPreloader pageId={props.item.get('pageId')}>
            <TabItemTemplateInner {...props} />
        </LazyPreloader>
    );
}

// Обертка над контентом Preloader-а, т.к. он на wasaby и нужно прокинуть ref
//  TODO удалить после https://online.sbis.ru/opendoc.html?guid=eef18ae6-dfef-4f69-92ba-170d41e626ae&client=3
const TabItemTemplateInner = forwardRef((props, ref: ForwardedRef<unknown>): JSX.Element => {
    return (
        <LayoutReference
            ref={ref}
            keepQuery={true}
            recalcUrlBeforeNavigate={true}
            scopeId={props.scopeId}
            pageId={props.item.get('pageId')}
            item={props.item}
            className={
                'ws-flexbox ws-align-items-center controls-Layout-Tabs__item ' + props.className
            }
            data-qa={props['data-qa']}
        >
            <Link>
                {props.item.get('counterName') ? (
                    <div className="controls-Layout-Tabs__itemWrapper">
                        <TabButtonsItemTemplate
                            inlineHeight={props.inlineHeight}
                            mobilePrefix={props.mobilePrefix}
                            item={props.item}
                            displayProperty="title"
                        ></TabButtonsItemTemplate>
                        <LazyCounter
                            className="controls-Layout-Tabs__counter NavigationPanels-Counter__tabs_counter"
                            counterName={props.item.get('counterName')}
                            mapping={props.item.get('counterCfg')?.mapping}
                            tooltip={props.item.get('counterCfg')?.tooltip}
                            sum={props.item.get('counterCfg')?.sum}
                        ></LazyCounter>
                    </div>
                ) : (
                    <TabButtonsItemTemplate
                        inlineHeight={props.inlineHeight}
                        mobilePrefix={props.mobilePrefix}
                        item={props.item}
                        displayProperty="title"
                    ></TabButtonsItemTemplate>
                )}
            </Link>
        </LayoutReference>
    );
});

/**
 * Отображение табов с навигацией в раскладках
 * @public
 * @author Клепиков И.А.
 */
const Buttons = forwardRef((props: IButtonsProps, ref: ForwardedRef<unknown>): JSX.Element => {
    return (
        <div ref={ref} style={{ display: 'contents' }}>
            <TabButtons
                className={props.className || ''}
                data-qa={DATA_ID}
                data-name={DATA_ID}
                selectedKey={props.selectedTabItemKey}
                keyProperty="id"
                inlineHeight={props.inlineHeight || 's'}
                markerThickness="s"
                separatorVisible={false}
                animationMode={props.animationMode}
                borderVisible={props.borderVisible || false}
                items={props.tabs}
                tabSpaceTemplate={props.tabSpaceTemplate}
                horizontalPadding={props.horizontalPadding}
                itemTemplate={(itemProps) => {
                    return (
                        <TabItemTemplate scopeId={props.scopeId} {...itemProps}></TabItemTemplate>
                    );
                }}
            ></TabButtons>
        </div>
    );
});

export default Buttons;
