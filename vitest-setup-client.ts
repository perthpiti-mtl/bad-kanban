/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend vitest expect with jest-dom matchers
expect.extend(matchers)
