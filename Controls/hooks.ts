// Библиотека с хуками
import { useHandler, useHandlerSafe } from 'Controls/_hooks/useHandler';

export {
    useHandler,
    useHandler as useStableCallback,
    useHandlerSafe,
    useHandlerSafe as useStableCallbackSafe,
};
export { usePreviousProps } from 'Controls/_hooks/usePreviousProps';
export { useDependencyLoader } from 'Controls/_hooks/useDependencyLoader';
export { useDeprecatedStore } from 'Controls/_hooks/useDeprecatedStore';
