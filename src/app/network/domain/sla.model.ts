export class SLAModel {
  id?: string;
  name: string;
  active: boolean;
  message: string;
  schedule: string;
  conditions: SALCondition[];
  notifications: NotificationModel[];
  createdTime?: number;
  frequency: {
    type: string;
    value: number;
  };
  nextExecutionTime?: number;
  template?: boolean = false;
  lastExecution?: {
    createdTime: number;
    success: boolean;
  };
}

export class SALCondition {
  type: string;
  active: boolean;
  label: string;
  environment?: string;
  serviceName?: string;
  operator?: string;
  value?: string;
  url?: string;
  method?: string;
  headers?: string;
  body?: string;
  lastExecution?: {
    success: boolean;
    value: number;
  };
}

export class NotificationModel {
  type: string;
  active: boolean;
  receivers?: string[];
  channels?: string[];
}
