"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserCircleIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { useRouter } from "next/navigation";
import { createMember } from "@/app/lib/member/cruds-member";

type State = {
  message?: string;
  errors?: {
    nama_member?: string[];
    nohp_member?: string[];
  };
};

export default function Form() {
  const [state, setState] = useState<State>({ message: "", errors: {} });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({ message: "", errors: {} });

    const formData = new FormData(e.currentTarget);

    try {
      const response = await createMember(formData);

      if (!response.success) {
        setState({
          message: response.message,
          errors: response.errors || {},
        });
      } else {
        router.refresh();
        router.push("/dashboard/member");
      }
    } catch (error) {
      console.error("Error creating member:", error);
      setState({
        message: "An unexpected error occurred.",
        errors: {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="nama_member" className="block text-sm font-medium mb-2">
            Name
          </label>
          <div className="relative">
            <input
              id="nama_member"
              name="nama_member"
              type="text"
              placeholder="Nama Member"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder-gray-500"
            />
            <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {state.errors?.nama_member && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.nama_member.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="nohp_member" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              id="nohp_member"
              name="nohp_member"
              type="text"
              placeholder="Nomor HP"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder-gray-500"
            />
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {state.errors?.nohp_member && (
            <div className="mt-2 text-sm text-red-500">
              {state.errors.nohp_member.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {state.message && (
        <div
          className={`mt-4 text-sm ${
            state.message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/member"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Member"}
        </Button>
      </div>
    </form>
  );
}
