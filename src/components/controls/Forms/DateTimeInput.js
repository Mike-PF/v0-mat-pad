import { Datepicker } from "headless-datetimepicker";
import { uniqueId } from "lodash";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

function DatePickerCalendar({ value, setValue }) {
	return (
		<div>
			<Datepicker
				onChange={setValue}
				value={value}
			>
				<Datepicker.Input
					format="dd/MM/yyy"
					className="block max-w-400 w-48 rounded-md border h-10 px-1.5 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-lg sm:leading-6"
				/>
				<Datepicker.Picker
					defaultType="day"
					className="z-50 rounded-md bg-white p-4 shadow-md text-black w-[352px] border-gray-300 border-solid border-2"
				>
					{({ monthName, year }) => (
						<>
							<div className="flex w-full items-center justify-between space-x-6 py-2 rtl:space-x-reverse">
								<Datepicker.Button
									action="prev"
									className="rounded-full border-none p-2 text-sm font-medium hover:bg-secondary-100 hover:text-white rtl:rotate-180"
								>
									Prev
								</Datepicker.Button>
								<div className="flex">
									<Datepicker.Button
										action="toggleMonth"
										className="leading-2 border-none p-2 text-lg font-semibold hover:bg-secondary-100 hover:text-white"
									>
										{monthName}
									</Datepicker.Button>
									<Datepicker.Button
										action="toggleYear"
										className="leading-2 border-none p-2 text-lg font-semibold hover:bg-secondary-100 hover:text-white"
									>
										{year}
									</Datepicker.Button>
								</div>
								<Datepicker.Button
									action="next"
									className="rounded-full p-2 border-none text-sm font-medium hover:bg-secondary-100 hover:text-white rtl:rotate-180"
								>
									Next
								</Datepicker.Button>
							</div>
							<Datepicker.Items
								className={({ type }) =>
									classNames(
										"grid p-1 border-none w-full auto-rows-max gap-4 overflow-y-auto scroll-smooth",
										type == "day" && "grid-cols-7",
										type == "month" && "grid-cols-3",
										type == "year" &&
											"max-h-[274px] grid-cols-4"
									)
								}
							>
								{({ items }) =>
									items.map((item) => (
										<Datepicker.Item
											key={uniqueId(`${item.key}`)}
											item={item}
											className={classNames(
												"grid border-none items-center justify-center rounded-full py-1.5 text-sm font-medium select-none",
												item.isHeader
													? "cursor-default"
													: "hover:bg-secondary-100",
												"isInCurrentMonth" in item &&
													item.isInCurrentMonth
													? "text-black"
													: "text-slate-400",
												item.type === "day" &&
													"h-8 w-8",
												item.isSelected &&
													"bg-primary-500 text-white",
												item.isToday &&
													"border border-primary-100"
											)}
											action={
												item.type === "day"
													? "close"
													: item.type === "month"
													? "showDay"
													: "showMonth"
											}
										>
											{item.isHeader
												? item.text.substring(0, 2)
												: item.text}
										</Datepicker.Item>
									))
								}
							</Datepicker.Items>
							<Datepicker.Button
								action="today"
								className="mt-4 w-full bg-primary-500 text-white p-2 text-sm font-medium hover:bg-secondary-100"
							>
								Today
							</Datepicker.Button>
						</>
					)}
				</Datepicker.Picker>
			</Datepicker>
		</div>
	);
}

export default DatePickerCalendar;
