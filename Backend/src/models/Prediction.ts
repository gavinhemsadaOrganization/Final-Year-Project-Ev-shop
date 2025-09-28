import { Schema, model, Document, Types } from 'mongoose';

export interface IPrediction extends Document {
  _id: Types.ObjectId;
  conversation_id: Types.ObjectId;
  user_inputs: Record<string, any>;
  prediction_result: Record<string, any>;
}

const PredictionSchema = new Schema<IPrediction>({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'ChatbotConversation', required: true },
  user_inputs: { type: Object, required: true },
  prediction_result: { type: Object, required: true },
}, { timestamps: true });

export const Prediction = model<IPrediction>('Prediction', PredictionSchema);