# AsyncFlow

AsyncFlow is a distributed background job processing platform built to demonstrate backend engineering fundamentals that matter in production systems: durable job tracking, asynchronous processing, retries, dead-letter handling, rate limiting, monitoring, and horizontal worker scaling.

The project uses:

- Node.js + Express for the API
- PostgreSQL + Sequelize for durable job state
- Redis + BullMQ for distributed queueing
- Multiple workers for parallel processing


