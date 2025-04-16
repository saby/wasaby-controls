import { useCallback, useMemo } from 'react';
import { ObjectMeta, WidgetMeta } from 'Meta/types';

const SYSTEM_PROPERTIES = ['.style'];

type ExpandValue<T extends object> = (value: T) => T;
type FoldValue<T extends object> = (value: T) => T;
type SystemPropMap = Record<string, Set<string>>;

function getEmptySystemPropMap(): SystemPropMap {
    return SYSTEM_PROPERTIES.reduce<SystemPropMap>((result, name) => {
        result[name] = new Set();
        return result;
    }, {});
}

/**
 * Выносит системные свойства на один уровень с обычными.
 */
export function useSystemProperties<T extends object>(
    metaType: ObjectMeta | undefined
): [ObjectMeta, ExpandValue<T>, FoldValue<T>] {
    const expandingEnabled = metaType instanceof WidgetMeta;
    const [expandedMeta, sysPropMap] = useMemo(() => {
        if (!expandingEnabled) {
            return [metaType, undefined];
        }

        if (!metaType) {
            return [];
        }

        return expandSystemMeta(metaType);
    }, [expandingEnabled, metaType]);

    const expandValue: ExpandValue<T> = useCallback(
        (value: T) => {
            if (!expandingEnabled || !sysPropMap) {
                return value;
            }

            return expandSystemValue<T>(value, sysPropMap);
        },
        [expandingEnabled, sysPropMap]
    );

    const foldValue: FoldValue<T> = useCallback(
        (value: T) => {
            if (!expandingEnabled || !sysPropMap) {
                return value;
            }

            return foldSystemValue<T>(value, sysPropMap);
        },
        [expandingEnabled, sysPropMap]
    );

    return [expandedMeta as ObjectMeta, expandValue, foldValue];
}

/**
 * Возвращает объект,
 * в котором значения системных свойств вынесены на уровень к остальным свойствам.
 */
function expandSystemValue<T extends object>(initValue: T, sysPropMap: SystemPropMap): T {
    const value: Record<string, unknown> = {};

    for (const [propName, propValue] of Object.entries(initValue)) {
        const systemProperties = sysPropMap[propName];

        if (systemProperties) {
            for (const [sysName, sysValue] of Object.entries(propValue)) {
                value[sysName] = sysValue;
                systemProperties.add(sysName);
            }
        } else {
            value[propName] = propValue;
        }
    }

    return value as T;
}

/**
 * Возвращает мета-тип,
 * в которого системные свойства вынесены на уровень к остальным свойствам.
 */
function expandSystemMeta(meta: WidgetMeta): [WidgetMeta, SystemPropMap] {
    const sysPropMap = getEmptySystemPropMap();
    const properties = meta.getProperties() as Record<string, unknown>;

    for (const [propName, pValue] of Object.entries(properties)) {
        const systemProperties = sysPropMap[propName];

        if (systemProperties) {
            const propValue = pValue as ObjectMeta;
            const systemProps = propValue.getProperties();
            properties[propName] = propValue.hidden();

            for (const [sysName, sysValue] of Object.entries(systemProps)) {
                if ((sysValue as ObjectMeta).isVisible()) {
                    properties[sysName] = sysValue;
                    systemProperties.add(sysName);
                }
            }
        }
    }

    const metaCopy = meta.properties(properties as object).styles({}) as WidgetMeta;

    return [metaCopy, sysPropMap];
}

/**
 * Возвращает объект,
 * в котором значения системных свойств свернуты в одно свойство с системным именем.
 */
function foldSystemValue<T extends object>(expandedValue: T, sysPropMap: SystemPropMap): T {
    const value: Record<string, unknown> = {};

    for (const [propName, propValue] of Object.entries(expandedValue)) {
        const [sysName, systemProperties] =
            Object.entries(sysPropMap).find(([, set]) => set.has(propName)) || [];

        if (sysName && systemProperties) {
            let systemObj = value[sysName] as Record<string, unknown>;

            if (!systemObj) {
                systemObj = {};
                value[sysName] = systemObj;
            }

            systemObj[propName] = propValue;
        } else {
            value[propName] = propValue;
        }
    }

    return value as T;
}
