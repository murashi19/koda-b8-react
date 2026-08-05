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
							<div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isDone ? "bg-success text-white" : isActive ? "bg-primary text-white" : "bg-border text-text-secondary"}`}>
								{isDone ? "✓" : stepNum}
							</div>
							<span className={`text-xs font-semibold ${isActive ? "text-primary" : isDone ? "text-success" : "text-text-secondary"}`}>{label}</span>
						</div>

						{/* Connector line (not after last step) */}
						{i < steps.length - 1 && <div className={`w-40 h-0.75 mx-3 mb-5 ${isDone ? "bg-success" : "bg-border"}`} />}
					</div>
				);
			})}
		</div>
	);
}
