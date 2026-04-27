import Message from '../models/Message.js';
import User from '../models/User.js';

const getRoomId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

export const getChatHistory = async (req, res) => {
  try {
    const roomId = getRoomId(req.user._id, req.params.userId);
    const messages = await Message.find({ roomId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { roomId, receiver: req.user._id, seen: false },
      { seen: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).sort({ createdAt: -1 });

    const userIds = new Set();
    messages.forEach((msg) => {
      const otherId = msg.sender.toString() === req.user._id.toString()
        ? msg.receiver.toString()
        : msg.sender.toString();
      userIds.add(otherId);
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name avatar role');
    const chats = users.map((u) => {
      const lastMsg = messages.find((m) => {
        return m.sender.toString() === u._id.toString() || m.receiver.toString() === u._id.toString();
      });
      const unseenCount = messages.filter((m) => {
        return m.sender.toString() === u._id.toString()
          && m.receiver.toString() === req.user._id.toString()
          && !m.seen;
      }).length;
      return {
        user: u,
        lastMessage: lastMsg ? lastMsg.content : '',
        lastMessageAt: lastMsg ? lastMsg.createdAt : null,
        unseenCount,
      };
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const receiverId = req.params.userId;
    const roomId = getRoomId(req.user._id, receiverId);

    const message = await Message.create({
      roomId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    const populated = await message.populate('sender receiver', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

