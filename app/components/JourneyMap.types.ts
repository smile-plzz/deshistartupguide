export type JourneyStatus = 'not-started' | 'in-progress' | 'complete'

export interface JourneyNode {
  id: string
  title: string
  description?: string
  href?: string
  status?: JourneyStatus
  badge?: string
  children?: JourneyNode[]
  note?: string
  actionText?: string
  onClick?: () => void
}

export interface JourneyMapRenderOptions {
  nodes: JourneyNode[]
  currentId?: string
  orientation?: 'horizontal' | 'vertical'
  showConnectors?: boolean
  onStatusChange?: (id: string, status: JourneyStatus) => void
}

export type JourneyMapRenderer = (nodes: JourneyNode[], options?: Partial<JourneyMapRenderOptions>) => React.ReactNode

export function isJourneyStatus(value: unknown): value is JourneyStatus {
  return typeof value === 'string' && ['not-started', 'in-progress', 'complete'].includes(value)
}

export function nextStatus(current: JourneyStatus): JourneyStatus {
  if (current === 'not-started') return 'in-progress'
  if (current === 'in-progress') return 'complete'
  return 'not-started'
}

export function countCompleted(nodes: JourneyNode[]): number {
  return nodes.filter(n => n.status === 'complete').length
}

export function flatNodes(nodes: JourneyNode[]): JourneyNode[] {
  const result: JourneyNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.children && node.children.length > 0) {
      result.push(...flatNodes(node.children))
    }
  }
  return result
}

export function findNode(nodes: JourneyNode[], id: string): JourneyNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

export function setNodeStatus(nodes: JourneyNode[], id: string, status: JourneyStatus): JourneyNode[] {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, status }
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: setNodeStatus(node.children, id, status)
      }
    }
    return node
  })
}

export function markPathComplete(nodes: JourneyNode[]): JourneyNode[] {
  const all = flatNodes(nodes)
  const updated = all.map(n => ({ ...n, status: 'complete' as const }))
  return sortNodesById(updated)
}

function sortNodesById(nodes: JourneyNode[]): JourneyNode[] {
  const map = new Map<string, JourneyNode>()
  for (const n of nodes) map.set(n.id, n)
  return nodes.sort((a, b) => a.id.localeCompare(b.id))
}
