import { Scheduler } from "./simulation/scheduler";
import { initialize } from "./simulation/init";
import mqtt from 'mqtt';

// Instantiate the Scheduler
const scheduler = new Scheduler(100);

/**
 * Initialize Things, Environment and Servients by reading  
 * configuration and exposing them via the specified Servient
 **/
initialize(scheduler).then(() => {
    // Start the Scheduler to process events and periodic actions
    scheduler.start();
});

        