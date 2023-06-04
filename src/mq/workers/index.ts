import { Worker, Job } from 'bullmq';
import { handleTemperature } from './handle-temperature';
import { handlebpm } from './handle-bpm';
import { handleSPO2 } from './handle-spo2';

export const worker = new Worker(
  'sensors',
  async (job: Job) => {

    switch(job.name) {
        case 'temperature':
            handleTemperature(job.data)
            break;
        case 'heart_bpm':
            handlebpm(job.data)
            break;
        case 'spo2':
            handleSPO2(job.data)
            break;
    }
    return
  },
  { autorun: false, connection: {
    host: "localhost",
    port: 6379
  }},

);

