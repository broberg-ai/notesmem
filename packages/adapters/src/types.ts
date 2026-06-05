import type { Adapter } from "@notesmem/shared";

/** The minimal note shape an adapter delivers (built from the stored note + its attachments). */
export interface DeliverableNote {
  text: string;
  tags: string[];
  source: string;
  imageUrls: string[];
}

export interface DeliveryResult {
  ok: boolean;
  /** Destination-side id (e.g. cardmem idea_id). */
  ref?: string;
  error?: string;
}

export interface AdapterDriver {
  type: string;
  deliver(note: DeliverableNote, adapter: Adapter): Promise<DeliveryResult>;
}
