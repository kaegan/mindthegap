export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 py-8 px-6 text-center text-sm text-gray-500">
      <p>
        Built by Kaegan Donnelly &middot; Data from{' '}
        <a href="https://www.translink.ca" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
          TransLink
        </a>{' '}
        &amp;{' '}
        <a href="https://www.statcan.gc.ca" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
          Statistics Canada
        </a>
      </p>
    </footer>
  )
}
