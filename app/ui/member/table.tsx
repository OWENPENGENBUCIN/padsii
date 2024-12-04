import { DeleteMemberButton, UpdateMemberButton } from '@/app/ui/member/buttons';
import { fetchFilteredMembers } from '@/app/lib/member/member';

export default async function MemberTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  try {
    const members = await fetchFilteredMembers(query, currentPage);

    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {members?.map((member) => (
                <div
                  key={member.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div>
                          <p>{member.nama_member}</p>
                          <p>{member.nohp_member}</p>
                          <p>{member.referral_count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Nama Member
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    No HP
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                   Referal Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {members?.map((member) => (
                  <tr
                    key={member.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-3">
                        <p>{member.nama_member}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <p>{member.nohp_member}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <p>{member.referral_count}</p>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateMemberButton id={member.id} />
                        <DeleteMemberButton id={member.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching member data:', error);
    return <div>Error fetching member data</div>;
  }
}
