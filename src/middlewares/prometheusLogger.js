import client from 'prom-client'
const register = new client.Registry()
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 1.5, 10], // Customize these buckets as per your use case
})

// Register the metric
register.registerMetric(httpRequestDuration)

// Expose default metrics (e.g., process memory usage, CPU usage)
client.collectDefaultMetrics({ register })

export { httpRequestDuration, register }
