export default function MainHeaderCell() {
    return (
        <div className={'ws-flex-column'} style={{ width: '100%' }}>
            <div className={'ws-flexbox ws-justify-content-between'}>
                <div>
                    <h4 className={'controls-text-label'}>Организация</h4>
                </div>
                <div>
                    <div className={'controls-text-label'}>Отправитель</div>
                    <div className={'controls-fontsize-xs'}>Под ним организация,</div>
                    <div className={'controls-fontsize-xs'}>с которой отправили</div>
                </div>
            </div>
        </div>
    );
}
