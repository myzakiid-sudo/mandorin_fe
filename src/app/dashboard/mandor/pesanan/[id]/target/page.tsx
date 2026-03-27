import React from "react";

const TargetTahapanPengerjaanPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Target Tahapan Pengerjaan
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Proyek
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder=""
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tanggal Survei
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Tanggal Selesai
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Alamat Lengkap Proyek
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi Pekerjaan
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
              ></textarea>
            </div>
            <div>
              <h3 className="font-semibold mt-6 mb-2">Urutan Tahapan</h3>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Tahapan {n}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Syarat Tahapan
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
              ></textarea>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Menyimpan formulir ini berarti menetapkan target pengerjaan yang
              akan dipantau secara berkala melalui laporan progres harian di
              aplikasi Mandorin.
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded py-2 mt-4 transition-colors"
            >
              Kirim
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TargetTahapanPengerjaanPage;
