import Allocations from "./AllocationTypes";

interface Server {
    object: string;
    attributes: {
      id: number;
      external_id: null | string;
      uuid: string;
      identifier: string;
      name: string;
      description: string;
      status: null | string;
      suspended: boolean;
      limits: {
        memory: number;
        swap: number;
        disk: number;
        io: number;
        cpu: number;
        threads: null | number;
        oom_disabled: boolean;
      };
      feature_limits: {
        databases: number;
        allocations: number;
        backups: number;
      };
      user: number;
      node: number;
      allocation: number;
      allocationType: Allocations;
      nest: number;
      egg: number;
      container: {
        startup_command: string;
        image: string;
        installed: number;
        environment: { [key: string]: string | boolean | number };
      };
      updated_at: string;
      created_at: string;
    };
  }

  export default Server;