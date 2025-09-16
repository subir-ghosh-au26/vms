// src/components/QRCodeModal.jsx
import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './Modal.css';
import instituteLogo from '../assets/logo.png'; // Your standard logo

const QRCodeModal = ({ isOpen, onClose, vehicle }) => {
    const ref = useRef(null);
    const [qrCodeInstance, setQrCodeInstance] = useState(null);

    useEffect(() => {
        if (isOpen && vehicle && ref.current) {
            // Define the configuration for the QR code style
            const options = {
                width: 300,
                height: 300,
                data: vehicle.qr_code_id,
                margin: 10,
                qrOptions: {
                    errorCorrectionLevel: 'H',
                },
                dotsOptions: {
                    color: '#002D62', // A professional dark blue color
                    type: 'dots'
                },
                cornersSquareOptions: {
                    color: '#002D62',
                    type: 'extra-rounded',
                },
                cornersDotOptions: {
                    color: '#002D62',
                    type: 'extra-rounded',
                },
                image: instituteLogo,
                imageOptions: {
                    hideBackgroundDots: false,
                    imageSize: 0.5,
                    margin: 1,
                },
            };

            // Create a new instance if one doesn't exist
            if (!qrCodeInstance) {
                const qrCode = new QRCodeStyling(options);
                ref.current.innerHTML = ''; // Clear previous QR code
                qrCode.append(ref.current); // Append the new one
                setQrCodeInstance(qrCode);
            } else {
                // If an instance already exists, just update its options
                qrCodeInstance.update(options);
            }
        }
    }, [isOpen, vehicle, qrCodeInstance]); // Rerun effect when dependencies change

    const handleDownload = () => {
        if (qrCodeInstance) {
            qrCodeInstance.download({ name: `qr-${vehicle.vehicle_number}`, extension: 'png' });
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ textAlign: 'center' }}>
                <h2>QR Code for {vehicle.vehicle_number}</h2>

                {/* The container where the QR code canvas will be rendered */}
                <div ref={ref} />

                <p style={{ marginTop: '10px' }}><strong>Model:</strong> {vehicle.model}</p>
                <p><strong>Owner:</strong> {vehicle.owner_name || vehicle.department_name}</p>

                <div className="form-actions">
                    <button type="button" className="btn btn-primary" onClick={handleDownload}>Download QR</button>
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;