import {
    createContext,
    memo,
    MutableRefObject,
    PropsWithChildren,
    useEffect,
    useMemo,
} from 'react';
import { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { EIndicatorState } from 'Controls/display';
import { useStableCallback } from 'Controls/hooks';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

const INDICATOR_DELAY = 2000;
export const INDICATOR_HEIGHT = 48;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIndicatorsContext {}

const Context = createContext<IIndicatorsContext>({});

export type TIndicatorContainerProps = PropsWithChildren<{
    viewModelState: IAbstractListState;
    listContainerRef: MutableRefObject<HTMLDivElement | null>;
}>;

const IndicatorContainer = memo(
    ({
        listContainerRef,
        children,
        viewModelState: { collection, loading },
    }: TIndicatorContainerProps) => {
        const value = useMemo<IIndicatorsContext>(() => ({}), []);

        const onGlobalShown = useStableCallback(() => {
            if (!collection || collection.destroyed) {
                return;
            }

            collection.nextVersion();
            collection.displayIndicator(
                'global',
                EIndicatorState.Loading,
                countGlobalIndicatorPosition(listContainerRef)
            );
        }, [collection]);

        const onGlobalHide = useStableCallback(() => {
            if (!collection || collection.destroyed || !collection.getGlobalIndicator()) {
                return;
            }

            collection.nextVersion();
            collection.hideIndicator('global');
        }, [collection]);

        const globalToggler = useMemo<DelayedToggler>(
            () => new DelayedToggler(onGlobalShown, onGlobalHide),
            [onGlobalHide, onGlobalShown]
        );

        useEffect(() => {
            if (loading) {
                if (!isLoaded(LibPaths.Sticky)) {
                    loadAsync(LibPaths.Sticky);
                }
                globalToggler.startShow();
            } else {
                globalToggler.hide();
            }
        }, [globalToggler, loading]);

        return <Context.Provider value={value} children={children} />;
    }
);

function countGlobalIndicatorPosition(
    listContainerRef: MutableRefObject<HTMLDivElement | null>
): number {
    const scrollContainer = listContainerRef.current?.closest('.controls-Scroll-ContainerBase') as
        | HTMLDivElement
        | undefined;

    const scrollTop = scrollContainer?.scrollTop || 0;
    const contentHeight = listContainerRef.current?.clientHeight || 0;
    const viewportHeight = scrollContainer?.clientHeight || contentHeight;

    const stickyHeadersSize =
        listContainerRef.current && scrollTop !== 0
            ? loadSync<typeof import('Controls/stickyBlock')>(
                  LibPaths.Sticky
              ).getStickyHeadersHeight(listContainerRef.current, 'top', 'allFixed') || 0
            : 0;

    const viewportSize =
        !!viewportHeight && viewportHeight < contentHeight
            ? viewportHeight - stickyHeadersSize
            : contentHeight;

    return Math.max(scrollTop + viewportSize / 2 - INDICATOR_HEIGHT / 2, 0);
}

class DelayedToggler {
    private _timerId: number | null = null;
    private _isShown: boolean = false;

    constructor(
        private _onShow: () => void,
        private _onHide: () => void
    ) {}

    startShow() {
        if (this._timerId !== null || this._isShown) {
            return;
        }
        this._timerId = setTimeout(() => {
            this._timerId = null;
            this._show();
        }, INDICATOR_DELAY) as unknown as number;
    }

    hide() {
        const wasShown = this._isShown;
        const wasPlanned = this._timerId !== null;

        if (wasPlanned) {
            clearTimeout(this._timerId as number);
            this._timerId = null;
        }

        if (wasShown) {
            this._isShown = false;
            this._onHide();
        }
    }

    private _show() {
        this._isShown = true;
        this._onShow();
    }
}

export { IndicatorContainer };
export default IndicatorContainer;
