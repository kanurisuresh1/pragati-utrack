import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Base64ImageConstants } from './image_constants';

export class PdfUtils {
    static downloadPdf(pdfTitle: string, columns: String[], rowData: String[][], pdfName: string) {
        const doc = new jsPDF('landscape', 'pt', 'a4');
        doc.addImage(Base64ImageConstants.ramkiLogo, 650, 10);
        doc.addImage(Base64ImageConstants.uTrackLogoWithoutBG, 65, 10);
        doc.setFontSize(18);
        doc.text(pdfTitle, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(100);
        (doc as any).autoTable(columns, rowData, { margin: { top: 75 }, height: 'auto' });
        doc.save(pdfName + '.pdf');
    }
}
