import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

// vitest работает без globals, поэтому авто-cleanup Testing Library подключаем явно.
afterEach(() => {
  cleanup()
})
