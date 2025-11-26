import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allTransaksi = [];

// Switch tab laporan
window.showLaporan = function(type, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Hide all content
    document.querySelectorAll('.laporan-content').forEach(content => content.classList.remove('active'));
    
    // Show selected content
    if (type === 'stok') {
        const laporanStok = document.getElementById('laporanStok');
        if (laporanStok) {
            laporanStok.classList.add('active');
            loadLaporanStok();
        }
    } else if (type === 'menipis') {
        const laporanMenipis = document.getElementById('laporanMenipis');
        if (laporanMenipis) {
            laporanMenipis.classList.add('active');
            loadLaporanMenipis();
        }
    } else if (type === 'penjualan') {
        const laporanPenjualan = document.getElementById('laporanPenjualan');
        if (laporanPenjualan) {
            laporanPenjualan.classList.add('active');
            loadLaporanPenjualan();
        }
    }
}

// Load Laporan Stok
async function loadLaporanStok() {
    try {
        const obatCol = collection(db, 'obat');
        const obatQuery = query(obatCol, orderBy('namaObat'));
        const snapshot = await getDocs(obatQuery);
        
        let totalItem = 0;
        let totalNilai = 0;
        let html = '';
        
        snapshot.forEach((doc, index) => {
            const data = doc.data();
            const nilaiStok = data.stok * data.hargaJual;
            
            totalItem++;
            totalNilai += nilaiStok;
            
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.kodeObat}</td>
                    <td>${data.namaObat}</td>
                    <td>${data.kategori}</td>
                    <td>${data.stok}</td>
                    <td>Rp ${new Intl.NumberFormat('id-ID').format(data.hargaJual)}</td>
                    <td>Rp ${new Intl.NumberFormat('id-ID').format(nilaiStok)}</td>
                </tr>
            `;
        });
        
        if (html === '') {
            html = '<tr><td colspan="7" style="text-align: center;">Tidak ada data</td></tr>';
        }
        
        const tableBody = document.getElementById('stokTableBody');
        if (tableBody) {
            tableBody.innerHTML = html;
        }
        
        const totalItemEl = document.getElementById('totalItemStok');
        if (totalItemEl) {
            totalItemEl.textContent = totalItem;
        }
        
        const totalNilaiEl = document.getElementById('totalNilaiStok');
        if (totalNilaiEl) {
            totalNilaiEl.textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(totalNilai);
        }
        
    } catch (error) {
        console.error('Error loading laporan stok:', error);
        alert('Gagal memuat laporan stok!');
    }
}

// Load Laporan Stok Menipis
async function loadLaporanMenipis() {
    try {
        const obatCol = collection(db, 'obat');
        const snapshot = await getDocs(obatCol);
        
        let html = '';
        let count = 0;
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            
            if (data.stok <= 10) {
                count++;
                let badge = '';
                if (data.stok === 0) {
                    badge = '<span class="badge danger">Habis</span>';
                } else {
                    badge = '<span class="badge warning">Menipis</span>';
                }
                
                html += `
                    <tr>
                        <td>${count}</td>
                        <td>${data.kodeObat}</td>
                        <td>${data.namaObat}</td>
                        <td>${data.kategori}</td>
                        <td>${data.stok}</td>
                        <td>${badge}</td>
                    </tr>
                `;
            }
        });
        
        if (html === '') {
            html = '<tr><td colspan="6" style="text-align: center;">Semua stok aman</td></tr>';
        }
        
        const tableBody = document.getElementById('menipisTableBody');
        if (tableBody) {
            tableBody.innerHTML = html;
        }
        
    } catch (error) {
        console.error('Error loading laporan menipis:', error);
        alert('Gagal memuat laporan stok menipis!');
    }
}

// Load Laporan Penjualan
async function loadLaporanPenjualan() {
    try {
        const transaksiCol = collection(db, 'transaksi');
        const transaksiQuery = query(transaksiCol, orderBy('tanggal', 'desc'));
        const snapshot = await getDocs(transaksiQuery);
        
        allTransaksi = [];
        snapshot.forEach((doc) => {
            allTransaksi.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        displayPenjualan(allTransaksi);
        
    } catch (error) {
        console.error('Error loading laporan penjualan:', error);
        alert('Gagal memuat laporan penjualan!');
    }
}

// Display penjualan
function displayPenjualan(data) {
    let html = '';
    let totalTransaksi = 0;
    let totalPenjualan = 0;
    
    data.forEach((transaksi, index) => {
        totalTransaksi++;
        totalPenjualan += transaksi.total;
        
        const tanggal = new Date(transaksi.tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${transaksi.noTransaksi}</td>
                <td>${tanggal}</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(transaksi.total)}</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(transaksi.bayar)}</td>
                <td>Rp ${new Intl.NumberFormat('id-ID').format(transaksi.kembalian)}</td>
                <td>${transaksi.petugas.split('@')[0]}</td>
            </tr>
        `;
    });
    
    if (html === '') {
        html = '<tr><td colspan="7" style="text-align: center;">Belum ada transaksi</td></tr>';
    }
    
    const tableBody = document.getElementById('penjualanTableBody');
    if (tableBody) {
        tableBody.innerHTML = html;
    }
    
    const totalTransaksiEl = document.getElementById('totalTransaksi');
    if (totalTransaksiEl) {
        totalTransaksiEl.textContent = totalTransaksi;
    }
    
    const totalPenjualanEl = document.getElementById('totalPenjualan');
    if (totalPenjualanEl) {
        totalPenjualanEl.textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(totalPenjualan);
    }
}

// Filter penjualan by date
window.filterPenjualan = function() {
    const tanggalMulai = document.getElementById('tanggalMulai')?.value;
    const tanggalAkhir = document.getElementById('tanggalAkhir')?.value;
    
    if (!tanggalMulai || !tanggalAkhir) {
        alert('Pilih tanggal mulai dan akhir!');
        return;
    }
    
    const filtered = allTransaksi.filter(transaksi => {
        const tglTransaksi = new Date(transaksi.tanggal).toISOString().split('T')[0];
        return tglTransaksi >= tanggalMulai && tglTransaksi <= tanggalAkhir;
    });
    
    displayPenjualan(filtered);
}

// Print laporan (simple window.print)
window.printLaporan = function(type) {
    window.print();
}

// Export laporan ke Excel/CSV
window.exportLaporan = function(type) {
    let csvContent = '';
    let filename = '';
    
    if (type === 'stok') {
        csvContent = 'No,Kode Obat,Nama Obat,Kategori,Stok,Harga Jual,Nilai Stok\n';
        const rows = document.querySelectorAll('#stokTableBody tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length > 1) {
                const rowData = Array.from(cols).map(col => col.textContent.trim()).join(',');
                csvContent += rowData + '\n';
            }
        });
        filename = 'laporan_stok.csv';
    } else if (type === 'menipis') {
        csvContent = 'No,Kode Obat,Nama Obat,Kategori,Stok,Status\n';
        const rows = document.querySelectorAll('#menipisTableBody tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length > 1) {
                const rowData = Array.from(cols).map(col => col.textContent.trim()).join(',');
                csvContent += rowData + '\n';
            }
        });
        filename = 'laporan_stok_menipis.csv';
    } else if (type === 'penjualan') {
        csvContent = 'No,No Transaksi,Tanggal,Total,Bayar,Kembalian,Petugas\n';
        const rows = document.querySelectorAll('#penjualanTableBody tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length > 1) {
                const rowData = Array.from(cols).map(col => col.textContent.trim()).join(',');
                csvContent += rowData + '\n';
            }
        });
        filename = 'laporan_penjualan.csv';
    }
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Set default date filter (hari ini)
function setDefaultDateFilter() {
    const today = new Date().toISOString().split('T')[0];
    const tanggalMulaiEl = document.getElementById('tanggalMulai');
    const tanggalAkhirEl = document.getElementById('tanggalAkhir');
    
    if (tanggalMulaiEl) tanggalMulaiEl.value = today;
    if (tanggalAkhirEl) tanggalAkhirEl.value = today;
}

// Init laporan page
export function initLaporanPage() {
    setDefaultDateFilter();
    loadLaporanStok();
}
