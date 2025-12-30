import { model, Schema } from "mongoose";

const meetingSchema = new Schema({
  user_id: { type: String },
  meetingCode: { type: String, required: true },
  data: { type: Date, default: new Date(), required: true },
});

const Meeting = new model("Meeting", meetingSchema);
export { Meeting };
