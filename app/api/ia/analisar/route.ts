import { proxyPost } from '../../_proxy'

export async function POST() {
  return proxyPost('/webhook/ia/analisar', {})
}
