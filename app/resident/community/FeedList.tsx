import React from 'react';
import { FeedItem, FeedItemProps } from './FeedItem';

interface FeedListProps {
  items: FeedItemProps[];
}

export const FeedList: React.FC<FeedListProps> = ({ items }) => (
  <section aria-label="피드 리스트" className="space-y-4">
    {items.map((item, idx) => (
      <FeedItem key={idx} {...item} />
    ))}
  </section>
); 