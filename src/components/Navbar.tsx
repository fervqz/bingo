interface NavbarProps {
  onSave: () => void;
  isSaving: boolean;
}

export default function Navbar({ onSave, isSaving }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Bingo Generator</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSaving ? 'Saving...' : 'Save Bingo Cards'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
