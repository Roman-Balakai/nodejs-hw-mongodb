import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ["work", "home", "personal"],
            required: true,
            default: "personal",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        photo: {
            type: String,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const contactsCollection = mongoose.model("contacts", contactsSchema);