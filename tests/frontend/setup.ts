import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

// очистка после тестов подключается явно
afterEach(() => {
  cleanup()
})
