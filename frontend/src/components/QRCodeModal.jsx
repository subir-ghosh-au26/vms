import React from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import './Modal.css';
import instituteLogo from '../assets/logo.png';

const QRCodeModal = ({ isOpen, onClose, vehicle }) => {
    if (!isOpen || !vehicle) {
        return null;
    }

    const qrCodeImageSettings = {
        src: instituteLogo,
        height: 48,
        width: 48,
        excavate: true,
    };

    const handlePrint = () => {
        // 1. Find the canvas element that qrcode.react creates
        const canvas = document.getElementById('qr-code-canvas');

        // 2. Find the extra text info we want to print
        const vehicleInfo = document.getElementById('qr-vehicle-info');

        if (canvas && vehicleInfo) {
            // 3. Convert the canvas to a PNG image data URL
            const qrImageURL = canvas.toDataURL('image/png');

            // 4. Open a new window and construct the HTML for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print QR Code</title>');
            printWindow.document.write('<style> body { text-align: center; margin-top: 50px; font-family: sans-serif; } </style>');
            printWindow.document.write('</head><body>');

            // 5. Use an <img> tag with the data URL as the source
            printWindow.document.write(`<img src="${qrImageURL}" alt="QR Code" />`);

            // 6. Append the vehicle info HTML
            printWindow.document.write(vehicleInfo.innerHTML);

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus(); // Necessary for some browsers

            // Use a timeout to ensure the image has time to load before printing
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center' }}>
                <h2>QR Code for {vehicle.vehicle_number}</h2>

                {/* We wrap the printable content in a div for easier targeting */}
                <div id="qr-code-to-print">
                    <QRCode
                        id="qr-code-canvas" // Add an ID to the canvas for easy selection
                        value={vehicle.qr_code_id}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                        imageSettings={qrCodeImageSettings}
                    />
                    {/* We also give the text an ID */}
                    <div id="qr-vehicle-info">
                        <p style={{ marginTop: '10px' }}><strong>Model:</strong> {vehicle.model}</p>
                        <p><strong>Owner:</strong> {vehicle.owner_name || vehicle.department_name}</p>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-primary" onClick={handlePrint}>Print</button>
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;