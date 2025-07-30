document.addEventListener("DOMContentLoaded", function () {
  // Proteksi halaman tertentu
// Proteksi halaman yang butuh login
const halamanButuhLogin = ['form.html', 'confirm.html'];
const currentPage = window.location.pathname.split("/").pop();

if (halamanButuhLogin.includes(currentPage)) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || typeof user !== 'object' || !user.nama || !user.kode_akses) {
      throw new Error("User tidak valid");
    }
  } catch (e) {
    alert("Akses tidak dikenali. Silakan login ulang.");
    window.location.href = "index.html";
  }
}


  // ------------------ Halaman Login (index.html) ------------------
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const kode = loginForm.kode_akses.value.trim();
      if (!kode) return alert("Masukkan kode akses!");

      try {
        const response = await fetch('${BASE_API_URL}/api/login', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kode_akses: kode })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Simpan ke localStorage
          localStorage.setItem("user", JSON.stringify({
            nama: data.nama,
            kode_akses: kode
          }));
          window.location.href = "wellcome.html";
        } else {
          alert(data.message || "Kode akses salah.");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal login. Periksa koneksi server.");
      }
    });
  }

  // ------------------ Halaman Form (form.html) ------------------
  const bahanList = [
    "Peach jam", "Strawberry Jam", "CUP U 400ml", "CUP 12 oz", "CUP M 500ml",
    "CUP L 700ml", "Cone Cover", "Sealer Film CUP", "Label", "Plastik BESAR",
    "Plastik KECIL", "Plastik TANGGUNG", "Sedotan BESAR", "Sedotan KECIL", "Sendok Pink",
    "Tutup CUP", "AIYU Powder", "Chocolate ICE CREAM", "Coffee ICE CREAM", "Matcha ICE CREAM",
    "MILK TEA Powder", "Original Powder KOPI", "Pudding Powder", "Strawberry ICE CREAM", "Vanila ICE CREAM",
    "Caramel Syrup", "Chocolate Syrup 1KG", "Fructose", "Lemon Syrup", "RED GRAPE Juice",
    "Yogurt Syrup", "Roasted BLACK TEA", "GREEN TEA Jasmine", "Peach OOLONG TEA", "Coconut Jelly",
    "Cone", "Popping Mango", "Strawberry Popping", "Sendok KW", "COCOA aromatic",
    "Matcha Powder DRINK", "Boba Pack 1 kg", "egg waffle powder", "KL15 non diary creamer", "Taro aromatic",
    "Original Milktea Powder", "Packaging Waffle", "Banana Jam", "Coklat Sirup 1kg", "Mango jam",
    "Red Bean", "guava jam", "passion fruit jam", "plum juice", "sendok ORI",
    "chocolate syrup 3kg", "Boba 3.1 kg"
  ];

  function populateSelect(select) {
    select.innerHTML = `<option value="">-- Pilih Bahan --</option>` + 
      bahanList.map(item => `<option value="${item}">${item}</option>`).join("");
  }

  const container = document.getElementById("bahan-container");
  if (container) {
    const selectEls = container.querySelectorAll("select");
    selectEls.forEach(select => populateSelect(select));

    document.getElementById("tambah-bahan").addEventListener("click", () => {
      const newGroup = document.createElement("div");
      newGroup.className = "bahan-group grid grid-cols-1 md:grid-cols-2 gap-4 mb-4";
      newGroup.innerHTML = `
        <div>
          <select class="bahan-select w-full px-4 py-2 border border-gray-300 rounded-lg" required></select>
        </div>
        <div>
          <input type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
        </div>
      `;
      container.appendChild(newGroup);
      populateSelect(newGroup.querySelector("select"));
    });
  }

  const form = document.getElementById("barang-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const tanggal = form.tanggal.value;
      const bahanEls = form.querySelectorAll(".bahan-group");

      const bahan = Array.from(bahanEls).map(group => {
        const nama = group.querySelector("select").value.trim();
        const jumlah = group.querySelector("input").value.trim();
        return { nama, jumlah };
      });

      const isValid = tanggal && bahan.every(item => item.nama !== "" && item.jumlah !== "");
      if (!isValid) {
        alert("Silakan lengkapi semua isian sebelum mengirim.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const kodeAkses = user?.kode_akses || null;
      const namaUser = user?.nama || "Tidak dikenal";

      if (!kodeAkses) {
        alert("Akses tidak dikenali. Silakan login ulang.");
        window.location.href = "index.html";
        return;
      }

      const tipe = new URLSearchParams(window.location.search).get("tipe") || "masuk";

      localStorage.setItem("dataForm", JSON.stringify({
        tanggal,
        bahan,
        tipe,
        kodeAkses,
        namaUser
      }));

      window.location.href = `confirm.html?tipe=${tipe}`;
    });
  }

  // Hapus bahan
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("hapus-bahan")) {
      const group = e.target.closest(".bahan-group");
      if (group) group.remove();
    }
  });
});
