import { ReactElement, useContext } from 'react';
import { EditorsHierarchyContext } from 'Controls-editors/_object-type/Contexts';

export default function TypeHierarchyPadding(): ReactElement {
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    return (
        <>
            {[...Array(hierarchyLevel || 0)].map(() => (
                <div className={'tw-inline-block controls-padding_left-xl'} />
            ))}
        </>
    );
}
