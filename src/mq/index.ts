import { Queue, Worker } from 'bullmq'

// Create a new connection in every instance
export const myQueue = new Queue('sensors', { connection: {
  host: "localhost",
  port: 6379
}});

