type ErrorMessagesProps = {
    errors: { menu?: string; pembayaran?: string; member?: string };
};

export default function ErrorMessages({ errors }: ErrorMessagesProps) {
    return (
        <div>
            {errors.pembayaran && (
                <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-600 rounded-md flex items-start">
                    <svg className="h-5 w-5 mr-3 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                    </svg>
                    <p>{errors.pembayaran}</p>
                </div>
            )}

        </div>
    );
}
