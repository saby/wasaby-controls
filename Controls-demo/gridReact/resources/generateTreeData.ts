import { TKey } from 'Controls/interface';

type TGenerateSimpleTreeDataProps = {
    count?: number;
    levelCount?: number;
    keyProperty: string;
    parentProperty: string;
    nodeProperty: string;
    itemFactory?: (key: TKey, parentKey: TKey, type: boolean | null, level: number) => object;
};

export function generateSimpleTreeData({
    count = 100,
    levelCount = 1,
    keyProperty,
    nodeProperty,
    parentProperty,
    itemFactory = () => ({}),
}: TGenerateSimpleTreeDataProps): object[] {
    const generate = (
        props: Required<TGenerateSimpleTreeDataProps> & {
            parentKey: TKey;
            level: number;
        }
    ) => {
        const data = [];

        for (let i = 0; i < props.count; i++) {
            const key = `${props.parentKey}_${i}`;
            const isLastLevel = props.level === props.levelCount - 1;
            const type = isLastLevel ? null: true;

            data.push({
                [props.keyProperty]: key,
                [props.parentProperty]: props.parentKey,
                [props.nodeProperty]: type,
                ...props.itemFactory(key, props.parentKey, type, props.level),
            });

            if (!isLastLevel) {
                data.push(
                    ...generate({
                        ...props,
                        parentKey: key,
                        level: props.level + 1,
                    })
                );
            }
        }

        return data;
    };

    return generate({
        count,
        levelCount,
        level: 0,
        keyProperty,
        nodeProperty,
        parentProperty,
        parentKey: null,
        itemFactory,
    });
}
