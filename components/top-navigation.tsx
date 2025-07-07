"use client"

export function TopNavigation() {
  return (
    <div className="w-full rounded-lg h-14 bg-white border border-slate-200 flex items-center justify-between px-4">
      {/* Navigation Tabs */}
      <div className="flex h-full">
        <a href="/forms" className="font-semibold text-slate-900 border-b-2 border-blue-500 px-4 flex items-center">
          Dashboard
        </a>
        <a href="/forms/maintenance" className="font-normal text-slate-700 px-4 flex items-center hover:text-slate-900">
          Maintenance
        </a>
      </div>

      {/* Progress Section and User Profile */}
      <div className="flex items-center gap-6">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">Progress:</div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "15%" }}></div>
            </div>
            <span className="text-sm font-medium text-slate-700">3/20</span>
          </div>
          <div className="text-xs text-slate-500">sections completed</div>
        </div>

        {/* User Profile */}
        <div className="flex items-center">
          <button className="flex items-center p-1.5 hover:bg-slate-50 rounded-lg">
            <div className="bg-slate-100 rounded-full h-9 w-9 flex items-center justify-center text-sm font-medium text-slate-700">
              GH
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
