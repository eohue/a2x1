import React from 'react';

export interface FeedItemProps {
  author: string;
  date: string;
  channel: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export const FeedItem: React.FC<FeedItemProps> = ({ author, date, channel, content, imageUrl, videoUrl }) => (
  <article className="p-4 sm:p-6 border rounded bg-gray-50" tabIndex={0} aria-label="피드 아이템">
    <header className="flex items-center gap-2 mb-2">
      <span className="font-semibold text-base md:text-lg">{author}</span>
      <span className="text-xs md:text-sm text-gray-400">{date}</span>
      <span className="ml-auto text-xs md:text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{channel}</span>
    </header>
    <p className="mb-2 text-base md:text-lg">{content}</p>
    <div className="flex flex-col sm:flex-row gap-2">
      {imageUrl && <img src={imageUrl} alt="첨부 이미지" className="w-full sm:w-32 h-32 object-cover rounded" />}
      {videoUrl && <video src={videoUrl} controls className="w-full sm:w-32 h-32 rounded" aria-label="첨부 영상" />}
    </div>
  </article>
); 