const mongoose  = require("mongoose");
const schema = mongoose.Schema;
const notesSchema = new schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, required: false },
  userId: { type: schema.Types.ObjectId, required: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", notesSchema);