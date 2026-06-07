import { useState } from "react";

export default function BantuanPage() {
    // State untuk mengatur buka-tutup kotak FAQ
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "Bagaimana cara memesan tiket di SkyFly?",
            answer: "Anda dapat memesan tiket dengan mencari rute pada halaman Pesan/Beranda, memilih penerbangan yang sesuai jadwal, lalu mengisi detail identitas penumpang dan melakukan pembayaran."
        },
        {
            id: 2,
            question: "Apakah saya bisa membatalkan (refund) tiket?",
            answer: "Tentu! Silakan buka menu Riwayat, pilih pesanan tiket Anda, klik tombol 'Hapus/Batalkan', dan masukkan Kode Booking untuk mengonfirmasi pembatalan otomatis."
        },
        {
            id: 3,
            question: "Bagaimana jika terjadi error saat simulasi pembayaran?",
            answer: "Jika terjadi kendala, Anda dapat mengulangi proses pembayaran langsung dari menu Riwayat pada tiket yang berstatus 'Menunggu Pembayaran'. Pastikan nomor Virtual Account atau langkahnya sesuai petunjuk."
        }
    ];

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FC] flex flex-col font-sans">
            
            {/* 1. HERO SECTION */}
            <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 w-full flex flex-col-reverse md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 leading-tight">
                        Bantuan & Dukungan <span className="text-4xl inline-block ml-2 animate-bounce">👋</span>
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed md:pr-10">
                        Kami selalu siap membantu Anda. Temukan panduan pemesanan, informasi refund, dan layanan bantuan langsung agar pengalaman terbang Anda bersama SkyFly tetap nyaman.
                    </p>
                    <div className="pt-4">
                        <a href="#faq" className="inline-block px-8 py-3 bg-blue-100 text-blue-700 font-bold rounded-full hover:bg-blue-200 transition-colors shadow-sm">
                            Lihat Pusat FAQ &darr;
                        </a>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <img 
                        src="https://img.freepik.com/free-vector/flat-customer-support-illustration_23-2148899114.jpg?w=740&t=st=1700000000~exp=1700000000~hmac=847a9602e1c676d5" 
                        alt="Ilustrasi Bantuan SkyFly" 
                        className="w-full max-w-[420px] mix-blend-multiply" 
                        style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.1))" }}
                    />
                </div>
            </section>

            {/* 2. CONTACT CARDS SECTION (Fungsional Link) */}
            <section className="max-w-6xl mx-auto px-6 pb-24 w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Kotak 1: Live Chat (WhatsApp) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Live Chat (WhatsApp)</h3>
                        <p className="text-gray-500 text-sm mb-8 flex-grow">Butuh bantuan cepat? CS kami tersedia 24/7 melalui fitur live chat interaktif.</p>
                        
                        {/* 🟢 TAUTAN WHATSAPP (Ganti 0 jadi 62) */}
                        <a 
                            href="https://wa.me/6282274367514" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full block py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
                        >
                            Mulai Chat
                        </a>
                    </div>

                    {/* Kotak 2: Email */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Email Support</h3>
                        <p className="text-gray-500 text-sm mb-8 flex-grow">Kirim pertanyaan sistem atau laporan kendala Anda, kami akan membalas secepatnya.</p>
                        
                        {/* 🟢 TAUTAN EMAIL (mailto:) */}
                        <a 
                            href="mailto:haqyrasya21@gmail.com" 
                            className="w-full block py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
                        >
                            Kirim Email
                        </a>
                    </div>

                    {/* Kotak 3: Telepon */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Telepon CS</h3>
                        <p className="text-gray-500 text-sm mb-8 flex-grow">Hubungi tim operasional kami setiap hari pukul 08.00 – 22.00 WIB untuk panduan langsung.</p>
                        
                        {/* 🟢 TAUTAN TELEPON (tel:) */}
                        <a 
                            href="tel:081269461277" 
                            className="w-full block py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
                        >
                            Hubungi Sekarang
                        </a>
                    </div>
                </div>
            </section>

            {/* 3. FAQ SECTION */}
            <section id="faq" className="w-full bg-white py-24 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-gray-100 flex-grow">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-extrabold text-blue-800 flex items-center justify-center gap-3">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="text-gray-500 mt-4 text-lg">Jawaban cepat untuk pertanyaan yang paling sering ditanyakan oleh penumpang SkyFly.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div 
                                key={faq.id} 
                                className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'border-blue-400 shadow-md' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                                >
                                    <span className="font-bold text-gray-800 text-lg pr-4">{faq.question}</span>
                                    <div className={`p-2 rounded-full transition-colors duration-300 ${openFaq === faq.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <svg 
                                            className={`w-5 h-5 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                
                                <div 
                                    className={`transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-blue-50/30`}
                                >
                                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}