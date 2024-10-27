export default function convertToRupiah(value) {
    const rupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(value);
    return rupiah.replace("Rp", "").replace(",00", "").trim();
}