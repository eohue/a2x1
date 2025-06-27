'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { ErrorMessage } from '@/components/common/ErrorMessage';

// Types
export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  channel: string;
  timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface CommunityPreviewProps {
  /** Number of posts to display */
  maxPosts?: number;
  /** Custom CSS classes */
  className?: string;
  /** Whether to show the "View All" button */
  showViewAllButton?: boolean;
}

// Skeleton component for loading state
const PostSkeleton: React.FC = () => (
  <div className="flex space-x-3 p-4 animate-pulse">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-12"></div>
    </div>
  </div>
);

// Individual post item component
const PostItem: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const getAvatarContent = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? '방금 전' : `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <article className="flex space-x-3 p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0">
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={`${post.author.name} 프로필`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {getAvatarContent(post.author.name)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-gray-900 truncate">
            {post.author.name}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimestamp(post.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-2 leading-relaxed">
          {formatContent(post.content)}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {post.channel}
          </span>
          {(post.imageUrl || post.videoUrl) && (
            <div className="flex items-center text-xs text-gray-500">
              {post.imageUrl && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {post.videoUrl && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// Empty state component
const EmptyState: React.FC = () => {
  const t = useTranslations('community');
  
  return (
    <div className="text-center py-12 px-4">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
        />
      </svg>
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        아직 커뮤니티 게시글이 없습니다
      </h3>
      <p className="text-sm text-gray-500">
        첫 번째 게시글을 작성해보세요!
      </p>
    </div>
  );
};

// Main CommunityPreview component
export const CommunityPreview: React.FC<CommunityPreviewProps> = ({
  maxPosts = 5,
  className = '',
  showViewAllButton = true,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('community');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock API call - replace with actual API endpoint
        const response = await fetch('/api/community/feed?limit=' + maxPosts, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('커뮤니티 게시글을 불러오는데 실패했습니다.');
        }
        
        const { data, error: apiError } = await response.json();
        
        if (apiError) {
          throw new Error(apiError);
        }
        
        // Transform API data to match our component interface
        const transformedPosts: CommunityPost[] = (data || []).map((item: any) => ({
          id: item.id,
          author: {
            name: item.user?.name || '알 수 없음',
            avatar: item.user?.avatar_url,
          },
          content: item.content,
          channel: item.channel || '일반',
          timestamp: item.created_at,
          imageUrl: item.image_url,
          videoUrl: item.video_url,
        }));
        
        setPosts(transformedPosts);
      } catch (error) {
        console.error('Error fetching community posts:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [maxPosts]);

  const handleViewAll = () => {
    router.push('/resident/community');
  };

  return (
    <section className={`bg-white rounded-lg shadow-sm border ${className}`} aria-labelledby="community-preview-title">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 id="community-preview-title" className="text-lg font-semibold text-gray-900">
            커뮤니티 소식
          </h2>
          {showViewAllButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAll}
              aria-label="커뮤니티 전체보기"
            >
              전체보기
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading && (
          <div>
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {!loading && !error && posts.length === 0 && <EmptyState />}

        {!loading && !error && posts.length > 0 && (
          <>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </>
        )}
      </div>

      {!loading && !error && posts.length > 0 && showViewAllButton && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleViewAll}
            aria-label="커뮤니티 전체 게시글 보기"
          >
            커뮤니티 전체 보기
          </Button>
        </div>
      )}
    </section>
  );
};

export default CommunityPreview;
