
export interface WebAction {
  type: string;
  [property: string]: any;
}

export interface UpdateAction {
  position: number;
  remove: number;
  insert: string;
}

export interface EditorUserData {
  fileName: string;
  scriptType: 'client' | 'server';
  editingEntityId: Uuid;
  grabbableKey?: any;
}
