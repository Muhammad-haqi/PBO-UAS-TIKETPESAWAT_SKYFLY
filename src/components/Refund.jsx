import { useState } from "react";

export default function Refund({ order, onCancel, onSubmit }) {
    const [reason, setReason] = useState("");
    const [kodeBooking, setKodeBooking] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // 🟢 RUMUS KODE BOOKING: "SKY-" ditambah ID pesanan
    const expectedKode = `SKY-${order.id}`;

    const handleConfirm = () => {
        // Validasi 1: Apakah alasan kosong?
        if (reason.trim() === "") {
            setErrorMsg("Alasan refund wajib diisi!");
            return;
        }

        // Validasi 2: Apakah Kode Booking sama persis dengan rumus?
        if (kodeBooking !== expectedKode) {
            setErrorMsg("Kode Booking tidak valid! Pembatalan ditolak.");
            return;
        }

        // Jika semua benar, hapus pesan error dan jalankan refund
        setErrorMsg("");
        onSubmit(reason);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Header Merah untuk Refund */}
                <div className="bg-red-50 p-5 border-b border-red-100">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                        ⚠️ Pembatalan Tiket
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Proses ini tidak dapat dibatalkan.
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Pesan Error (Muncul jika kode salah) */}
                    {errorMsg && (
                        <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg font-medium border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    {/* Info Tiket Singkat */}
                    <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-700">
                        <p>Penerbangan: <strong>{order.maskapai}</strong></p>
                        <p>Rute: {order.asal} ➔ {order.tujuan}</p>
                        {/* Petunjuk Kode Booking (Agar dosen/kamu gampang ngetesnya) */}
                        <p className="mt-2 pt-2 border-t text-xs text-gray-500">
                            *Petunjuk Simulasi: Kode Booking Anda adalah <span className="font-mono font-bold text-black">{expectedKode}</span>
                        </p>
                    </div>

                    {/* Input Kode Booking */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Masukkan Kode Booking
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: SKY-1"
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none uppercase font-mono"
                            value={kodeBooking}
                            onChange={(e) => setKodeBooking(e.target.value.toUpperCase())}
                        />
                    </div>

                    {/* Input Alasan */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Alasan Pembatalan
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Tuliskan alasan Anda di sini..."
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-md"
                    >
                        Batalkan Tiket
                    </button>
                </div>
            </div>
        </div>
    );
}