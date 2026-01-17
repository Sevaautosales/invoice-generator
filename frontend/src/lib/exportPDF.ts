import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures an HTML element and exports it as a high-fidelity PDF.
 * @param elementId The ID of the HTML element to capture.
 * @param fileName The name of the exported PDF file.
 */
export const exportElementToPDF = async (elementId: string, fileName: string = 'invoice.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found.`);
    }

    // Capture the element as a canvas
    // Using scale: 3 for high-fidelity (retina-like) resolution
    const canvas = await html2canvas(element, {
        scale: 4, // Increased to 4x for extreme sharpness, especially for logos
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 850,
        imageTimeout: 15000, // Increase timeout for image loading
        onclone: (clonedDoc) => {
            // Ensure all images in the cloned document are sharp
            const images = clonedDoc.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                images[i].style.imageRendering = 'pixelated';
            }
        }
    });

    const imgData = canvas.toDataURL('image/png');

    // Create jsPDF instance (A4 size)
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Page dimensions in mm: 210 x 297 (Standard A4)
    const margin = 10; // 10mm margin for professional look
    const availableWidth = pdfWidth - (margin * 2);

    // Calculate height based on aspect ratio
    const imgHeight = (canvas.height * availableWidth) / canvas.width;

    // Add image with margins
    pdf.addImage(imgData, 'PNG', margin, margin, availableWidth, imgHeight);

    // Save the PDF
    pdf.save(fileName);
};
