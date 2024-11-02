import { Scheduler } from "./scheduler";

enum EventType {
    COMMAND = 'COMMAND',
    INTERNAL_EVENT = 'INTERNAL_EVENT'
  }

interface Event {
    event_type: EventType;
    thingId?: string;
    event_name?: string;
    params?: any;
    priority: number;
    timestamp: number;
}  

class EventQueue {
    private eventQueue: Event[] = [];  

    enqueueEvent(event: Event) {
        this.eventQueue.push(event);
        
        this.eventQueue.sort((a, b) => {
            if (a.priority !== b.priority) {
              return b.priority - a.priority;
            }
            return a.timestamp - b.timestamp;
          });
    }

    enqueueCommand(thingId: string, command: string) {
        this.enqueueEvent({
            event_type : EventType.COMMAND,
            thingId : thingId,
            event_name : command,
            params : undefined,
            priority : 1,
            timestamp : Date.now(),
        });
    }

    private async handleEvent(event: Event, scheduler?:Scheduler) {
        switch (event.event_type) {
    
          case EventType.COMMAND:
            if (event.thingId && event.event_name && scheduler) {
                scheduler.handleCommand(event.thingId, event.event_name);
            }
            break;
    
          case EventType.INTERNAL_EVENT:
            // Internal event triggered by other Things
            break;
        }
    }

    public async processQueue(scheduler?: Scheduler) {
        if (this.eventQueue.length === 0) {
          return;
        }

        try {
            const event = this.eventQueue.shift();
            await this.handleEvent(event as Event, scheduler);
        } catch (error) {
          console.error(`Error processing event: ${error}`);
        }
    
        setImmediate(() => this.processQueue(scheduler));
      }

}

export const eventQueue = new EventQueue();
