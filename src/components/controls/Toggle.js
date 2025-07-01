import { Switch } from "@headlessui/react";

export default function ToggleButton({
    enabled,
    setEnabled,
    srTitle,
    readOnly,
}) {
    return (
        <Switch
            aria-readonly={readOnly}
            checked={enabled}
            onChange={setEnabled}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-red-400 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 data-[checked]:bg-green-400"
        >
            <span className="sr-only">{srTitle ?? "Toggle"}</span>
            <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
        </Switch>
    );
}
