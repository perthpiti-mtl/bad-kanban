import { describe, it, expect } from 'vitest'
import { GET } from '../../../src/routes/api/health/+server'

interface HealthResponse {
	status: 'healthy' | 'unhealthy'
	timestamp: string
	uptime: number
	memory: {
		used: number
		total: number
		usage: number
	}
	version: string
	environment: string
}

describe('Health Check Endpoint', () => {
	it('should return healthy status with correct structure', async () => {
		// Create mock request
		const request = new Request('http://localhost:3000/api/health')
		
		// Call the handler
		const response = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		
		// Verify response status
		expect(response.status).toBe(200)
		
		// Parse response JSON
		const healthData: HealthResponse = await response.json()
		
		// Verify response structure
		expect(healthData).toHaveProperty('status')
		expect(healthData).toHaveProperty('timestamp')
		expect(healthData).toHaveProperty('uptime')
		expect(healthData).toHaveProperty('memory')
		expect(healthData).toHaveProperty('version')
		expect(healthData).toHaveProperty('environment')
		
		// Verify response values
		expect(healthData.status).toBe('healthy')
		expect(healthData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
		expect(typeof healthData.uptime).toBe('number')
		expect(healthData.uptime).toBeGreaterThanOrEqual(0)
		
		// Verify memory object structure
		expect(healthData.memory).toHaveProperty('used')
		expect(healthData.memory).toHaveProperty('total')
		expect(healthData.memory).toHaveProperty('usage')
		expect(typeof healthData.memory.used).toBe('number')
		expect(typeof healthData.memory.total).toBe('number')
		expect(typeof healthData.memory.usage).toBe('number')
		expect(healthData.memory.used).toBeGreaterThan(0)
		expect(healthData.memory.total).toBeGreaterThan(0)
		expect(healthData.memory.usage).toBeGreaterThanOrEqual(0)
		expect(healthData.memory.usage).toBeLessThanOrEqual(100)
		
		// Verify version and environment
		expect(typeof healthData.version).toBe('string')
		expect(typeof healthData.environment).toBe('string')
	})
	
	it('should return correct headers', async () => {
		// Create mock request
		const request = new Request('http://localhost:3000/api/health')
		
		// Call the handler
		const response = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		
		// Verify headers
		expect(response.headers.get('Content-Type')).toBe('application/json')
		expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
	})
	
	it('should return timestamp in ISO format', async () => {
		// Create mock request
		const request = new Request('http://localhost:3000/api/health')
		
		// Call the handler
		const response = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		
		// Parse response JSON
		const healthData: HealthResponse = await response.json()
		
		// Verify timestamp is valid ISO string
		const timestamp = new Date(healthData.timestamp)
		expect(timestamp.toISOString()).toBe(healthData.timestamp)
		
		// Verify timestamp is recent (within last 5 seconds)
		const now = new Date()
		const diff = now.getTime() - timestamp.getTime()
		expect(diff).toBeLessThan(5000)
		expect(diff).toBeGreaterThanOrEqual(0)
	})
	
	it('should return consistent structure across multiple calls', async () => {
		// Create mock request
		const request = new Request('http://localhost:3000/api/health')
		
		// Make multiple calls
		const response1 = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		const response2 = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		
		// Parse responses
		const health1: HealthResponse = await response1.json()
		const health2: HealthResponse = await response2.json()
		
		// Verify structure consistency
		expect(Object.keys(health1).sort()).toEqual(Object.keys(health2).sort())
		expect(Object.keys(health1.memory).sort()).toEqual(Object.keys(health2.memory).sort())
		
		// Verify status is consistently healthy
		expect(health1.status).toBe('healthy')
		expect(health2.status).toBe('healthy')
		
		// Verify uptime increases or stays the same
		expect(health2.uptime).toBeGreaterThanOrEqual(health1.uptime)
	})
	
	it('should handle memory calculations correctly', async () => {
		// Create mock request
		const request = new Request('http://localhost:3000/api/health')
		
		// Call the handler
		const response = await GET({ request, url: new URL('http://localhost:3000/api/health'), params: {} })
		
		// Parse response JSON
		const healthData: HealthResponse = await response.json()
		
		// Verify memory values are reasonable
		expect(healthData.memory.used).toBeGreaterThan(0)
		expect(healthData.memory.used).toBeLessThan(healthData.memory.total)
		
		// Verify usage calculation
		const expectedUsage = Math.round((healthData.memory.used / healthData.memory.total) * 100)
		expect(Math.abs(healthData.memory.usage - expectedUsage)).toBeLessThanOrEqual(1) // Allow for rounding differences
	})
})