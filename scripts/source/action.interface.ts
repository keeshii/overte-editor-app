
export interface Action {
  type: string;
}

export interface UpdateAction {
  type: 'UPDATE';
  position: number;
  remove: number;
  insert: string;
}

export interface SetStateAction {
  type: 'SET_STATE';
  content: string;
  fileName: string;
}
