import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-[#f2f6fe]">
      <div className=" mx-auto flex w-full max-w-[1000px] flex-col space-y-2.5 rounded-lg md:-mt-32 border shadow-xl bg-white" >
        <LoginForm />
      </div>
    </main>
  );
}