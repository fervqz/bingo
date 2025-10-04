interface NavbarProps {
  onSave: () => void;
  isSaving: boolean;
  onDownload?: () => void;
}

export default function Navbar({ onSave, isSaving, onDownload }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600">Bingo Generator</a>
            <a href="/picker" className="text-gray-700 hover:text-blue-600">Image Picker</a>
          </div>
          <div className="flex-1 flex justify-end space-x-4">
            {onDownload && (
              <button
                onClick={onDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download Labels
              </button>
            )}
            <button
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Cards'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
