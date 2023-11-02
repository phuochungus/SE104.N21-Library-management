
function createdDateSort(rowA, rowB) {
    const a = new Date(rowA.createdDate)
    const b = new Date(rowB.createdDate)

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
}
function borrowDateSort(rowA, rowB) {
    const a = new Date(rowA.borrowDate)
    const b = new Date(rowB.borrowDate)

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
}
function returnDateSort(rowA, rowB) {
    const a = new Date(rowA.returnDate)
    const b = new Date(rowB.returnDate)

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
}

function percenSort(rowA, rowB) {
    const a = Number(rowA.percentage)
    const b = Number(rowB.percentage)

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
}
export { createdDateSort, borrowDateSort, returnDateSort, percenSort }