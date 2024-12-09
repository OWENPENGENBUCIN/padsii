"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/button";
import { MenuTable, MemberTable } from "@/app/lib/definitions";
import { createTransaksi } from "@/app/lib/actions";
import ErrorMessages from "./error-message";
import MenuList from "./menu-list";
import MemberSelector from "./member-selector";
import PaymentDetails from "./payment-details";
import { useRouter } from "next/navigation";

export default function TransaksiCreateForm({
  menu,
  member,
}: {
  menu: MenuTable[];
  member: MemberTable[];
}) {
  const router = useRouter();
  const [selectedMenus, setSelectedMenus] = useState<any[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [tanggalTransaksi, setTanggalTransaksi] = useState("");
  const [pembayaran, setPembayaran] = useState(0);
  const [selectedMember, setSelectedMember] = useState<string>(""); 
  const [referralPhone, setReferralPhone] = useState<string>(""); 
  const [selectedMemberName, setSelectedMemberName] = useState<string>(""); 
  const [errors, setErrors] = useState<{
    menu?: string;
    pembayaran?: string;
    referral?: string;
  }>({});

  // Format tanggal
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

  useEffect(() => setTanggalTransaksi(formatDate(new Date())), []);

  useEffect(() => {
    const total = selectedMenus.reduce(
      (sum, menu) => sum + menu.harga_menu * menu.jumlah,
      0
    );
    setTotalHarga(total);
  }, [selectedMenus]);

  const validateReferral = () => {
    const currentMember = member.find((m) => m.id === selectedMember);

    if (currentMember?.referral_count! >= 3) {
      if (referralPhone) {
        const referredMember = member.find((m) => m.nohp_member === referralPhone);
        if (referredMember && referredMember.id !== selectedMember) {
          return {
            isValid: true,
            message: "Referral valid. Diskon 40% diterapkan.",
            isReferral40: true,
          };
        } else {
          return {
            isValid: false,
            message: "Kode referral tidak valid atau sama dengan anggota yang dipilih.",
          };
        }
      }
      return {
        isValid: true,
        message: "Diskon 30% diterapkan karena referral_count mencapai 3.",
        isReferral30: true,
      };
    }

    if (referralPhone) {
      const referredMember = member.find((m) => m.nohp_member === referralPhone);
      if (referredMember && referredMember.id !== selectedMember) {
        return {
          isValid: true,
          message: "Referral valid. Diskon 10% diterapkan.",
          isReferral10: true,
        };
      } else {
        return {
          isValid: false,
          message: "Kode referral tidak valid atau sama dengan anggota yang dipilih.",
        };
      }
    }

    return { isValid: true, message: "" };
  };

  const applyDiscount = () => {
    const referralValidation = validateReferral();

    if (referralValidation.isReferral40) {
      return totalHarga * 0.6;
    }

    if (referralValidation.isReferral30) {
      return totalHarga * 0.7;
    }

    if (referralValidation.isReferral10) {
      return totalHarga * 0.9;
    }

    return totalHarga;
  };

  const handleReset = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (selectedMenus.length === 0) {
      setErrors((prev) => ({ ...prev, menu: "Minimal harus memilih 1 menu" }));
      return;
    }

    if (pembayaran === 0 || pembayaran === null) {
      setErrors((prev) => ({
        ...prev,
        pembayaran: "Input pembayaran harus diisi.",
      }));
      return;
    }

    const discountedTotal = applyDiscount();

    if (pembayaran < discountedTotal) {
      setErrors((prev) => ({
        ...prev,
        pembayaran: "Pembayaran kurang!",
      }));
      return;
    }

    const referralValidation = validateReferral();
    if (!referralValidation.isValid) {
      setErrors((prev) => ({ ...prev, referral: referralValidation.message }));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("member_id", selectedMember || "");
      formData.append("member_nama", selectedMemberName || "");
      formData.append("tanggal_transaksi", tanggalTransaksi);
      formData.append("total_harga", discountedTotal.toString()); // Kirimkan total harga yang sudah didiskon
      formData.append("pembayaran", pembayaran.toString());
      formData.append("kembalian", (pembayaran - discountedTotal).toString());

      if (referralPhone) {
        formData.append("referralPhone", referralPhone);
      }

      const response = await createTransaksi(formData, selectedMenus);

      if (response.success) {
        alert(response.message);
        router.back();
      } else {
        setErrors((prev) => ({ ...prev, submit: response.message }));
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Gagal mengirim transaksi.",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <ErrorMessages errors={errors} />
        <MenuList
          menu={menu}
          selectedMenus={selectedMenus}
          setSelectedMenus={setSelectedMenus}
        />
        <MemberSelector
          setSelectedMemberName={setSelectedMemberName}
          member={member}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />

        <div className="mb-4">
          <label htmlFor="referralPhone" className="block text-sm font-medium mb-2">
            Nomor HP Referral (Opsional)
          </label>
          <input
            id="referralPhone"
            name="referralPhone"
            type="text"
            value={referralPhone}
            placeholder="Masukkan nomor HP referral"
            className={`block w-full rounded-md border py-2 pl-3 text-sm ${
              errors.referral ? "border-red-600" : "border-gray-200"
            }`}
            onChange={(e) => setReferralPhone(e.target.value)}
          />
          {errors.referral && (
            <p className="text-red-600 text-sm mt-2">{errors.referral}</p>
          )}
          {validateReferral().message && !errors.referral && (
            <p className="text-green-600 text-sm mt-2">
              {validateReferral().message}
            </p>
          )}
        </div>

        <PaymentDetails
          totalHarga={applyDiscount()}
          pembayaran={pembayaran}
          setPembayaran={setPembayaran}
          tanggalTransaksi={tanggalTransaksi}
        />
        {errors.pembayaran && (
          <p className="text-red-600 text-sm mt-2">{errors.pembayaran}</p>
        )}
        <div className="flex gap-4 justify-end mt-6">
          <Button type="submit">Simpan</Button>
          <Button type="button" onClick={handleReset}>
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
