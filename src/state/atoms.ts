import { atom } from 'recoil';
import type { Event } from '../types/event';
import type { ModuleDefinition } from '../types/module';

// Current event being created/edited
export const eventState = atom<Event>({
  key: 'eventState',
  default: {
    name: '',
    phoneNumber: '',
    dateTime: '',
    location: '',
    description: '',
    cost: '',
    flyerImage: undefined,
    backgroundImage: undefined,
    modules: [],
    enabledFields: [],
  },
});

// Available module types from backend
export const availableModulesState = atom<ModuleDefinition[]>({
  key: 'availableModulesState',
  default: [],
});

