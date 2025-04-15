// src/shared/sync.types.ts
import { Cliente } from '../clients/schemas/client.schema';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type SyncOperation = {
  id?: string;
  action?: 'create' | 'update' | 'delete';
  documento: string;
} & Partial<Omit<Cliente, '_id'>>;

export type SyncSuccessResult = {
  id: Types.ObjectId | string;
  status: string;
  documento: string;
} & Partial<Cliente>;

export type SyncErrorResult = {
  error: string;
  documento?: string;
  details?: unknown;
};

export type SyncResult =
  | (Cliente & Document)
  | SyncSuccessResult
  | SyncErrorResult;

export interface SyncResponse {
  success: boolean;
  syncedItems: number;
  successCount: number;
  errorCount: number;
  errors?: SyncErrorResult[];
}
