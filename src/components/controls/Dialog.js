import * as React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const DialogOverlay = ({ open, setOpen, title, onClose, children, actions, zIndex, fullScreenHeight, fullScreenWidth, otherProps }) => {
	const close = () => {
		if (onClose) {
			onClose();
		}
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onClose={close}
			{...otherProps}
			className="relative h-full w-full z-[1000] sys-dialog"
			style={{ zIndex: zIndex }}>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>
			<div
				className="fixed inset-0 z-[1000] w-screen overflow-y-hidden max-h-screen content-center"
				style={{ zIndex: zIndex }}>
				<div className="flex h-full overflow-y-hidden justify-center items-center text-center">
					<DialogPanel
						transition
						className={classNames(
							fullScreenHeight ? "h-screen" : "h-max",
							fullScreenWidth ? "w-screen px-4" : "w-max",
							"flex min-w-80 max-h-screen max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl py-4 text-left justify-center transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in",
						)}>
						<div className="flex flex-col w-full max-h-full rounded-lg bg-white overflow-hidden shadow-xl">
							{title && (
								<div className="p-4 border-b flex justify-between">
									<DialogTitle
										as="h3"
										className="text-xl capitalize font-semibold leading-6 overflow-ellipsis text-gray-900">
										{title}
									</DialogTitle>
									<button
										className="border-none"
										onClick={close}>
										<FontAwesomeIcon
											icon={faXmark}
											className="h-5 w-5 text-slate-400"
										/>
									</button>
								</div>
							)}
							<div
								className="p-3 h-full overflow-auto text-center content-center max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl"
								style={{ minHeight: 100, minWidth: 300 }}>
								{children}
							</div>
						</div>
						{actions && <div className="border-t p-2 flex justify-end gap-2">{actions}</div>}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default DialogOverlay;
