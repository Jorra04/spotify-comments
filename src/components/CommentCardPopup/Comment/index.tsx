import Image from "next/image";
import styles from "./styles.module.css";
import { CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";

export interface CommentProps {
  author: string;
  timeAgo: string;
  content: string;
  likes: number;
}
export default function Comment({
  author,
  timeAgo,
  content,
  reactions = [],
  replies = [],
}: CommentProps) {
  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <CircleUserRound size={40} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{author}</span>
          <span className={styles.timeAgo}>{timeAgo}</span>
        </div>
        <p className={styles.text}>{content}</p>
        <div className={styles.actions}>
          {reactions.map((reaction, index) => (
            <button key={index} className={styles.reactionButton}>
              <span className={styles.reactionIcon}>{reaction.icon}</span>
              <motion.span
                key={reaction.count}
                className={styles.reactionCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {reaction.count}
              </motion.span>
            </button>
          ))}
          <button className={styles.replyButton}>Reply</button>
        </div>
      </div>
    </div>
  );
}
