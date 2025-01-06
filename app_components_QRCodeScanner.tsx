'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRCodeScannerProps {
  onScan: (url: string) => void
}

export default function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('reader')

    const startScanner = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText)
            stopScanner()
          },
          (errorMessage) => {
            console.warn(errorMessage)
          }
        )
      } catch (err) {
        setError('Failed to start scanner. Please check camera permissions.')
        console.error(err)
      }
    }

    const stopScanner = async () => {
      try {
        if (scannerRef.current?.isScanning) {
          await scannerRef.current?.stop()
        }
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }

    startScanner()

    return () => {
      stopScanner()
    }
  }, [onScan])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div>
      <div id="reader" className="w-96 h-96"></div>
      <p className="mt-4 text-center">Position the QR code within the frame to scan</p>
    </div>
  )
}

