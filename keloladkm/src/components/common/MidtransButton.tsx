import React, { useEffect } from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface MidtransButtonProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

/**
 * Midtrans Snap payment button.
 * Loads Midtrans Snap SDK dynamically and opens the payment popup.
 * Falls back gracefully if Midtrans is not configured.
 */
export const MidtransButton: React.FC<MidtransButtonProps> = ({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  itemName,
  onSuccess,
  onPending,
  onError,
  className = '',
}) => {
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '';

  useEffect(() => {
    if (!clientKey) return;
    // Dynamically load Midtrans Snap script
    const scriptId = 'midtrans-snap';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [clientKey]);

  const handlePay = () => {
    if (!clientKey) {
      alert('Midtrans payment gateway belum dikonfigurasi. Silakan hubungi admin DKM.');
      return;
    }

    const snap = (window as any).snap;
    if (!snap) {
      alert('Sistem pembayaran sedang dimuat. Silakan coba beberapa saat lagi.');
      return;
    }

    snap.pay(
      {
        transaction_details: { order_id: orderId, gross_amount: amount },
        customer_details: {
          first_name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        item_details: [{ id: orderId, price: amount, quantity: 1, name: itemName }],
      },
      {
        onSuccess: (result: any) => onSuccess?.(result),
        onPending: (result: any) => onPending?.(result),
        onError: (error: any) => onError?.(error),
        onClose: () => { /* user closed popup */ },
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all ${className}`}
    >
      {clientKey ? (
        <>
          <CreditCard className="w-4 h-4" />
          <span>Bayar via Midtrans</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-4 h-4" />
          <span>Donasi via Transfer Manual</span>
        </>
      )}
    </button>
  );
};

let globalOrderCounter = 0;

/**
 * Generate Midtrans order ID: DON-YYYYMMDD-XXXX
 */
export function generateMidtransOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  globalOrderCounter = (globalOrderCounter + 1) % 9000;
  const num = (1000 + globalOrderCounter);
  const randomSuffix = String(num).padStart(4, '0');
  return `DON-${dateStr}-${randomSuffix}`;
}
