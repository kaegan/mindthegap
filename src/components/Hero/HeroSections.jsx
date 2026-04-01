import { sections } from './sections'
import Section from './Section'

export default function HeroSections() {
  return (
    <div>
      {sections.map((section, i) => (
        <Section key={section.id} section={section} showDivider={i > 0} />
      ))}
    </div>
  )
}
