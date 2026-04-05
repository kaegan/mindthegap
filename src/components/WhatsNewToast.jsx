import { useState, useEffect } from 'react'
import { IconXmarkFillDuo18 as X } from 'nucleo-ui-fill-duo-18'
import { IconRankingFillDuo18 as Ranking } from 'nucleo-ui-fill-duo-18'
import fullPictureImg from '../assets/full-picture.png'

const CURRENT_VERSION = '2026-04-03-gap-explorer'
const STORAGE_KEY = 'mtg-whats-new-seen'

export default function WhatsNewToast() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (seen === CURRENT_VERSION) return

    const timer = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, CURRENT_VERSION)
    }, 250)
  }

  function handleExplore() {
    dismiss()
    setTimeout(() => {
      document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed z-[2000] bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl overflow-hidden
        bottom-0 left-0 right-0 rounded-t-xl sm:rounded-xl sm:bottom-5 sm:right-5 sm:left-auto sm:w-80
        ${closing ? 'whats-new-toast-out' : 'whats-new-toast-in'}`}
    >
      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute top-2.5 right-2.5 z-10 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Thumbnail — hidden on mobile for compactness */}
      <div className="relative h-32 overflow-hidden hidden sm:block">
        <img
          src={fullPictureImg}
          alt="Gap Explorer showing the 25 worst transit coverage gaps"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600 text-[10px] font-semibold text-white uppercase tracking-wider">
            New
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-1.5 sm:pt-2.5">
        <div className="flex items-start gap-2.5">
          <span className="inline-flex sm:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-violet-600 text-[10px] font-semibold text-white uppercase tracking-wider shrink-0 mt-0.5">
            New
          </span>
          <Ranking className="w-4 h-4 text-violet-400 mt-0.5 shrink-0 hidden sm:block" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-heading leading-snug">
              Gap Explorer is here
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
              Browse the 25 worst transit gaps ranked by impact. Click any to fly there on the map.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-3 pt-2 flex gap-2">
        <button
          onClick={dismiss}
          className="flex-1 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Dismiss
        </button>
        <button
          onClick={handleExplore}
          className="flex-1 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          See it
        </button>
      </div>
    </div>
  )
}
