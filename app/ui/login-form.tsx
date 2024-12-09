'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import Image from 'next/image';
import { LoginImg } from '@/public';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <section className="flex flex-col lg:flex-row">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-lg text-start">
          <h1 className="text-2xl font-bold sm:text-3xl text-[#ff9751]">
            Please log in to continue.
          </h1>
          <p className="mt-4 text-gray-500">
            Enter your credentials to access your account.
          </p>
        </div>

        <form
          action={formAction}
          className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter your email address"
                required
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              No account?
              <a className="underline" href="#">
                Sign up
              </a>
            </p>

            <Button
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              aria-disabled={isPending}
            >
              Log in <ArrowRightIcon className="ml-2 h-5 w-5 text-white" />
            </Button>
          </div>
        </form>
      </div>

      <div className=" h-64 w-1/2 sm:h-96 lg:h-auto border">
        <Image
          alt=""
          className="object-cover w-full h-full"
          src={LoginImg}
        />
      </div>
    </section>
  );
}
