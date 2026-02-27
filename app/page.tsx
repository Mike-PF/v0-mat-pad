export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">MAT Pad</h1>
        <p className="text-slate-600 mb-6">Forms and Reports Management System</p>
        <div className="flex gap-4 justify-center">
          <a 
            href="/forms" 
            className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Forms
          </a>
          <a 
            href="/reports" 
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Reports
          </a>
        </div>
      </div>
    </div>
  )
}
