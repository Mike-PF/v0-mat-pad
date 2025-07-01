import React from "react";
import _ from "lodash";
import Button from "./Button";
import DialogOverlay from "./Dialog";

const AlertContext = React.createContext();
const AlertContextProvider = () => {
	const [parameters, setParameters] = React.useState({
		visible: false,
	});
	const zIndex = React.useRef(15001);

	return (AlertContext.options = { parameters, setParameters, zIndex });
};

const Alert = () => {
	if (AlertContext?.options?.parameters?.visible === true && AlertContext?.options?.zIndex?.current > 0) AlertContext.options.zIndex.current++;

	return (
		<>
			{AlertContext?.options?.parameters?.visible === true && (
				<div className={"Mike"}>
					HERE
					<DialogOverlay
						fullScreenHeight={AlertContext.options.parameters.fullScreenHeight ?? false}
						fullScreenWidth={AlertContext.options.parameters.fullScreenWidth ?? false}
						open={AlertContext?.options?.parameters?.visible}
						setOpen={() => {}}
						key={"dlg"}
						onClose={() => {
							AlertContext.options.setParameters({
								visible: false,
							});
							if (typeof AlertContext.options.parameters.onClosed === "function") AlertContext.options.parameters.onClosed();
						}}
						zIndex={AlertContext?.options?.zIndex?.current}
						title={AlertContext.options.parameters.title == null ? null : AlertContext.options.parameters.title || "MATpad"}
						actions={
							_.isArray(AlertContext.options.parameters.buttons) &&
							AlertContext.options.parameters.buttons.length > 0 && (
								<div className="flex justify-end w-full gap-2">
									{(AlertContext.options.parameters.buttons || [{ text: "OK" }]).map((b) => {
										return (
											<Button
												key={b.text}
												className={b.class}
												onClick={(e) => {
													if (b.click && b.click(e) === false) {
														try {
															e.preventDefault();
														} catch (e) {}
														return false;
													}
													AlertContext.options.setParameters({
														...AlertContext.options.parameters,
														visible: false,
													});
												}}>
												{b.text}
											</Button>
										);
									})}
								</div>
							)
						}>
						{AlertContext.options.parameters.body}
					</DialogOverlay>
				</div>
			)}
		</>
	);
};

function showAlert({ body, title, buttons, ...Component }) {
	var options = {
		...Component,
		visible: true,
		title: title || "MATpad",
		body: body,
		buttons: _.isArray(buttons) ? buttons : [{ text: "OK" }],
	};
	AlertContext.options.setParameters(options);
}

function showPleaseWait(additionalText) {
	AlertContext.options.setParameters({
		visible: true,
		title: null,
		body: (
			<div className="please-wait">
				<span>
					Please wait
					{additionalText ? <> - {additionalText}</> : null}
				</span>
				<i className="fa-solid fa-loader fa-spin"></i>
			</div>
		),
		buttons: [],
	});
}

function hidePleaseWait() {
	AlertContext.options.setParameters({
		visible: false,
	});
}

function hideAlert() {
	AlertContext.options.setParameters({
		visible: false,
	});
}

export default Alert;
export { AlertContext, AlertContextProvider, showAlert, showPleaseWait, hidePleaseWait, hideAlert };
