import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Phone, Mail, MapPin, Calendar, Plane, Users, Info, ChevronRight, Ticket, Armchair } from "lucide-react";

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

export default function PesanPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const orderToEdit = location.state?.editOrder ?? null; 
    const initialData = location.state?.initialData ?? null; 

    const [form, setForm] = useState({
        id: null,
        namaPemesan: "",
        nomorHp: "",
        email: "",
        maskapai: "",
        kelas: "",
        asal: "",
        tujuan: "",
        tanggalBerangkat: "",
        penumpang: 1,
        namaPenumpang: [""],
        kursi: [],
    });

    // --- Data Konfigurasi Tetap ---
    const maskapaiData = [
        { nama: "Lion Air", harga: 800000 },
        { nama: "Sriwijaya Air", harga: 950000 },
        { nama: "Garuda Indonesia", harga: 1500000 },
        { nama: "Pelita Air", harga: 1200000 },
    ];

    const kelasOptions = [
        { label: "Ekonomi", multiplier: 1 },
        { label: "Bisnis", multiplier: 1.8 },
        { label: "First Class", multiplier: 2.5 },
    ];

    const seatRows = 10;

    // ============================
    // LOGIKA MENGISI FORM (TIDAK BERUBAH)
    // ============================
    useEffect(() => {
        if (orderToEdit) {
            setForm({
                id: orderToEdit.id,
                namaPemesan: orderToEdit.namaPemesan || "",
                nomorHp: orderToEdit.nomorHp || "",
                email: orderToEdit.email || "",
                maskapai: orderToEdit.maskapai || "",
                kelas: orderToEdit.kelas || "",
                asal: orderToEdit.asal || "",
                tujuan: orderToEdit.tujuan || "",
                tanggalBerangkat: orderToEdit.tanggalBerangkat ? orderToEdit.tanggalBerangkat.slice(0, 10) : "", 
                penumpang: Number(orderToEdit.penumpang) || 1, 
                namaPenumpang: orderToEdit.namaPenumpang || [""], 
                kursi: orderToEdit.kursi || [],
            });
        }
    }, [orderToEdit]); 
    
    useEffect(() => {
        if (!orderToEdit && initialData) { 
            setForm((prevForm) => ({
                ...prevForm,
                asal: initialData.asal || prevForm.asal,
                tujuan: initialData.tujuan || prevForm.tujuan,
                maskapai: initialData.maskapai || prevForm.maskapai,
                kelas: initialData.kelas || prevForm.kelas,
            }));
        }
    }, [initialData, orderToEdit]);

    // ============================
    // Handle perubahan input (TIDAK BERUBAH)
    // ============================
    function handleChange(e) {
        let { name, value } = e.target;

        if (name === "penumpang") {
            const jumlah = Number(value) || 1;
            let namaArr = [...form.namaPenumpang];

            if (jumlah > namaArr.length) {
                while (namaArr.length < jumlah) namaArr.push("");
            } else {
                namaArr = namaArr.slice(0, jumlah);
            }

            setForm({
                ...form,
                penumpang: jumlah,
                namaPenumpang: namaArr,
                kursi: [],
            });
            return;
        }

        setForm({ ...form, [name]: value });
    }

    function handleNamaPenumpang(i, value) {
        const updated = [...form.namaPenumpang];
        updated[i] = value;
        setForm({ ...form, namaPenumpang: updated });
    }

    function toggleSeat(seat) {
        let selected = [...form.kursi];

        if (selected.includes(seat)) {
            selected = selected.filter((s) => s !== seat);
        } else {
            if (selected.length < form.penumpang) {
                selected.push(seat);
            } else {
                alert("Jumlah kursi sudah maksimal (sesuai jumlah penumpang)!");
                return;
            }
        }
        setForm({ ...form, kursi: selected });
    }

    // ============================
    // HANDLE SUBMIT (TIDAK BERUBAH)
    // ============================
    async function handleSubmit(e) {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            alert("Silakan login terlebih dahulu untuk melanjutkan.");
            navigate("/login");
            return;
        }

        if (form.kursi.length !== form.penumpang) {
            alert(`Silakan pilih ${form.penumpang} kursi terlebih dahulu!`);
            return;
        }

        const hargaMaskapai = maskapaiData.find((m) => m.nama === form.maskapai)?.harga || 0;
        const kelasMultiplier = kelasOptions.find((k) => k.label === form.kelas)?.multiplier || 1;
        const totalHarga = Math.round(hargaMaskapai * kelasMultiplier * form.penumpang);

        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        const order = {
            userId: userInfo.id,
            namaPemesan: form.namaPemesan,
            nomorHp: form.nomorHp,
            email: form.email,
            maskapai: form.maskapai,
            kelas: form.kelas,
            asal: form.asal,
            tujuan: form.tujuan,
            tanggalBerangkat: form.tanggalBerangkat,
            penumpang: form.penumpang,
            namaPenumpang: form.namaPenumpang,
            kursi: form.kursi,
            total: totalHarga,
            totalFormatted: `IDR ${totalHarga.toLocaleString("id-ID")}`,
            ...(orderToEdit && {
                paid: orderToEdit.paid,
                status: orderToEdit.status,
            }),
        };

        const method = orderToEdit ? "PUT" : "POST";
        const url = orderToEdit
            ? `https://pbo-skyfly-backend-production.up.railway.app/api/pesanan/${form.id}`
            : "https://pbo-skyfly-backend-production.up.railway.app/api/pesanan";

        const successMessage = orderToEdit ? "Perubahan pesanan berhasil disimpan!" : "Pemesanan berhasil!";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
                body: JSON.stringify(order),
            });
            
            if (res.status === 401) {
                alert("Sesi Anda berakhir. Silakan login kembali.");
                localStorage.removeItem("userToken"); 
                localStorage.removeItem("userInfo"); 
                navigate("/login");
                return;
            }

            const result = await res.json();

            if (result.success) {
                alert(successMessage);
                navigate("/riwayat");
            } else {
                alert(`Gagal ${orderToEdit ? "mengubah" : "membuat"} pesanan: ${result.error || result.message || ''}`);
            }
        } catch (err) {
            console.error("Error submit:", err);
            alert("Terjadi kesalahan server");
        }
    }
    
    // Perhitungan total harga untuk UI
    const hargaMaskapai = maskapaiData.find((m) => m.nama === form.maskapai)?.harga || 0;
    const kelasMultiplier = kelasOptions.find((k) => k.label === form.kelas)?.multiplier || 1;
    const totalHarga = Math.round(hargaMaskapai * kelasMultiplier * form.penumpang);

    return (
        <section className="min-h-screen bg-[#F4F7FE] py-12 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
                        {orderToEdit ? "Edit Pesanan Tiket" : "Selesaikan Pesanan Anda"}
                    </h2>
                    <p className="text-gray-500 mt-2">Pastikan semua data penumpang dan jadwal penerbangan sudah benar.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* KOLOM KIRI (FORM UTAMA) */}
                    <div className="flex-1 space-y-6 w-full">
                        
                        {/* 1. DATA PEMESAN */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                <User className="text-blue-600" /> Data Pemesan
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="text" name="namaPemesan" value={form.namaPemesan} onChange={handleChange} placeholder="Nama Lengkap *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" required />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="tel" name="nomorHp" value={form.nomorHp} onChange={handleChange} placeholder="Nomor Handphone *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" required />
                                </div>
                                <div className="relative md:col-span-2">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Alamat Email *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" required />
                                </div>
                            </div>
                        </div>

                        {/* 2. DETAIL PENERBANGAN */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                <Plane className="text-blue-600" /> Detail Penerbangan
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="text" name="asal" value={form.asal} onChange={handleChange} placeholder="Kota Asal *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase" required />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="text" name="tujuan" value={form.tujuan} onChange={handleChange} placeholder="Kota Tujuan *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase" required />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="date" name="tanggalBerangkat" value={form.tanggalBerangkat} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                                </div>
                                <div className="relative">
                                    <Plane className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <select name="maskapai" value={form.maskapai} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none" required>
                                        <option value="">Pilih Maskapai *</option>
                                        {maskapaiData.map((m) => (
                                            <option key={m.nama} value={m.nama}>{m.nama}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Ticket className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <select name="kelas" value={form.kelas} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none" required>
                                        <option value="">Pilih Kelas Kabin *</option>
                                        {kelasOptions.map((k) => (
                                            <option key={k.label} value={k.label}>{k.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                                    <input type="number" min="1" max="6" name="penumpang" value={form.penumpang} onChange={handleChange} placeholder="Jumlah Penumpang *" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                                </div>
                            </div>
                        </div>

                        {/* 3. NAMA PENUMPANG */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                <Users className="text-blue-600" /> Daftar Penumpang
                            </h3>
                            <div className="space-y-4">
                                {form.namaPenumpang.map((np, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 font-bold flex justify-center items-center rounded-full shrink-0">
                                            {i + 1}
                                        </div>
                                        <input type="text" value={np} onChange={(e) => handleNamaPenumpang(i, e.target.value)} placeholder={`Nama Lengkap Penumpang ${i + 1} *`} className="w-full px-4 py-2 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors" required />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. PILIH KURSI (DESAIN KABIN PESAWAT) */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <Armchair className="text-blue-600" /> Peta Kursi Pesawat
                            </h3>
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <p className="text-gray-500 text-sm">Pilih <span className="font-bold text-blue-600">{form.penumpang} kursi</span> untuk penerbangan Anda.</p>
                                <div className="flex gap-4 text-xs font-medium text-gray-500">
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-300 rounded"></div> Tersedia</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Dipilih</span>
                                </div>
                            </div>

                            <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-gray-200 flex flex-col items-center">
                                {/* Header Abjad Kursi */}
                                <div className="w-full max-w-sm flex justify-between px-2 mb-4 text-gray-400 font-bold text-sm">
                                    <div className="flex gap-3 md:gap-5 w-32 justify-center"><span>A</span><span>B</span><span>C</span></div>
                                    <div className="w-8 text-center text-xs tracking-widest opacity-50">LORONG</div>
                                    <div className="flex gap-3 md:gap-5 w-32 justify-center"><span>D</span><span>E</span><span>F</span></div>
                                </div>

                                {/* Baris Kursi */}
                                <div className="w-full max-w-sm space-y-3">
                                    {Array.from({ length: seatRows }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-between items-center w-full">
                                            
                                            {/* Sisi Kiri (A, B, C) */}
                                            <div className="flex gap-2 md:gap-3 w-32 justify-center">
                                                {["A", "B", "C"].map(col => {
                                                    const seatId = `${rowIndex + 1}${col}`;
                                                    const isSelected = form.kursi.includes(seatId);
                                                    return (
                                                        <button type="button" key={seatId} onClick={() => toggleSeat(seatId)}
                                                            className={`w-9 h-11 md:w-10 md:h-12 rounded-t-lg rounded-b-sm font-semibold text-xs transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white shadow-[0_4px_10px_rgba(37,99,235,0.4)] scale-105' : 'bg-white text-gray-500 border border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                                                        >
                                                            {seatId}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Lorong (Nomor Baris) */}
                                            <div className="w-8 text-center text-gray-400 font-bold text-sm bg-gray-200/50 py-1 rounded-md">
                                                {rowIndex + 1}
                                            </div>

                                            {/* Sisi Kanan (D, E, F) */}
                                            <div className="flex gap-2 md:gap-3 w-32 justify-center">
                                                {["D", "E", "F"].map(col => {
                                                    const seatId = `${rowIndex + 1}${col}`;
                                                    const isSelected = form.kursi.includes(seatId);
                                                    return (
                                                        <button type="button" key={seatId} onClick={() => toggleSeat(seatId)}
                                                            className={`w-9 h-11 md:w-10 md:h-12 rounded-t-lg rounded-b-sm font-semibold text-xs transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white shadow-[0_4px_10px_rgba(37,99,235,0.4)] scale-105' : 'bg-white text-gray-500 border border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                                                        >
                                                            {seatId}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (RINGKASAN PESANAN - STICKY) */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden">
                            {/* Header Biru */}
                            <div className="bg-blue-800 p-6 text-white text-center">
                                <h3 className="text-xl font-bold">Ringkasan Pesanan</h3>
                                <p className="text-blue-200 text-sm mt-1">SkyFly Ticketing System</p>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Rute Visual */}
                                <div className="flex items-center justify-between text-gray-800 font-bold text-lg px-2">
                                    <span className="uppercase truncate w-24">{form.asal || "ASAL"}</span>
                                    <Plane className="text-gray-300 w-6 h-6" />
                                    <span className="uppercase truncate w-24 text-right">{form.tujuan || "TUJUAN"}</span>
                                </div>

                                {/* List Detail */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-600 border border-gray-100">
                                    <div className="flex justify-between">
                                        <span>Maskapai</span>
                                        <span className="font-semibold text-gray-800">{form.maskapai || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tanggal</span>
                                        <span className="font-semibold text-gray-800">{form.tanggalBerangkat || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Kelas</span>
                                        <span className="font-semibold text-gray-800">{form.kelas || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Penumpang</span>
                                        <span className="font-semibold text-gray-800">{form.penumpang} Orang</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span>Kursi</span>
                                        <span className="font-semibold text-blue-600 text-right">
                                            {form.kursi.length > 0 ? form.kursi.join(", ") : "Belum dipilih"}
                                        </span>
                                    </div>
                                </div>

                                {/* Total Harga */}
                                <div className="pt-2">
                                    <p className="text-gray-500 text-sm mb-1">Total Pembayaran</p>
                                    <div className="text-3xl font-black text-blue-700 tracking-tight">
                                        Rp {totalHarga.toLocaleString("id-ID")}
                                    </div>
                                </div>

                                {/* Validasi Info */}
                                {form.kursi.length !== form.penumpang && (
                                    <div className="flex items-start gap-2 bg-orange-50 text-orange-700 p-3 rounded-lg text-xs font-medium">
                                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>Harap pilih <strong>{form.penumpang} kursi</strong> sebelum melanjutkan pembayaran.</p>
                                    </div>
                                )}

                                {/* Tombol Submit */}
                                <button
                                    type="submit"
                                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${form.kursi.length === form.penumpang && form.maskapai && form.kelas ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {orderToEdit ? "Simpan Perubahan" : "Lanjut Bayar"} <ChevronRight className="w-5 h-5" />
                                </button>
                                
                                {orderToEdit && (
                                    <button type="button" onClick={() => navigate("/riwayat")} className="w-full py-3 bg-white text-gray-500 hover:text-gray-700 font-semibold border border-gray-200 rounded-xl transition-colors">
                                        Batal Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </section>
    );
}