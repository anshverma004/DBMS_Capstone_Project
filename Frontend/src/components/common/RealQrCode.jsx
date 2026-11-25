import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function RealQrCode({
    value,
    size = 140,
    className = '',
    alt = 'Scannable QR Code'
}) {
    const [dataUrl, setDataUrl] = useState('');

    useEffect(() => {
        let active = true;
        if (!value) {
            setDataUrl('');
            return undefined;
        }
        QRCode.toDataURL(String(value), {
            width: size * 2,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#0f172a',
                light: '#ffffff'
            }
        })
            .then((url) => {
                if (active) setDataUrl(url);
            })
            .catch(() => {
                if (active) setDataUrl('');
            });

        return () => {
            active = false;
        };
    }, [value, size]);

    if (!dataUrl) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`bg-white/90 rounded-lg animate-pulse ${className}`}
            />
        );
    }

    return (
        <img
            src={dataUrl}
            alt={alt}
            width={size}
            height={size}
            className={`block rounded-lg bg-white ${className}`}
        />
    );
}
