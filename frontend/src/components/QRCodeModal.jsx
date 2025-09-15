import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './Modal.css';
import instituteLogo from '../assets/logo.png';

const QRCodeModal = ({ isOpen, onClose, vehicle }) => {
    const ref = useRef(null);
    const [qrCodeInstance, setQrCodeInstance] = useState(null);

    // This effect creates and updates the QR code whenever the modal is opened or the vehicle data changes.
    useEffect(() => {
        if (isOpen && vehicle && ref.current) {
            // If an instance doesn't exist, create one.
            if (!qrCodeInstance) {
                const qrCode = new QRCodeStyling({
                    width: 256,
                    height: 256,
                    data: vehicle.qr_code_id,
                    image: instituteLogo,
                    dotsOptions: {
                        color: '#002D62',
                        type: 'rounded',
                    },
                    cornersSquareOptions: {
                        type: 'extra-rounded',
                        color: '#002D62',
                    },
                    imageOptions: {
                        imageSize: 0.4,
                        margin: 0.2,
                    },
                });

                // Clear the container and append the new QR code
                ref.current.innerHTML = '';
                qrCode.append(ref.current);
                setQrCodeInstance(qrCode); // Save the instance to state
            } else {
                // If an instance already exists, just update it with the new data
                qrCodeInstance.update({
                    data: vehicle.qr_code_id,
                    image: instituteLogo,
                });
            }
        }
    }, [isOpen, vehicle, qrCodeInstance]); // Rerun this effect when these dependencies change

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

                {/* This div is the container where the QR code will be rendered */}
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