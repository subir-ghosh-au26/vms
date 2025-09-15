import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './Modal.css';

import instituteLogoGlossy from '../assets/logo-glossy.png';

const QRCodeModal = ({ isOpen, onClose, vehicle }) => {
    const ref = useRef(null);
    const [qrCodeInstance, setQrCodeInstance] = useState(null);

    useEffect(() => {
        if (isOpen && vehicle && ref.current) {
            if (!qrCodeInstance) {
                const qrCode = new QRCodeStyling({
                    width: 300,
                    height: 300,
                    data: vehicle.qr_code_id,
                    margin: 10,
                    qrOptions: {
                        errorCorrectionLevel: 'H',
                    },
                    dotsOptions: {
                        color: '#000000',
                        type: 'dots',
                    },

                    cornersSquareOptions: {
                        color: '#000000',
                        type: 'square',
                    },
                    cornersDotOptions: {
                        color: '#000000',
                        type: 'square',
                    },
                    // --- THE KEY LOGIC FOR THE OVERLAY EFFECT ---
                    image: instituteLogoGlossy,
                    imageOptions: {

                        hideBackgroundDots: false,
                        imageSize: 1.5,
                        margin: 0.2,
                    },
                });

                ref.current.innerHTML = '';
                qrCode.append(ref.current);
                setQrCodeInstance(qrCode);
            } else {
                qrCodeInstance.update({
                    data: vehicle.qr_code_id,
                });
            }
        }
    }, [isOpen, vehicle, qrCodeInstance]);

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