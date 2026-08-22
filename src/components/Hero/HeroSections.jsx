import { sections } from './sections'
import Section from './Section'

export default function HeroSections() {
  return (
    <div>
      {sections.map((section, i) => {
        const prev = i > 0 ? sections[i - 1] : null
        const showDivider = prev && prev.bg === section.bg
        return <Section key={section.id} section={section} showDivider={showDivider} />
      })}
    </div>
  )
}
