"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.css";
import Comment from "../Comment";

const initialComments = [
  {
    author: "John Doe",
    content:
      "Man, I wish I could have been at one of their concerts in the '70s! 🎤✨",
    timeAgo: "10 minutes ago",
    reactions: [
      {
        icon: "👍",
        count: 10,
      },
      {
        icon: "🎸",
        count: 5,
      },
    ],
  },
  {
    author: "Jane Smith",
    content:
      "Right? Those shows were pure magic! The energy must have been insane! 🔥",
    timeAgo: "5 minutes ago",
    reactions: [
      {
        icon: "❤️",
        count: 10,
      },
      {
        icon: "😂",
        count: 5,
      },
    ],
  },
];

const possibleReactions = ["👍", "👆🏽", "❤️", "😂", "🎧", "💯", "🎸", "🎤"];
export default function CommentThread() {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);

  const updateReactions = (index: number) => {
    setComments((prevComments) => {
      // Get random reaction
      const randomIndex = Math.floor(Math.random() * possibleReactions.length);
      const newReaction = possibleReactions[randomIndex];

      // Get target comment
      const targetComment = prevComments[index];

      // Check if reaction already exists
      const existingReaction = targetComment?.reactions?.find(
        (reaction) => reaction.icon === newReaction
      );

      // Create updated reactions array
      const updatedReactions = existingReaction
        ? targetComment.reactions.map((reaction) =>
            reaction.icon === newReaction
              ? { ...reaction, count: reaction.count + 1 }
              : reaction
          )
        : [...targetComment.reactions, { icon: newReaction, count: 1 }];

      // Update the comment with new reactions
      const updatedComment = {
        ...targetComment,
        reactions: updatedReactions,
      };

      // Return new array with updated comment
      return prevComments.map((comment, i) =>
        i === index ? updatedComment : comment
      );
    });
  };

  useEffect(() => {
    // Set timer to open tray after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dep

  useEffect(() => {
    const updateInterval = setInterval(() => {
      updateReactions(0);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      updateReactions(1);
    }, 8000); // Update every 8 seconds

    return () => clearInterval(updateInterval);
  }, []);

  return (
    <div className={styles.container}>
      <Comment {...comments[0]} />
      <motion.div
        className={styles.tray}
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "fit-content" : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="sub"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.subComponentWrapper}>
                <Comment {...comments[1]} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
