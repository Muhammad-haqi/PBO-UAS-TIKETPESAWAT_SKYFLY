import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingCart, Clock, Trash2, CheckCircle, Ticket } from 'lucide-react';

const getToken = () => localStorage.getItem("userToken") || null;

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        // 1. Cek Token dan Role (Frontend Guard)
        if (!token || userInfo.role !== 'admin') {
            alert("Akses Admin ditolak atau sesi berakhir. Silakan login sebagai Admin.");
            localStorage.removeItem("userToken");
            localStorage.removeItem("userInfo");
            navigate("/login");
            return;
        }

        const fetchAllOrders = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 2. Panggil route admin
                const res = await fetch(`https://pbo-skyfly-backend-production.up.railway.app/api/pesanan/admin/all`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}` 
                    }
                });

                if (res.status === 401 || res.status === 403) {
                    throw new Error("Akses ditolak atau sesi berakhir.");
                }
                
                const data = await res.json();
                
                if (data.success) {
                    setOrders(data.data);
                } else {
                    setError(data.error || "Gagal mengambil data admin.");
                }

            } catch (err) {
                console.error("Fetch Admin Orders Error:", err);
                setError(err.message || "Terjadi kesalahan koneksi.");
                if (err.message.includes("Akses ditolak")) {
                     localStorage.removeItem("userToken");
                     localStorage.removeItem("userInfo");
                     navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [navigate]);

    // ==========================================
    // LOGIKA PERHITUNGAN KARTU STATISTIK
    // ==========================================
    const totalPesanan = orders.length;
    const totalPendapatan = orders
        .filter(o => o.paid) // Hanya hitung yang sudah lunas
        .reduce((sum, o) => sum + (o.total || 0), 0);
    const pesananTertunda = orders.filter(o => !o.paid).length;

    // ==========================================
    // FUNGSI AKSI (HAPUS & KONFIRMASI)
    // ==========================================
    const handleAction = async (action, id) => {
        if (action === 'Hapus') {
            const konfirmasi = window.confirm(`Apakah kamu yakin ingin menghapus pesanan dengan ID: #${id}?`);
            if (!konfirmasi) return;

            try {
                const token = getToken();
                const response = await fetch(`https://pbo-skyfly-backend-production.up.railway.app/api/pesanan/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert("Data pesanan berhasil dihapus!");
                    // Update state orders agar baris tabel langsung hilang tanpa reload halaman
                    setOrders(prevOrders => prevOrders.filter(o => o.id !== id));
                } else {
                    alert("Gagal menghapus data. Pastikan endpoint di backend sudah benar.");
                }
            } catch (error) {
                console.error("Error menghapus data:", error);
                alert("Terjadi kesalahan jaringan.");
            }
        } else if (action === 'Konfirmasi') {
            alert(`Aksi [Konfirmasi] untuk ID Pesanan: ${id} belum dihubungkan ke backend.`);
            // Nanti bisa ditambahkan logika fetch metode PUT/PATCH di sini
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
                <p className="mt-4 text-blue-800 font-semibold animate-pulse">Memuat Pusat Kendali Admin...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 font-bold bg-red-50 min-h-screen">Error: {error}</div>;
    }

    return (
        <section className="min-h-screen bg-[#F4F7FE] py-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* HEADER */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Kelola semua transaksi tiket SkyFly secara real-time.</p>
                    </div>
                    <div className="bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        Sistem Online
                    </div>
                </div>

                {/* SUMMARY CARDS (STATISTIK) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Card 1: Pendapatan */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                            <DollarSign size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Pendapatan (Lunas)</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                Rp {totalPendapatan.toLocaleString('id-ID')}
                            </h3>
                        </div>
                    </div>

                    {/* Card 2: Total Pesanan */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <Ticket size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Pesanan Masuk</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                {totalPesanan} <span className="text-base font-normal text-gray-500">Tiket</span>
                            </h3>
                        </div>
                    </div>

                    {/* Card 3: Tertunda */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <Clock size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Menunggu Pembayaran</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                                {pesananTertunda} <span className="text-base font-normal text-gray-500">Pesanan</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* DATA TABLE SECTION */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-blue-600" />
                            Daftar Semua Transaksi
                        </h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            <Ticket size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-lg font-medium">Belum ada pesanan yang masuk.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold border-b">ID</th>
                                        <th className="px-6 py-4 font-semibold border-b">Pemesan</th>
                                        <th className="px-6 py-4 font-semibold border-b">Rute & Maskapai</th>
                                        <th className="px-6 py-4 font-semibold border-b">Total Bayar</th>
                                        <th className="px-6 py-4 font-semibold border-b text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold border-b text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((o) => (
                                        <tr key={o.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                                #{o.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{o.namaPemesan}</div>
                                                <div className="text-xs text-gray-500">User ID: {o.userId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{o.asal} → {o.tujuan}</div>
                                                <div className="text-xs text-gray-500">{o.maskapai}</div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {o.totalFormatted || `Rp ${o.total?.toLocaleString('id-ID')}`}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                    o.paid 
                                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                                                }`}>
                                                    {o.paid ? 'LUNAS' : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex justify-center gap-2">
                                                {/* Tombol Aksi Dummy */}
                                                {!o.paid && (
                                                    <button onClick={() => handleAction('Konfirmasi', o.id)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Konfirmasi Manual">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleAction('Hapus', o.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Hapus Pesanan">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}