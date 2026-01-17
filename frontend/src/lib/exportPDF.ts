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

    // Calculate image dimensions to fit on A4, maintaining aspect ratio
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    // We add a tiny bit of padding if needed, but here we fill the width
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

    // Save the PDF
    pdf.save(fileName);
};
