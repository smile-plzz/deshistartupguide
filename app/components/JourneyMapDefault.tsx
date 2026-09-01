import { JourneyMap } from './JourneyMap'
import type { JourneyNode } from './JourneyMap.types'

interface JourneyMapDefaultProps {
  nodes: JourneyNode[]
  currentId?: string
}

export function DefaultJourneyMap({ nodes, currentId }: JourneyMapDefaultProps): React.ReactElement {
  const root = nodes[0]
  return (
    <JourneyMap
      nodes={nodes}
      currentId={currentId}
      orientation="vertical"
      showConnectors
    />
  )
}
