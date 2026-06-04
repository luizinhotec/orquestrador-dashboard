import { proxyGet } from '../_proxy'

export async function GET() {
  return proxyGet('/webhook/dashboard')
}
