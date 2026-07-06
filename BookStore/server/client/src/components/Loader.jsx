export function BookCardSkeleton() {
    return (
        <div className="book-card" style={{ pointerEvents: "none" }}>
            <div className="skeleton" style={{ height: 220 }} />
            <div className="book-body">
                <div className="skeleton mb-2" style={{ height: 12, width: "40%" }} />
                <div className="skeleton mb-1" style={{ height: 16, width: "90%" }} />
                <div className="skeleton mb-3" style={{ height: 14, width: "60%" }} />
                <div className="skeleton" style={{ height: 20, width: "30%" }} />
            </div>
            <div className="book-footer">
                <div className="skeleton" style={{ height: 34, borderRadius: 6 }} />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 4 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
            ))}
        </tr>
    );
}

export default BookCardSkeleton;
