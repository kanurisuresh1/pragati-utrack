import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Base64ImageConstants } from './image_constants';

export class ExcelUtils {

    static downloadExcel(columnHeaders: string[], TitleDates: string, MainTitle: string, rowData: String[][],
        excelName: string) {

        const columns = columnHeaders;
        const workbook = new Workbook();
        const worksheets = workbook.addWorksheet('Utrack');

        const myLogoImage = workbook.addImage({
            base64: Base64ImageConstants.uTrackLogoWithBG,
            extension: 'png',
        });

        const ramkiLogo = workbook.addImage({
            base64: Base64ImageConstants.ramkiLogo,
            extension: 'png',
        });

        worksheets.mergeCells('A1:B3');
        worksheets.addImage(myLogoImage, 'A1:B3');

        worksheets.mergeCells('G1:H3');
        worksheets.addImage(ramkiLogo, 'G1:H3');

        worksheets.mergeCells('C1', 'F2');

        const titleRow = worksheets.getCell('C1');
        titleRow.value = MainTitle;
        titleRow.font = {
            name: 'Calibri',
            size: 18,
            underline: 'single',
            bold: true,
            color: { argb: '0085A3' },
        };
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheets.mergeCells('C3', 'F3');
        const startToendData = worksheets.getCell('C3');
        startToendData.value = TitleDates;
        startToendData.font = {
            name: 'Calibri',
            size: 18,
            underline: 'single',
            bold: true,
            color: { argb: '0085A3' },
        };
        startToendData.alignment = { vertical: 'middle', horizontal: 'center' };


        worksheets.addRow([]);

        const headerRow = worksheets.addRow(columns);
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4167B8' },
                bgColor: { argb: '' },
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 14,
            };

            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' },
            };
        });

        rowData[0].forEach(data => {
            worksheets.addRow(data);
        });

        for (const [i, v] of columns.entries()) {
            switch (v.length) {
                case 2: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 3: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 4: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 5: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 6: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 7: worksheets.getColumn(i + 1).width = 5;
                    break;
                case 8: worksheets.getColumn(i + 1).width = 10;
                    break;
                case 9: worksheets.getColumn(i + 1).width = 12;
                    break;
                case 10: worksheets.getColumn(i + 1).width = 12;
                    break;
                case 11: worksheets.getColumn(i + 1).width = 15;
                    break;
                case 12: worksheets.getColumn(i + 1).width = 15;
                    break;
                case 13: worksheets.getColumn(i + 1).width = 23;
                    break;
                case 14: worksheets.getColumn(i + 1).width = 23;
                    break;
                case 15: worksheets.getColumn(i + 1).width = 23;
                    break;
                case 16: worksheets.getColumn(i + 1).width = 24;
                    break;
                case 17: worksheets.getColumn(i + 1).width = 25;
                    break;
                case 18: worksheets.getColumn(i + 1).width = 25;
                    break;
                case 19: worksheets.getColumn(i + 1).width = 25;
                    break;
                case 20: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 21: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 22: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 23: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 24: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 25: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 26: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 27: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 28: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 29: worksheets.getColumn(i + 1).width = 35;
                    break;
                case 30: worksheets.getColumn(i + 1).width = 35;
                    break;
            }
        }


        // worksheets.getColumn(1).width = 5;
        // worksheets.getColumn(2).width = 15;
        // worksheets.getColumn(3).width = 34;
        // worksheets.getColumn(4).width = 25;
        // worksheets.getColumn(5).width = 23;
        // worksheets.getColumn(6).width = 23;
        worksheets.addRow([]);

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data],
                { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelName + '.xlsx');
        });

    }

}
