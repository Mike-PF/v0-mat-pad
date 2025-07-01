function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function PermissionToggle({
    onLeftClick,
    onMiddleClick,
    onRightClick,
    permission,
}) {
    return (
        <div className="flex items-center hover:opacity-60">
            <div
                aria-hidden="true"
                className={classNames(
                    permission?.granted === true
                        ? "translate-x-[59px] bg-green-400"
                        : permission?.denied === true
                        ? "translate-x-[18px] bg-red-400"
                        : "translate-x-11 bg-slate-300",
                    "flex items-center justify-center pointer-events-none h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out"
                )}
            />
            <button
                onClick={onLeftClick}
                className={
                    "bg-slate-100 flex items-center justify-center opacity-100 h-6 w-6 border-y border-l border-r-0 border-slate-200 rounded-r-none rounded-l-lg"
                }
            >
                <div className="rounded-full bg-white h-2 w-2 z-10" />
            </button>
            <button
                onClick={onMiddleClick}
                className={
                    "bg-slate-100 flex items-center justify-center opacity-100 group h-6 w-6 border-y border-x-0 border-slate-200 rounded-none"
                }
            >
                <div className="rounded-full bg-white h-2 w-2 z-10" />
            </button>
            <button
                onClick={onRightClick}
                className={
                    "bg-slate-100 flex items-center justify-center opacity-100 h-6 w-6 border-y border-r border-l-0 border-slate-200 rounded-l-none rounded-r-lg"
                }
            >
                <div className="rounded-full bg-white h-2 w-2 z-10" />
            </button>
        </div>
    );
}
