import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Search, PlaneTakeoff, PlaneLanding } from "lucide-react";

// ========================= DATA DESTINASI ========================= //
const destinasi = {
  Sumatera: [
    { id: 1, asal: "Jakarta", tujuan: "Medan", maskapai: "Lion Air", kelas: "Ekonomi", tanggal: "27 Nov 25", hargaAsli: 1365900, hargaPromo: 1360900, refund: true, reschedule: true },
    { id: 2, asal: "Jakarta", tujuan: "Padang", maskapai: "Pelita Air", kelas: "Ekonomi", tanggal: "28 Nov 25", hargaAsli: 1325000, hargaPromo: 1320000, refund: true, reschedule: true },
    { id: 3, asal: "Jakarta", tujuan: "Pekanbaru", maskapai: "Batik Air", kelas: "Ekonomi", tanggal: "29 Nov 25", hargaAsli: 1450000, hargaPromo: 1399000, refund: true, reschedule: true },
  ],
  Jawa: [
    { id: 11, asal: "Jakarta", tujuan: "Surabaya", maskapai: "Garuda Indonesia", kelas: "Ekonomi", tanggal: "28 Nov 25", hargaAsli: 1680000, hargaPromo: 1599000, refund: true, reschedule: true },
    { id: 12, asal: "Jakarta", tujuan: "Yogyakarta", maskapai: "Citilink", kelas: "Ekonomi", tanggal: "30 Nov 25", hargaAsli: 1130000, hargaPromo: 1099000, refund: true, reschedule: true },
    { id: 13, asal: "Jakarta", tujuan: "Semarang", maskapai: "Lion Air", kelas: "Ekonomi", tanggal: "01 Des 25", hargaAsli: 980000, hargaPromo: 935000, refund: true, reschedule: true },
  ],
  Bali: [
    { id: 21, asal: "Jakarta", tujuan: "Denpasar", maskapai: "Batik Air", kelas: "Ekonomi", tanggal: "29 Nov 25", hargaAsli: 1520000, hargaPromo: 1465000, refund: true, reschedule: true },
    { id: 22, asal: "Jakarta", tujuan: "Lombok", maskapai: "Citilink", kelas: "Ekonomi", tanggal: "02 Des 25", hargaAsli: 1600000, hargaPromo: 1545000, refund: true, reschedule: true },
    { id: 23, asal: "Jakarta", tujuan: "Labuan Bajo", maskapai: "Super Air Jet", kelas: "Ekonomi", tanggal: "04 Des 25", hargaAsli: 2100000, hargaPromo: 2049000, refund: true, reschedule: true },
  ],
  Kalimantan: [
    { id: 31, asal: "Jakarta", tujuan: "Balikpapan", maskapai: "Lion Air", kelas: "Ekonomi", tanggal: "01 Des 25", hargaAsli: 1550000, hargaPromo: 1499000, refund: true, reschedule: true },
    { id: 32, asal: "Jakarta", tujuan: "Pontianak", maskapai: "Super Air Jet", kelas: "Ekonomi", tanggal: "03 Des 25", hargaAsli: 1490000, hargaPromo: 1425000, refund: true, reschedule: true },
    { id: 33, asal: "Jakarta", tujuan: "Samarinda", maskapai: "Batik Air", kelas: "Ekonomi", tanggal: "05 Des 25", hargaAsli: 1710000, hargaPromo: 1649000, refund: true, reschedule: true },
  ],
  "Sulawesi & Indonesia Timur": [
    { id: 41, asal: "Jakarta", tujuan: "Makassar", maskapai: "Garuda Indonesia", kelas: "Ekonomi", tanggal: "05 Des 25", hargaAsli: 2100000, hargaPromo: 1999000, refund: true, reschedule: true },
    { id: 42, asal: "Jakarta", tujuan: "Manado", maskapai: "Lion Air", kelas: "Ekonomi", tanggal: "08 Des 25", hargaAsli: 2400000, hargaPromo: 2325000, refund: true, reschedule: true },
    { id: 43, asal: "Jakarta", tujuan: "Ternate", maskapai: "Citilink", kelas: "Ekonomi", tanggal: "10 Des 25", hargaAsli: 2550000, hargaPromo: 2475000, refund: true, reschedule: true },
  ],
  Bisnis: [
    { id: 51, asal: "Jakarta", tujuan: "Medan", maskapai: "Garuda Indonesia", kelas: "Bisnis", tanggal: "27 Nov 25", hargaAsli: 4980000, hargaPromo: 4699000, refund: true, reschedule: true },
    { id: 52, asal: "Jakarta", tujuan: "Surabaya", maskapai: "Batik Air", kelas: "Bisnis", tanggal: "01 Des 25", hargaAsli: 5250000, hargaPromo: 4999000, refund: true, reschedule: true },
    { id: 53, asal: "Jakarta", tujuan: "Denpasar", maskapai: "Garuda Indonesia", kelas: "Bisnis", tanggal: "03 Des 25", hargaAsli: 5500000, hargaPromo: 5255000, refund: true, reschedule: true },
  ],
};

const kategori = Object.keys(destinasi);

// ========================= HOMEPAGE ========================= //
export default function HomePage() {
  const [aktif, setAktif] = useState("Sumatera");
  const [searchForm, setSearchForm] = useState({ asal: "", tujuan: "", tanggalBerangkat: "" });
  const navigate = useNavigate(); 

  // 1. Fungsi Klik Pesan Sekarang (Katalog)
  const handlePesanSekarang = (flightData) => {
    navigate("/pesan", { state: { initialData: flightData } });
  };

  // 2. Fungsi Klik Promo
  const handlePromoClick = (promoData) => {
    navigate("/pesan", { state: { initialData: promoData } });
  };

  // 3. Fungsi Submit Form Pencarian Cepat
  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate("/pesan", { state: { initialData: searchForm } });
  };

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-50">

      {/* ===================== HERO SECTION DENGAN FORM PENCARIAN ===================== */}
      <section className="relative h-[650px] md:h-[550px] flex items-center text-white w-full">
        <img src="/aboutt.jpg" alt="SkyFly" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        
        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            
            {/* Teks Kiri */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                Terbang Nyaman, <br/><span className="text-yellow-400">Tanpa Ribet.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow-md">
                Akses dunia dalam genggaman. Temukan pengalaman terbang terbaik dengan harga jujur di SkyFly Pro.
              </p>
            </div>

            {/* Kotak Pencarian Kanan */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 text-gray-800 w-full max-w-md mx-auto md:ml-auto">
              <h3 className="text-white text-xl font-bold mb-4 text-center">Cari Penerbangan</h3>
              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div className="relative">
                  <PlaneTakeoff className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Asal (Mis: Jakarta)" required 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    value={searchForm.asal} onChange={(e) => setSearchForm({...searchForm, asal: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <PlaneLanding className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="Tujuan (Mis: Bali)" required 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    value={searchForm.tujuan} onChange={(e) => setSearchForm({...searchForm, tujuan: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
                  <Search className="w-5 h-5"/> Cari Tiket Sekarang
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ===================== PROMO SECTION (INTERAKTIF) ===================== */}
      <section className="px-6 py-16 bg-gradient-to-b from-white to-sky-50 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-sky-800 text-center tracking-wide">
            Promo Spesial Untuk Kamu ✨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            
            {/* Promo 1 -> Lempar ke Pesan, otomatis Garuda Indonesia */}
            <div onClick={() => handlePromoClick({ maskapai: "Garuda Indonesia" })} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">✈️</div>
                <h3 className="text-lg font-semibold text-sky-700">Diskon Garuda 20%</h3>
              </div>
              <p className="text-sm text-gray-600 mt-3">Terbang eksklusif dengan Garuda Indonesia lebih hemat sampai 30 November 2025.</p>
            </div>

            {/* Promo 2 -> Lempar ke Pesan, otomatis Kelas Bisnis */}
            <div onClick={() => handlePromoClick({ kelas: "Bisnis" })} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">💸</div>
                <h3 className="text-lg font-semibold text-purple-700">Promo Kelas Bisnis</h3>
              </div>
              <p className="text-sm text-gray-600 mt-3">Dapatkan kenyamanan ekstra dengan potongan khusus untuk kabin Kelas Bisnis.</p>
            </div>

            {/* Promo 3 -> Lempar ke Pesan, otomatis Citilink */}
            <div onClick={() => handlePromoClick({ maskapai: "Citilink" })} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">🌟</div>
                <h3 className="text-lg font-semibold text-emerald-700">Terbang Hemat Citilink</h3>
              </div>
              <p className="text-sm text-gray-600 mt-3">Pilihan rute domestik terbaik bersama Citilink. Cashback khusus pengguna QRIS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== KATEGORI DESTINASI ===================== */}
      <div className="max-w-7xl mx-auto px-4 w-full py-10">
        <h2 className="text-3xl font-extrabold mb-3 text-blue-800 text-center">Jelajahi Nusantara bersama SkyFly Pro</h2>
        
        <div className="flex flex-wrap gap-3 justify-center mb-10 mt-6">
          {kategori.map((k) => (
            <button key={k} onClick={() => setAktif(k)}
              className={`px-5 py-2 rounded-full border font-semibold transition-all ${
                aktif === k ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-105" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinasi[aktif].map((d) => (
            <div key={d.id} className="border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all p-6 flex flex-col h-full">
              <div className="text-gray-800 font-semibold text-xl mb-1">
                {d.asal} → <span className="text-blue-700 font-bold">{d.tujuan}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">Sekali jalan • {d.tanggal}</div>
              
              <div className="mb-4">
                <span className="text-sm text-gray-400 line-through mr-2">IDR {d.hargaAsli.toLocaleString("id-ID")}</span>
                <span className="text-2xl font-black text-orange-600">IDR {d.hargaPromo.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-2">
                ✈ {d.maskapai} • {d.kelas}
              </div>
              <div className="text-emerald-600 text-xs font-semibold mb-6">
                {d.refund && "✓ Bisa Refund"} {d.reschedule && " • ✓ Bisa Reschedule"}
              </div>

              <button onClick={() => handlePesanSekarang(d)} className="mt-auto w-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white py-3 rounded-xl font-bold transition-colors">
                Pilih Tiket
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== KENAPA PILIH SKYFLY ===================== */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-12">
            Kenapa Pilih <span className="text-yellow-500">SkyFly Pro?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Keunggulan icon="⚡" title="Pemesanan Super Cepat" desc="Hanya butuh beberapa klik untuk menemukan dan memesan tiket favoritmu." />
            <Keunggulan icon="💳" title="Banyak Metode Pembayaran" desc="Dari virtual account, e-wallet, hingga QRIS — semua tersedia dengan aman." />
            <Keunggulan icon="🛫" title="Maskapai Terlengkap" desc="Temukan perjalanan terbaik dari berbagai maskapai nasional terpercaya." />
          </div>
        </div>
      </section>

      {/* ===================== SLIDER DESTINASI (INTERAKTIF) ===================== */}
      <section className="w-full bg-blue-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10">Destinasi Populer <span className="text-yellow-400">2025</span></h2>
          <Swiper
            modules={[Navigation]} navigation spaceBetween={30} slidesPerView={1.2}
            breakpoints={{ 640: { slidesPerView: 2.1 }, 1024: { slidesPerView: 3.2 } }} className="pb-10"
          >
            {[
              { id: 1, nama: "Denpasar", img: "https://bankraya.co.id/uploads/insights/jO3TRUmMuBAuyilKHgu9Ovjfs3nFoubWiSSjB3Pn.jpg" },
              { id: 2, nama: "Yogyakarta", img: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQpDAPMr4elF7U6zRXZ8gGXH68N-iYrMrNSV_zip7JZTwp0tGtwipfSpx2QFEVatUP4YXSSlQG-G2biCLSo2RCK1I4&s=19" },
              { id: 3, nama: "Labuan Bajo", img: "https://img.antaranews.com/cache/1200x800/2019/04/12/labuan-bajo.jpg.webp" },
              { id: 4, nama: "Lombok", img: "https://www.gardaoto.com/wp-content/uploads/2024/05/18291-1536x1025.jpg" },
              { id: 5, nama: "Medan", img: "https://www.indonesia.travel/contentassets/c881faef49bf467486bf6ef105b7e7f8/the-baiturrahman-grand-mosque-a-symbol-of-faith-and-resilience-in-banda-aceh.jpg" },
            ].map((d) => (
              <SwiperSlide key={d.id}>
                {/* 🟢 Saat diklik, arahkan ke halaman pesan dan otomatis isi Tujuan */}
                <div onClick={() => handlePesanSekarang({ tujuan: d.nama })} className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-lg">
                  <div className="relative overflow-hidden h-56">
                    <img src={d.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={d.nama} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-blue-900">{d.nama}</h3>
                    <p className="text-gray-500 text-sm mt-1">Cari penerbangan ke {d.nama} →</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===================== REVIEW PENGGUNA ===================== */}
      <section className="px-6 py-20 bg-gray-50 w-full">
        <h2 className="text-3xl font-extrabold mb-10 text-center text-blue-900">Apa Kata Pengguna Kami? ✨</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReviewCard img="https://media.istockphoto.com/id/888263352/id/vektor/ikon-lingkaran-pengguna-anonim.jpg?s=1024x1024&w=is&k=20&c=T-F3InSQkFdDmqd3Qmc2dTyGQ57T7oWl5tonnM_Cw6w=" nama="Nadia Putri" job="Mahasiswi" text="Layanan SkyFly cepat dan sangat mudah dipakai. Tiket pesawat bisa didapat cuma dalam beberapa menit!" />
          <ReviewCard img="https://media.istockphoto.com/id/888263352/id/vektor/ikon-lingkaran-pengguna-anonim.jpg?s=1024x1024&w=is&k=20&c=T-F3InSQkFdDmqd3Qmc2dTyGQ57T7oWl5tonnM_Cw6w=" nama="Rizky Ananda" job="Karyawan Swasta" text="Harga kompetitif dan banyak promo menarik. Pembayaran Virtual Account sangat responsif." />
          <ReviewCard img="https://media.istockphoto.com/id/888263352/id/vektor/ikon-lingkaran-pengguna-anonim.jpg?s=1024x1024&w=is&k=20&c=T-F3InSQkFdDmqd3Qmc2dTyGQ57T7oWl5tonnM_Cw6w=" nama="Andi Pratama" job="Freelancer" text="Navigasi sangat mudah dipahami, tampilan modern, dan proses refund sangat otomatis. Mantap!" />
        </div>
      </section>
    </section>
  );
}

// ========================= COMPONENT KECIL ========================= //
function ReviewCard({ img, nama, job, text }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center gap-4 mb-5">
        <img src={img} className="w-14 h-14 rounded-full border border-gray-200" alt={nama} />
        <div>
          <h4 className="font-bold text-gray-800">{nama}</h4>
          <p className="text-sm text-gray-500">{job}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">“{text}”</p>
      <div className="text-yellow-400 text-lg tracking-widest">★★★★★</div>
    </div>
  );
}

function Keunggulan({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center md:text-left">
      <div className="text-4xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-blue-900">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}