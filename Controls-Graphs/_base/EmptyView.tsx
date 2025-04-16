import 'css!Controls-Graphs/base';

export default function EmptyView({ className }: { className?: string }) {
    return (
        <div className={`controlsGraphs_base_emptyView ${className}`}>
            Отсутствуют данные для построения для графика.
        </div>
    );
}
