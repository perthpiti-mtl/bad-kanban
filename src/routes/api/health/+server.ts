import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

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

interface MemoryInfo {
	heapUsed: number
	heapTotal: number
	external: number
	rss?: number
	arrayBuffers?: number
}

interface ProcessInfo {
	uptime: number
	memoryUsage: MemoryInfo
	platform: string
	env: Record<string, string | undefined>
}

// Helper function to safely access process or provide fallbacks
function getProcessInfo(): ProcessInfo {
	if (typeof process !== 'undefined') {
		return {
			uptime: process.uptime(),
			memoryUsage: process.memoryUsage(),
			platform: process.platform,
			env: process.env
		}
	}
	
	// Fallback for non-Node.js environments (like tests)
	return {
		uptime: 0,
		memoryUsage: {
			heapUsed: 50 * 1024 * 1024, // 50MB fallback
			heapTotal: 100 * 1024 * 1024, // 100MB fallback
			external: 10 * 1024 * 1024 // 10MB fallback
		},
		platform: 'unknown',
		env: { NODE_ENV: 'test', npm_package_version: '0.0.1' }
	}
}

// Helper function to get total memory
async function getTotalMemory(memoryUsage: MemoryInfo, platform: string): Promise<number> {
	if (platform === 'linux' && typeof process !== 'undefined') {
		try {
			// Use dynamic import to avoid require
			const os = await import('os')
			return os.totalmem()
		} catch {
			// Fall through to fallback
		}
	}
	
	return memoryUsage.heapTotal + memoryUsage.external
}

export const GET: RequestHandler = async () => {
	try {
		const processInfo = getProcessInfo()
		const totalMemory = await getTotalMemory(processInfo.memoryUsage, processInfo.platform)

		const healthData: HealthResponse = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			uptime: Math.floor(processInfo.uptime),
			memory: {
				used: Math.round(processInfo.memoryUsage.heapUsed / 1024 / 1024), // MB
				total: Math.round(totalMemory / 1024 / 1024), // MB
				usage: Math.round((processInfo.memoryUsage.heapUsed / totalMemory) * 100) // percentage
			},
			version: processInfo.env.npm_package_version || '0.0.1',
			environment: processInfo.env.NODE_ENV || 'development'
		}

		return json(healthData, {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate'
			}
		})
	} catch (error) {
		console.error('Health check failed:', error)
		
		const processInfo = getProcessInfo()
		const unhealthyData: HealthResponse = {
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
			uptime: Math.floor(processInfo.uptime),
			memory: {
				used: 0,
				total: 0,
				usage: 0
			},
			version: processInfo.env.npm_package_version || '0.0.1',
			environment: processInfo.env.NODE_ENV || 'development'
		}

		return json(unhealthyData, {
			status: 503,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate'
			}
		})
	}
}