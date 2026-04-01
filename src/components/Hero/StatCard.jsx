import { DollarSign, Clapperboard, Rocket } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

const icons = { DollarSign, Clapperboard, Rocket }

export default function StatCard({ numericValue, suffix, iconName, label, visible }) {
  const Icon = iconName ? icons[iconName] : null
  return (
    <div className="cs-panel p-6 flex-1 min-w-[200px] border-t-2 border-violet-500/30">
      {Icon && (
        <div className="mb-3">
          <Icon size={24} className="text-violet-400/70" strokeWidth={1.5} />
        </div>
      )}
      <div className="mb-2">
        <AnimatedNumber target={numericValue} suffix={suffix} visible={visible} />
      </div>
      <div className="text-sm text-gray-400 leading-relaxed">{label}</div>
    </div>
  )
}
