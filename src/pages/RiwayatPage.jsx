import { useEffect, useState } from "react";
import RiwayatItem from "../components/RiwayatItem";
import { useNavigate } from "react-router-dom";
import Refund from "../components/Refund";

// =================================================
// 🔑 UTILITY: Fungsi untuk mengambil Token JWT
// =================================================
const getToken = () => {
    try {
        return localStorage.getItem("userToken") || null;
    } catch (err) {
        return null;
    }
};

export default function RiwayatPage() {
    const [orders, setOrders] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");

    const [showRefundModal, setShowRefundModal] = useState(false);

    // Fungsi untuk mendapatkan data user yang sedang login untuk keperluan UI
    const getUserInfo = () => {
        try {
            return JSON.parse(localStorage.getItem("userInfo")) || {};
        } catch {
            return {};
        }
    };
    const userInfo = getUserInfo(); 

    // ======================================================
    // GET PESANAN USER (SUDAH DIPERBAIKI ANTI-BOCOR)
    // ======================================================
    useEffect(() => {
        const token = getToken();

        if (!token) { 
            alert("Silakan login dahulu.");
            navigate("/login");
            return;
        }

        // 🟢 AMBIL DATA FRESH TEPAT SEBELUM FETCH
        const freshUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
        console.log("Memuat riwayat untuk ID:", freshUser.id, "Nama:", freshUser.namaLengkap);

        // 🟢 GUNAKAN freshUser.id DI SINI
        fetch(`http://localhost:5000/api/pesanan/riwayat?userId=${freshUser.id}`, { 
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        })
        .then(async (res) => {
            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return { success: false, data: [] }; 
            }
            return res.json();
        })
        .then((data) => {
            setOrders(data.data || []);
        })
        .catch((err) => console.error("Error fetch orders:", err));
    }, [refreshKey, navigate]);

    const refresh = () => setRefreshKey((k) => k + 1);

    // ==========================
    // PEMBAYARAN
    // ==========================
    const handlePay = (order) => {
        setSelectedOrder(order);
        setPaymentMethod("");
        setShowPayModal(true);
    };

    const confirmPayment = async () => {
        if (!paymentMethod) return alert("Pilih metode pembayaran dahulu!");

        const token = getToken();
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        const payload = { ...selectedOrder };
        delete payload.id;
        delete payload.totalFormatted;
        delete payload.tanggalOrder;
        delete payload.refunded;
        delete payload.paymentMethod;

        payload.paid = true;
        payload.status = "Sudah dibayar";

        try {
             const res = await fetch(`http://localhost:5000/api/pesanan/${selectedOrder.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }
            
        } catch (error) {
            console.error("Error confirming payment:", error);
            alert("Gagal mengkonfirmasi pembayaran.");
            return;
        }

        setShowPayModal(false);
        refresh();
        alert("Pembayaran berhasil disimulasikan.");
    };

    // ==========================
    // EDIT & DELETE & REFUND
    // ==========================
    const handleEdit = (order) => {
        navigate("/pesan", { state: { editOrder: order } });
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

        const token = getToken(); 
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/pesanan/${id}`, {
                method: "DELETE",
                headers: {
                     "Authorization": `Bearer ${token}` 
                }
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }
            
        } catch (error) {
            console.error("Error deleting order:", error);
        }

        refresh();
    };

    const handleRefund = (order) => {
        setSelectedOrder(order);
        setShowRefundModal(true);
    };

    const confirmRefund = async (reason) => {
        const token = getToken();
        if (!token) {
            alert("Sesi Anda berakhir. Silakan login kembali.");
            navigate("/login");
            return;
        }

        const payload = { ...selectedOrder };

        delete payload.id;
        delete payload.totalFormatted;
        delete payload.tanggalOrder;
        delete payload.paymentMethod;
        delete payload.refunded;
        delete payload.refundReason;

        payload.status = "Refund Berhasil";
        payload.paid = false;

        try {
            const res = await fetch(`http://localhost:5000/api/pesanan/${selectedOrder.id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert("Sesi berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken");
                localStorage.removeItem("userInfo");
                navigate("/login");
                return;
            }

        } catch (error) {
             console.error("Error confirming refund:", error);
            alert("Gagal mengkonfirmasi refund.");
            return;
        }

        setShowRefundModal(false);
        refresh();
        alert("Refund berhasil.");
    };

    // ==========================
    // UI
    // ==========================
    if (!orders || orders.length === 0) {
        return (
            <section className="min-h-screen py-20 text-center text-gray-600">
                <p>Belum ada pemesanan.</p>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#F5F7FC] py-14">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-5 text-blue-800">
                    Riwayat Pemesanan Tiket
                </h2>

                {orders.map((o) => (
                    <RiwayatItem
                        key={o.id}
                        o={o}
                        onEdit={() => handleEdit(o)}
                        onDelete={handleDelete}
                        onPay={() => handlePay(o)}
                        onRefund={() => handleRefund(o)}
                    />
                ))}
            </div>

            {/* Modal Pembayaran */}
            {showPayModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[460px] rounded-xl shadow-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-blue-700">
                            Pembayaran Tiket
                        </h3>
                        <p className="text-sm text-gray-600">
                            Total Tagihan:{" "}
                            <span className="font-semibold text-green-700 text-lg">
                                {selectedOrder.totalFormatted || `Rp ${selectedOrder.total}`}
                            </span>
                        </p>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Pilih Metode Pembayaran:</p>

                            <select
                                className="w-full border rounded-lg p-2 bg-white"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">-- Silakan Pilih --</option>
                                <optgroup label="Bank Transfer">
                                    <option value="BCA">BCA Virtual Account</option>
                                    <option value="Mandiri">Mandiri Virtual Account</option>
                                    <option value="BRI">BRIVA (BRI)</option>
                                    <option value="BNI">BNI Virtual Account</option>
                                </optgroup>
                                <optgroup label="E-Wallet">
                                    <option value="GoPay">GoPay</option>
                                    <option value="Dana">Dana</option>
                                    <option value="OVO">OVO</option>
                                    <option value="ShopeePay">ShopeePay</option>
                                </optgroup>
                                <optgroup label="QRIS">
                                    <option value="QRIS">Scan QRIS (Semua Pembayaran)</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* --- KOTAK INFORMASI PEMBAYARAN DINAMIS --- */}
                        {paymentMethod && (
                            <div className="p-4 mt-2 border rounded-lg bg-gray-50 text-left">
                                <p className="font-medium text-sm mb-3 border-b pb-2 text-center">
                                    Instruksi Pembayaran
                                </p>

                                {/* 1. JIKA MEMILIH QRIS */}
                                {paymentMethod === "QRIS" && (
                                    <div className="text-center">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=SIMULASI-QRIS-SKYFLY"
                                            className="w-48 mx-auto rounded-lg shadow-sm mb-3"
                                            alt="QRIS"
                                        />
                                        <p className="text-sm text-gray-600">
                                            Buka aplikasi m-Banking atau e-Wallet Anda dan scan kode di atas.
                                        </p>
                                    </div>
                                )}

                                {/* 2. JIKA MEMILIH BANK BCA */}
                                {paymentMethod === "BCA" && (
                                    <div>
                                        <h4 className="mb-1 font-bold text-blue-800">Transfer Virtual Account BCA</h4>
                                        <div className="p-3 my-2 bg-white border rounded">
                                            <p className="text-xs text-gray-400">Nomor Virtual Account</p>
                                            <h2 className="text-xl font-bold tracking-widest text-gray-800">8077 {userInfo.identifier || "08123456"}</h2>
                                            <p className="mt-1 text-sm text-gray-600">Atas Nama: <span className="font-semibold text-gray-800">SKYFLY TIKET</span></p>
                                        </div>
                                        <ul className="pl-4 text-sm text-gray-600 list-decimal space-y-1">
                                            <li>Login ke m-BCA.</li>
                                            <li>Pilih <strong>m-Transfer</strong> &gt; <strong>BCA Virtual Account</strong>.</li>
                                            <li>Masukkan nomor Virtual Account di atas.</li>
                                            <li>Pastikan nominal tagihan sesuai.</li>
                                        </ul>
                                    </div>
                                )}

                                {/* 3. JIKA MEMILIH BANK MANDIRI */}
                                {paymentMethod === "Mandiri" && (
                                    <div>
                                        <h4 className="mb-1 font-bold text-yellow-600">Transfer Virtual Account Mandiri</h4>
                                        <div className="p-3 my-2 bg-white border rounded">
                                            <p className="text-xs text-gray-400">Kode Perusahaan (Biller Code)</p>
                                            <h2 className="text-lg font-bold text-gray-800">89022</h2>
                                            <p className="mt-2 text-xs text-gray-400">Nomor Virtual Account</p>
                                            <h2 className="text-xl font-bold tracking-widest text-gray-800">89022 {userInfo.identifier || "08123456"}</h2>
                                        </div>
                                        <ul className="pl-4 text-sm text-gray-600 list-decimal space-y-1">
                                            <li>Pilih menu <strong>Bayar</strong> &gt; <strong>SkyFly / Midtrans</strong>.</li>
                                            <li>Masukkan Nomor Virtual Account.</li>
                                        </ul>
                                    </div>
                                )}

                                {/* 4. JIKA MEMILIH BRI / BNI */}
                                {(paymentMethod === "BRI" || paymentMethod === "BNI") && (
                                    <div>
                                        <h4 className="mb-1 font-bold text-orange-600">Transfer Virtual Account {paymentMethod}</h4>
                                        <div className="p-3 my-2 bg-white border rounded">
                                            <p className="text-xs text-gray-400">Nomor VA {paymentMethod}</p>
                                            <h2 className="text-xl font-bold tracking-widest text-gray-800">1234 5678 {userInfo.identifier?.slice(-4) || "9012"}</h2>
                                        </div>
                                        <p className="text-sm text-gray-600">Gunakan aplikasi Mobile Banking Anda untuk menyelesaikan pembayaran ini.</p>
                                    </div>
                                )}

                                {/* 5. JIKA MEMILIH E-WALLET */}
                                {["GoPay", "Dana", "OVO", "ShopeePay"].includes(paymentMethod) && (
                                    <div className="text-center">
                                        <h4 className="mb-2 font-bold text-green-600">Pembayaran Otomatis {paymentMethod}</h4>
                                        <p className="text-sm text-gray-600 mb-3">Klik tombol Konfirmasi di bawah, aplikasi {paymentMethod} Anda akan otomatis terbuka.</p>
                                        <div className="p-3 bg-white border rounded shadow-sm inline-block mx-auto">
                                            <p className="text-xs text-gray-500 mb-1">Terhubung dengan akun:</p>
                                            <p className="font-bold text-gray-800">{userInfo.namaLengkap || "User SkyFly"}</p>
                                            <p className="text-sm text-gray-600">{userInfo.identifier || "0812-XXXX-XXXX"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowPayModal(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>

                            <button
                                onClick={confirmPayment}
                                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md font-medium"
                            >
                                Konfirmasi Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Refund */}
            {showRefundModal && selectedOrder && (
                <Refund
                    order={selectedOrder}
                    onCancel={() => setShowRefundModal(false)}
                    onSubmit={(reason) => confirmRefund(reason)}
                />
            )}
        </section>
    );
}