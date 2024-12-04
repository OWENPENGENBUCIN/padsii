import React from "react";
import { MemberTable } from "@/app/lib/definitions";

type MemberSelectorProps = {
    member: MemberTable[];
    selectedMember: string;
    setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
    setSelectedMemberName: React.Dispatch<React.SetStateAction<string>>;
};

export default function MemberSelector({
    member,
    selectedMember,
    setSelectedMember,
    setSelectedMemberName,
}: MemberSelectorProps) {
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setSelectedMember(selectedId);

        const selectedMemberData = member.find((item) => item.id === selectedId);
        setSelectedMemberName(selectedMemberData?.nama_member || "");
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Pilih Member</label>
            <select
                className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
                value={selectedMember}
                onChange={handleSelectionChange}
                name="member_id"
            >
                <option value="">Pilih Member</option>
                {member.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.nama_member} - {item.nohp_member}
                    </option>
                ))}
            </select>
        </div>
    );
}
