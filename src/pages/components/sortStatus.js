
export default function statusSort(rowA, rowB) {
    const a = rowA.Status.props.children
    const b = rowB.Status.props.children

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
}