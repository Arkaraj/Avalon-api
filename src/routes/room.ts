/* eslint-disable eqeqeq */
import { Router } from "express";
import { CallbackError } from "mongoose";
import { isAdmin } from "../isAdmin";
import Room from "../models/Room";

const room = Router();

// All the routes here is tested and it works

// Creating a room
room.post("/", async (req: any, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.send({ msg: "Please Enter the Name and Description", msgError: true });
  } else {
    const window = {
      admin: [req.userId],
      name,
      description,
    };

    const room = await Room.create(window);
    room.save((err) => {
      if (err) {
        console.log("ERROR: " + err);
        res.send({ msg: "Some Internal error occured", msgError: true });
      } else {
        res.send({ msgError: false, room });
      }
    });
  }
});

// Get all rooms you are a member of
room.get("/", async (req: any, res) => {
  // This is an array
  const rooms = await Room.find({ members: req.userId });

  // All the rooms where user is the admin
  // admin will be a array
  const admin = await Room.find({ admin: req.userId });

  res.send({ rooms, admin });
});

// Create and Updating Message
room.put("/msg/:roomId", isAdmin, async (req: any, res) => {
  const { mesg } = req.body;

  try {
    const room = await Room.findById(req.params.roomId);
    if (room?.message == "") {
      room.message = mesg;

      room.save((err) => {
        if (err) {
          res.send({ msg: "Internal Server error", msgError: true });
        } else {
          res.send({ msg: room.message, msgError: false });
        }
      });
    } else if (room?.message) {
      room.message = mesg;

      room.save((err) => {
        if (err) {
          res.send({ msg: "Internal Server error", msgError: true });
        } else {
          res.send({ msg: room.message, msgError: false });
        }
      });
    } else {
      res.send({ msg: "Internal Server Error", msgError: true });
    }
  } catch (err) {
    res.send({ msg: "Invalid room", msgError: true });
  }
});

// Remove the Message
room.delete("/msg/:roomId", isAdmin, async (req: any, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (room?.message) {
      room.message = "";

      room.save((err) => {
        if (err) {
          res.send({ msg: "Internal Server error", msgError: true });
        } else {
          res.send({ room, msgError: false });
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Invalid room", msgError: true });
  }
});

// Leaving a room
room.delete("/:roomId", async (req: any, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      res.send({ msg: "Invalid room", msgError: true });
    } else {
      room.members = room.members.filter((r) => r != req.userId);

      room.save((err: CallbackError) => {
        if (err) {
          res.send({ msg: "Some error occured", msgError: true });
        } else {
          res.send({ room, msgError: false });
        }
      });
    }
  } catch (err) {
    res.send({ msg: "Invalid room", msgError: true });
  }
});

export default room;
