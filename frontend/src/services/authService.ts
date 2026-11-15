import { simulate } from './mockApi'
import type { Role, SessionUser } from '../types'

// Practice accounts only. Real login (hashed passwords + JWT) comes in Check 5.
const users: { username: string; password: string; role: Role }[] = [
  { username: 'staff', password: 'staff123', role: 'STAFF' },
  { username: 'manager', password: 'manager123', role: 'MANAGER' },
]

export const authService = {
  login: (username: string, password: string) =>
    simulate((): SessionUser => {
      const u = users.find((x) => x.username === username && x.password === password)
      if (!u) throw new Error('Invalid username or password')
      return { username: u.username, role: u.role }
    }),
}
