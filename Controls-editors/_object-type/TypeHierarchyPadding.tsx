import { ReactElement, useContext } from 'react';
import { EditorsHierarchyContext } from 'Controls-editors/_object-type/Contexts';

export default function TypeHierarchyPadding(): ReactElement {
    const hierarchyLevel = useContext(EditorsHierarchyContext);
    return (
        <>
            {[...Array(hierarchyLevel || 0)].map((_, index) => {
                const key = `level_key_${index}`;
                return <div key={key} className={'tw-inline-block controls-padding_left-l'} />;
            })}
        </>
    );
}
