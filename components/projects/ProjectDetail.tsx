import { useProjectStore } from '@/stores/useProjectStore';

export function ProjectDetail() {
  const { selectedProject } = useProjectStore();
  if (!selectedProject) return <div className="text-gray-400">상세 정보가 없습니다.</div>;
  return (
    <div className="space-y-6 px-2 md:px-0">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedProject.title}</h2>
        <p className="text-gray-700 text-base md:text-lg mb-4">{selectedProject.description}</p>
      </div>
      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => window.open(selectedProject.pdfUrl, '_blank')}
          disabled={!selectedProject.pdfUrl}
        >
          PDF 다운로드
        </button>
      </div>
      <div>
        <h3 className="font-semibold mb-1">인스타 피드</h3>
        {selectedProject.instagramFeed && selectedProject.instagramFeed.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {selectedProject.instagramFeed.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`인스타 피드 ${i + 1}`}
                className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded border flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded">인스타 피드가 없습니다.</div>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-1">입주민 인터뷰</h3>
        {selectedProject.interviews && selectedProject.interviews.length > 0 ? (
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            {selectedProject.interviews.map((iv, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded border">
                <div className="font-semibold mb-1">{iv.name}</div>
                <div className="text-gray-700 text-sm md:text-base whitespace-pre-line">{iv.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded">입주민 인터뷰가 없습니다.</div>
        )}
      </div>
      {/* 커뮤니티 프리뷰/입주 신청 진입 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <a
          href="/resident/community"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          aria-label="커뮤니티 프리뷰 보기"
        >
          커뮤니티 프리뷰 보기
        </a>
        <a
          href="/application"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="입주 신청하기"
        >
          입주 신청하기
        </a>
      </div>
    </div>
  );
} 