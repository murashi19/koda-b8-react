import { IoChatbubbleOutline } from "react-icons/io5";

function ButtonMessage() {
	return (
		<>
			<button
				type='button'
				aria-label='Chat'
				className='fixed right-6 bottom-6 w-14 h-14 rounded-full btn-primary shadow-lg hover:scale-105 flex items-center justify-center cursor-pointer border-none z-20 transition-colors duration-200'>
				<IoChatbubbleOutline className='w-5 h-5 text-white' />
			</button>
		</>
	);
}

export default ButtonMessage;
