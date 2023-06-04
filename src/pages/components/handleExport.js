import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

export default function handleExport(data, sheetName = "Thống kê", bookName = "Báo cáo") {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data.map((ele) => {
        const { STT, ...rest } = ele
        return rest
    }))
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    // Generate the XLSX file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Convert the buffer to a Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save the file using FileSaver.js
    FileSaver.saveAs(blob, `${bookName}.xlsx`);
}