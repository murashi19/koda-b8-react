const steps = ["Pengiriman", "Pembayaran", "Konfirmasi"];

export default function ProgressBar({ currentStep }) {
	return (
		<div className='flex items-center justify-center gap-0 mb-2'>
			{steps.map((label, i) => {
				const stepNum = i + 1;
				const isDone = stepNum < currentStep;
				const isActive = stepNum === currentStep;

				return (
					<div
						key={label}
						className='flex items-center'>
						{/* Step circle + label */}
						<div className='flex flex-col items-center gap-1.5'>
							<div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isDone ? "bg-green-500 text-white" : isActive ? "bg-[#1a73e8] text-white" : "bg-gray-200 text-gray-500"}`}>
								{isDone ? "✓" : stepNum}
							</div>
							<span className={`text-xs font-semibold ${isActive ? "text-[#1a73e8]" : isDone ? "text-green-500" : "text-gray-500"}`}>{label}</span>
						</div>

						{/* Connector line (not after last step) */}
						{i < steps.length - 1 && <div className={`w-40 h-0.75 mx-3 mb-5 ${isDone ? "bg-green-500" : "bg-gray-200"}`} />}
					</div>
				);
			})}
		</div>
	);
}
